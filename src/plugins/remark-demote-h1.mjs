/**
 * 文章页模板已经用 h1 显示标题，Markdown 正文里的 h1 会形成重复主标题。
 * 在 remark 阶段统一降为 h2，既修复语义结构，也让目录能收进正文首个标题。
 */
export default function remarkDemoteH1() {
  return tree => {
    const walk = node => {
      if (!node || typeof node !== "object") return;
      if (node.type === "heading" && node.depth === 1) node.depth = 2;
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };

    walk(tree);
  };
}
