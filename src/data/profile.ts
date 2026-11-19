/**
 * 关于页展示的网名、兴趣与博客资料。
 * 要填的内容都在这里，页面结构不用动。
 */

/** 名片 */
export const PROFILE = {
  /** 头像：放到 public/ 下，这里写路径 */
  avatar: "/css/logo.png",
  /** 网名 */
  name: "褪色的花见鸟",
  /** 副标题：英文名 / 站点名之类 */
  alias: "Resalia · SilentCage",
  /** 一句话简介，显示在名字下面 */
  tagline: "vibe coding 最大受益者",
  /** 自我介绍：数组里一个元素就是一段 */
  intro: [
    "编程能力随着模型的迭代不断提升。",
    "平时喜欢看番剧、打游戏。这个站主要用来记录生活的点滴，偶尔会有一些技术类文章（当然，也是在 AI 大人的帮助下）。",
  ],
};

/** 喜欢的东西：两列表，value 可以挂链接 */
export const FAVORITES: { label: string; value: string; href?: string }[] = [
  { label: "歌手", value: "藍月なくる、明透 等" },
  { label: "专辑", value: "AD:PIANO V" },
  { label: "游戏", value: "《黑暗之魂》系列" },
];

/** 关于本站：两列表 */
export const ABOUT_SITE = [
  { label: "开始运营", value: "2020 年 11 月 30 日" },
  { label: "名字由来", value: "来自 Endorfin. 蓝专的《無言の鳥籠》" },
  { label: "域名", value: "wynio.pw（曾用 wynio.online）" },
];
