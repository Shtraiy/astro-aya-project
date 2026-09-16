#!/usr/bin/env node
/**
 * 预生成图片尺寸清单：`src/data/image-sizes.json`
 *
 * 为什么要有这一步：正文图片在 HTML 里带上 width/height，浏览器才能提前按宽高比
 * 占位（否则图片回来之前版面会跳，CLS）。而读取尺寸是异步的（sharp），本项目的
 * markdown 管线对异步 rehype 插件不生效 —— 所以尺寸改成构建前先算好、插件同步查表。
 *
 * 由 `npm run build`（scripts.images:sizes）自动执行，一般不用手动跑。
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public/images");
const output = path.join(root, "src/data/image-sizes.json");
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (IMAGE_EXT.test(entry.name)) files.push(full);
  }
  return files;
}

const sizes = {};
for (const file of await walk(imagesDir)) {
  try {
    const meta = await sharp(file).metadata();
    if (!meta.width || !meta.height) continue;
    // 键与正文里的写法一致：/images/<分组>/<文件名>（原样中文，不编码）
    const key = "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/");
    sizes[key] = [meta.width, meta.height];
  } catch {
    // 读不出来的（比如 svg 或损坏文件）跳过，插件那边查不到就不写宽高
  }
}

await writeFile(output, `${JSON.stringify(sizes, null, 2)}\n`);
console.log(`✓ 已写入 ${path.relative(root, output)}（${Object.keys(sizes).length} 张图）`);
