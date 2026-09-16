#!/usr/bin/env node
/**
 * 正文图片流水线（构建前手动跑一次，不是每次构建都跑）
 *
 * 干三件事：
 * 1. **本地化**：正文里指向自建图床（images.frp.wynio.pw）的图片下载到
 *    `public/images/<图床里的分组>/<文件名>`，正文引用改成本地路径 ——
 *    这样正文图不再依赖家里的 NAS / frp 在线。
 * 2. **压缩**：把正文引用的图片转成 WebP（GIF 保留动画），宽度上限 1600px；
 *    只有明显更小才替换，否则保留原图。
 * 3. **改写正文**：把引用换成新的本地路径（`.png` → `.webp`）。
 *
 * 被替换掉的原始文件会移进 `.trash/image-optimize-<日期>/`，可回滚。
 *
 * 用法：
 *   node scripts/optimize-images.mjs --dry-run   只看计划，不下载不写盘
 *   node scripts/optimize-images.mjs             真的执行
 */
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const contentDir = path.join(root, "src/content/blog");
const publicDir = path.join(root, "public");
const trashDir = path.join(root, ".trash", `image-optimize-${new Date().toISOString().slice(0, 10)}`);

const dryRun = process.argv.includes("--dry-run");

/** 宽度上限（像素）：手机横屏 + 显示器 1x 都够用，2x 屏也还过得去 */
const MAX_WIDTH = 1600;
/** WebP 质量 */
const QUALITY = 80;
/** 小于这个体积的图不折腾 */
const MIN_BYTES = 120 * 1024;
/** 至少省这么多才替换 */
const MIN_SAVING = 0.15;

const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g;

const decodeSafe = value => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * 收集「src 下除文章正文以外」的全部文本，用来判断某张图是否被别处引用。
 * 被页面 / 组件 / 数据文件引用的图不参与改写（免得改了正文、别处引用断掉）。
 */
async function collectNonContentText() {
  const chunks = [];
  const walk = async dir => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (full.startsWith(contentDir)) continue;
      if (entry.isDirectory()) await walk(full);
      else if (/\.(astro|ts|tsx|js|mjs|cjs|json|md|css)$/i.test(full)) {
        chunks.push(await readFile(full, "utf8"));
      }
    }
  };
  await walk(path.join(root, "src"));
  return chunks.join("\n");
}

const toPosix = value => value.split(path.sep).join("/");

/**
 * markdown 的图片地址里不能出现空格（会被当成标题的起点，整条语法就废了），
 * 括号同理。写回正文前把这些字符编码掉。
 */
const encodeUrlPath = value =>
  value
    .split("/")
    .map(segment =>
      segment
        .replace(/ /g, "%20")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
    )
    .join("/");
const sizeOf = async file => (await stat(file)).size;
const human = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

/** Windows 上文件句柄常要晚一拍才释放，删除失败就退避重试 */
async function removeWithRetry(file, attempts = 10) {
  const { unlink } = await import("node:fs/promises");
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await unlink(file);
      return;
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      // 刚写过的文件在 Windows 上可能被杀毒/索引器短暂占着，等一等再试
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }
}

/**
 * 原图挪进 .trash（可回滚）后再删。
 * 尽力而为：万一删不掉（被别的进程占着），点出来让作者稍后手动清，
 * 不能因为一个文件锁就把整轮迁移中断 —— 引用已经指向 .webp 了。
 */
async function disposeOriginal(localRelative, localAbsolute) {
  try {
    const trashPath = path.join(trashDir, localRelative);
    await mkdir(path.dirname(trashPath), { recursive: true });
    await copyFile(localAbsolute, trashPath);
    await removeWithRetry(localAbsolute);
  } catch {
    console.warn(`  ! 原图暂时删不掉（已备份到 .trash）：${localRelative}`);
  }
}

