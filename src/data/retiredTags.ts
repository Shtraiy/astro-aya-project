/**
 * 已并入栏目的旧标签。
 *
 * 标签收口时把「技术 / 随笔 / 音乐 / 番剧 / 旅游 / 旅行 / 收藏」这些与栏目
 * 同义的标签从文章里撤掉了（见 README「分类与标签怎么分工」），但旧链接还散落在
 * 别处，所以这些地址保留跳转页。
 *
 * 这份表有两个消费方，必须共用同一份：
 * - `pages/tags/[tag]/[...page].astro`：为这些标签生成跳转页
 * - `astro.config.ts` 的 sitemap 过滤：跳转页不该出现在 sitemap 里
 */
export const RETIRED_TAGS: Record<string, string> = {
  技术: "技术",
  随笔: "随笔",
  音乐: "音乐",
  番剧: "番剧游戏",
  旅游: "游记",
  旅行: "游记",
  收藏: "分享",
};

/** 旧标签名列表（用作 sitemap 过滤） */
export const RETIRED_TAG_NAMES = Object.keys(RETIRED_TAGS);

/** 栏目页地址：中文要百分号编码（Location 头只能放 Latin-1） */
export const categoryPath = (name: string) =>
  `/categories/${encodeURIComponent(name)}/`;
