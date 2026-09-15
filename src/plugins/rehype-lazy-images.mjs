/**
 * 给正文里的图片统一补上 `loading="lazy"` 和 `decoding="async"`。
 *
 * 为什么在构建期做：这两个属性必须出现在 HTML 里浏览器才会照做，
 * 等 JS 跑起来再加已经晚了（该下的图早下完了）。markdown 里的
 * `![alt](/images/x.png)` 渲染出来是裸的 <img>，默认是 eager。
 *
 * 文章里的图大多存在自己 NAS 上、走 frp 转发，首屏一次性拉十几张很伤，
 * 交给浏览器按视口懒加载最省事，也不用担心图片没加载时布局跳动。
 *
 * 手写了递归遍历，避免为了这一件事再装 unist-util-visit。
 */

const ATTRS = {
  loading: "lazy",
  decoding: "async",
};

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
    });
  };
}
