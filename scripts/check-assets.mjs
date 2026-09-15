#!/usr/bin/env node
/**
 * 静态资源体检：两个方向的检查
 *
 * 1. **引用了但文件不在**（正文里写 `/images/xxx.png`，public 下没有这个文件）→ 报错退出，
 *    这类是坏图/死链，必须修。只检查文章正文（`src/content`）与数据快照（`src/data`）——
 *    这两处的资源路径是真正决定页面能不能显示出来的；源码注释、文档里的示例路径不算。
 * 2. **文件在但没人引用**（public 里的孤儿资源）→ 只列出来当提示，不影响退出码；
 *    这类文件会白白进部署产物，攒多了就是几十 MB。
 *
 * 用法：npm run check:assets（CI 里跑第 1 类，开发时看第 2 类决定要不要清理）
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

/** 会被扫描的文本来源（正文、页面、脚本、文档、配置） */
const sourceDirs = ["src", "scripts", "docs"];
const sourceFiles = ["astro.config.ts", "vercel.json", "package.json", "README.md"];

/** 只在特定系统里按约定使用的文件，不参与"没人引用"检查 */
const ignoredPublicPaths = [
  /^pagefind\//, // 构建/本地生成，已被 gitignore
  /^\.well-known\//,
  /^robots\.txt$/,
  /^_headers$/,
  /^_redirects$/,
];

/** 判定"这看起来是个资源文件路径" */
const assetExtension =
  /\.(png|jpe?g|gif|webp|avif|svg|ico|bmp|mp3|mp4|webm|ogg|wav|pdf|woff2?|ttf|otf|zip)$/i;

const isTextFile = file =>
  /\.(md|mdx|astro|ts|tsx|js|jsx|mjs|cjs|json|css|html|yml|yaml|txt)$/i.test(
    file
  );

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

/** 收集所有源文件文本（送去重后的整串，够用且快） */
async function collectSourceText() {
  const chunks = [];
  for (const dir of sourceDirs) {
    for (const file of await walk(path.join(root, dir))) {
      if (isTextFile(file)) chunks.push(await readFile(file, "utf8"));
    }
  }
  chunks.push(await readFile(path.join(root, "public/toggle-theme.js"), "utf8").catch(() => ""));
  for (const file of sourceFiles) {
    chunks.push(await readFile(path.join(root, file), "utf8").catch(() => ""));
  }
  return chunks.join("\n");
}

/** 只扫"决定页面显示"的两处：文章正文与数据快照 */
async function collectReferenceText() {
  const chunks = [];
  for (const dir of ["src/content", "src/data"]) {
    for (const file of await walk(path.join(root, dir))) {
      if (/\.(md|mdx|json|ts)$/i.test(file)) {
        chunks.push(await readFile(file, "utf8"));
      }
    }
  }
  return chunks.join("\n");
}

const toPosix = value => value.split(path.sep).join("/");
const decodeSafe = value => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const sourceText = await collectSourceText();
const decodedSource = decodeSafe(sourceText);
const referenceText = await collectReferenceText();
const publicFiles = (await walk(publicDir)).map(file =>
  toPosix(path.relative(publicDir, file))
);

/* ---------- 1. 引用了但文件不在 ---------- */
const referencedAssets = new Set();
/* 只在同一行内匹配，别让正则跨过换行把整段正文吞进来 */
for (const match of referenceText.matchAll(
  /["'(]([^"'\n)]*?\/[^"'\n)]+)["')]/g
)) {
  const target = match[1];
  if (!assetExtension.test(target)) continue;
  referencedAssets.add(decodeSafe(target.replace(/^\//, "")));
}

const publicSet = new Set(publicFiles);
const missing = [...referencedAssets].filter(
  asset => !publicSet.has(asset) && !asset.startsWith("http")
);

/* ---------- 2. 文件在但没人引用 ---------- */
const unreferenced = publicFiles
  .filter(asset => !ignoredPublicPaths.some(pattern => pattern.test(asset)))
  .filter(asset => {
    if (decodedSource.includes(asset)) return false;
    return !decodedSource.includes(path.posix.basename(asset));
  })
  .sort();

const fileSizes = new Map();
for (const asset of unreferenced) {
  const size = (await import("node:fs")).statSync(path.join(publicDir, asset)).size;
  fileSizes.set(asset, size);
}
const unusedBytes = [...fileSizes.values()].reduce((sum, size) => sum + size, 0);

/* ---------- 输出 ---------- */
if (missing.length > 0) {
  console.error(`✖ 有 ${missing.length} 个引用指向不存在的文件：`);
  for (const asset of missing) console.error(`  - ${asset}`);
}

if (unreferenced.length > 0) {
  console.warn(
    `⚠ public 下有 ${unreferenced.length} 个文件没有任何引用（合计 ${(
      unusedBytes /
      1024 /
      1024
    ).toFixed(1)} MB）：`
  );
  for (const asset of unreferenced.slice(0, 20)) {
    console.warn(`  - ${asset} (${(fileSizes.get(asset) / 1024).toFixed(0)} KB)`);
  }
  if (unreferenced.length > 20) {
    console.warn(`  … 另有 ${unreferenced.length - 20} 个，见 --list`);
  }
  if (process.argv.includes("--list")) {
    for (const asset of unreferenced) console.warn(`  - ${asset}`);
  }
}

if (missing.length === 0 && unreferenced.length === 0) {
  console.log("✓ 静态资源检查通过：没有坏引用，也没有未使用的文件");
}

process.exit(missing.length > 0 ? 1 : 0);