/** 把图床 URL 映射成本地相对 public 的路径：/images/<分组>/<文件名> */
function remoteToLocalPath(rawUrl) {
  const url = new URL(rawUrl);
  const segments = url.pathname.split("/").filter(Boolean); // api/images/<分组>/<文件名>
  const imagesIndex = segments.indexOf("images");
  const rest = imagesIndex >= 0 ? segments.slice(imagesIndex + 1) : segments;
  const safe = rest.map(segment => decodeSafe(segment).replace(/[\\/:*?"<>|]/g, "_"));
  return `images/${safe.join("/")}`;
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

/** 转 WebP；不可行或收益不足时返回 null */
async function toWebp(source, target, { animated = false } = {}) {
  const before = await sizeOf(source);
  if (before < MIN_BYTES) return null;

  let instance;
  try {
    instance = sharp(source, animated ? { animated: true } : {});
    const meta = await instance.metadata();
    const pipeline =
      meta.width && meta.width > MAX_WIDTH
        ? instance.resize({ width: MAX_WIDTH, withoutEnlargement: true })
        : instance;

    await pipeline.webp({ quality: QUALITY, effort: 5 }).toFile(target);
  } catch (error) {
    console.warn(`  ! 转 WebP 失败（保留原图）：${path.basename(source)} — ${error.message}`);
    return null;
  } finally {
    // 不显式释放，文件句柄会拖到 GC，Windows 上随后删原图必报 EBUSY
    instance?.destroy?.();
  }

  const after = await sizeOf(target);
  if (after >= before * (1 - MIN_SAVING)) {
    await removeWithRetry(target);
    return null;
  }
  return { before, after };
}

async function main() {
  const files = (await readdir(contentDir)).filter(file => file.endsWith(".md"));
  const nonContentText = await collectNonContentText();
  const stats = { downloaded: 0, converted: 0, bytesBefore: 0, bytesAfter: 0, failed: [] };

  for (const file of files) {
    const fullPath = path.join(contentDir, file);
    const original = await readFile(fullPath, "utf8");
    let changed = false;
    /* 收集「原串 → 新串」，最后一次性替换：同一张图在一篇里出现多次也能全替掉 */
    const replacements = new Map();

    for (const match of [...original.matchAll(IMAGE_RE)]) {
      const [whole, alt, src, title] = match;
      const isRemote = /^https?:\/\//i.test(src);
      const isLocal = src.startsWith("/images/");
      if (!isRemote && !isLocal) continue;

      let localRelative; // 相对 public 的路径（posix）
      if (isRemote) {
        localRelative = remoteToLocalPath(src);
      } else {
        localRelative = decodeSafe(src.replace(/^\//, "").split("?")[0]);
      }

      const localAbsolute = path.join(publicDir, localRelative);

      /* 被页面 / 组件 / 数据文件引用的图不动（只处理正文独占的图） */
      if (nonContentText.includes(localRelative)) {
        if (!isRemote) continue;
      }

      /* 1) 远程图先落地 */
      if (isRemote) {
        if (!existsSync(localAbsolute)) {
          if (dryRun) {
            console.log(`[计划] 下载 ${src}\n        → ${localRelative}`);
          } else {
            try {
              await download(src, localAbsolute);
              stats.downloaded += 1;
            } catch (error) {
              console.warn(`  ! 下载失败：${src} — ${error.message}`);
              stats.failed.push(src);
              continue;
            }
          }
        }
        if (dryRun) continue;
      }

      /*
        2) 压缩：转 WebP（同一个目录、同名 .webp）。
        注意「原图已不在、但 .webp 已经生成」的情况 —— 同一张图被多篇文章引用时，
        前一篇已经把它转过了，后面的文章只需要把引用改到 .webp。
      */
      const ext = path.extname(localAbsolute).toLowerCase();
      const webpTarget =
        ext === ".webp" ? null : `${localAbsolute.slice(0, -ext.length)}.webp`;
      let newRelative = localRelative;
      if (dryRun && existsSync(localAbsolute) && ext !== ".webp") {
        const size = await sizeOf(localAbsolute);
        if (size >= MIN_BYTES) {
          console.log(`[计划] 压缩 ${localRelative}（${(size / 1024).toFixed(0)} KB → WebP）`);
        }
      }
      if (!dryRun && webpTarget) {
        if (existsSync(localAbsolute) && !existsSync(webpTarget)) {
          const result = await toWebp(localAbsolute, webpTarget, {
            animated: ext === ".gif",
          });
          if (result) {
            stats.converted += 1;
            stats.bytesBefore += result.before;
            stats.bytesAfter += result.after;
            newRelative = toPosix(path.relative(publicDir, webpTarget));
            await disposeOriginal(localRelative, localAbsolute);
          }
        } else if (existsSync(webpTarget)) {
          newRelative = toPosix(path.relative(publicDir, webpTarget));
          if (existsSync(localAbsolute)) {
            await disposeOriginal(localRelative, localAbsolute);
          }
        }
      }

      /* 3) 改写正文引用 */
      if (newRelative !== localRelative || isRemote) {
        const replacement = `![${alt}](/${encodeUrlPath(newRelative)}${title ?? ""})`;
        replacements.set(whole, replacement);
        changed = true;
      }
    }

    if (changed && !dryRun) {
      let updated = original;
      for (const [whole, replacement] of replacements) {
        updated = updated.split(whole).join(replacement);
      }
      await writeFile(fullPath, updated);
      console.log(`✓ 已更新 ${file}`);
    }
  }

  const saving = stats.bytesBefore - stats.bytesAfter;
  console.log(
    `\n下载 ${stats.downloaded} 张，压缩 ${stats.converted} 张，` +
      `体积 ${human(stats.bytesBefore)} → ${human(stats.bytesAfter)}（省 ${human(saving)}）`
  );
  if (stats.failed.length > 0) {
    console.warn(`有 ${stats.failed.length} 张下载失败，正文里的远程引用保持不变：`);
    for (const url of stats.failed) console.warn(`  - ${url}`);
  }
  if (stats.converted > 0) {
    console.log(`原图备份在 ${toPosix(path.relative(root, trashDir))}/`);
  }
}

await main();
