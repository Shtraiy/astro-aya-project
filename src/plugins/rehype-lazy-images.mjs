/**
 * 给正文里的图片统一补上 `loading="lazy"`、`decoding="async"`，以及本地图片的
 * `width` / `height`。
 *
 * 为什么在构建期做：这些属性必须出现在 HTML 里浏览器才会照做，等 JS 跑起来再加
 * 已经晚了（该下的图早下完了）。markdown 里的 `![alt](/images/x.png)` 渲染出来是
 * 裸的 <img>，默认是 eager。
 *
 * 尺寸来自 `src/data/image-sizes.json`（`npm run images:sizes` 在构建前生成）——
 * 本项目的 markdown 管线**不会等异步 rehype 插件**（实测：同步设置生效，await
 * 之后写的 width/height 会被丢掉），所以尺寸不能在插件里现算，只能同步查表。
 * 写进 HTML 后浏览器能提前按宽高比占位，图片回来之前版面不会跳（CLS）；
 * 宽高由 CSS `height: auto` 兜着，不会被拉变形。
 *
 * 手写了递归遍历，避免为了这一件事再装 unist-util-visit。
 */
import { readFileSync } from "node:fs";

const ATTRS = {
  loading: "lazy",
  decoding: "async",
};

function loadSizes() {
  try {
    const file = new URL("../../src/data/image-sizes.json", import.meta.url);
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    // 清单还没生成时不影响构建，只是没有宽高
    return {};
  }
}

const SIZES = loadSizes();

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type === "element") visit(node);
  const children = node.children;
  if (Array.isArray(children)) {
    for (const child of children) walk(child, visit);
  }
}

export default function rehypeLazyImages() {
  return tree => {
    walk(tree, node => {
      if (node.tagName !== "img") return;
      node.properties = node.properties ?? {};
      for (const [name, value] of Object.entries(ATTRS)) {
        // 作者显式写了就不覆盖（比如首图想 eager 加载）
        if (!node.properties[name]) node.properties[name] = value;
      }

      const src = node.properties.src;
      if (
        typeof src === "string" &&
        src.startsWith("/") &&
        !node.properties.width
      ) {
        const [cleanPath] = src.split(/[?#]/);
        const size = SIZES[decodeURIComponent(cleanPath)];
        if (size) {
          node.properties.width = size[0];
          node.properties.height = size[1];
        }
      }
    });
  };
}
