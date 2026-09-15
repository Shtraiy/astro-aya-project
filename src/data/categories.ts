import type { IconName } from "@components/Icon.astro";

/**
 * 文章分类（栏目）。
 *
 * 分类是互斥的单值字段，写在文章 frontmatter 的 `category` 里；
 * 「关键词」那一层由 tags 负责，不受这里的枚举约束。
 *
 * 这份表的 `name` 同时承担三个角色：frontmatter 的取值、URL 片段
 * （`/categories/<name>/`）、以及 schema 枚举的来源 —— 加分类只改这里。
 */
export interface Category {
  /** 分类名，同时用作 URL 片段 */
  name: string;
  /** 总览页与页面头的一句话说明 */
  desc: string;
  /** 页面头图标块用的线性图标 */
  icon: IconName;
  /** 图标块的色相 0-359，和标签一样每个分类固定一个色 */
  hue: number;
  /** 总览页排序，小的在前 */
  order: number;
}

export const CATEGORIES: Category[] = [
  {
    name: "技术",
    desc: "装机、踩坑与折腾记录",
    icon: "tool",
    hue: 210,
    order: 1,
  },
  {
    name: "随笔",
    desc: "阶段性感想与日常琐记",
    icon: "book",
    hue: 38,
    order: 2,
  },
  {
    name: "游记",
    desc: "出门走走之后的见闻",
    icon: "map-pin",
    hue: 152,
    order: 3,
  },
  {
    name: "番剧游戏",
    desc: "番剧、游戏与观影感受",
    icon: "tv",
    hue: 278,
    order: 4,
  },
  {
    name: "音乐",
    desc: "专辑、歌单与听歌记录",
    icon: "headphones",
    hue: 330,
    order: 5,
  },
  {
    name: "分享",
    desc: "收藏的站点与值得一读的东西",
    icon: "heart",
    hue: 18,
    order: 6,
  },
];

/** schema 的枚举来源（`z.enum` 要求非空元组） */
export const CATEGORY_NAMES = CATEGORIES.map(category => category.name) as [
  string,
  ...string[],
];

/** 按名字取分类，取不到返回 undefined（页面里用它兜住旧数据） */
export const getCategory = (name: string) =>
  CATEGORIES.find(category => category.name === name);

/** 总览页 / 侧栏共用：按配置顺序排列 */
export const sortedCategories = () =>
  [...CATEGORIES].sort((a, b) => a.order - b.order);
