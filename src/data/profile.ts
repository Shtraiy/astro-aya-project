/**
 * 个人信息：关于页（/about）和首页「关于我」分区共用这一份数据。
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
  tagline: "桂电硕士在读 · vibe coding 最大受益者",
  /** 坐标，显示成第一枚标签 */
  location: "桂林",
  /** 自我介绍：数组里一个元素就是一段 */
  intro: [
    "桂电硕士在读研究生，vibe coding 最大受益者 —— 编程能力随着模型的迭代不断提升。",
    "平时喜欢看番剧、打游戏。这个站主要用来记录生活的点滴，偶尔会有一些技术类文章（当然，也是在 AI 大人的帮助下）。",
  ],
  /** 首页「关于我」分区里显示的那句话，想换个说法就改这里 */
  shortIntro:
    "桂电硕士在读研究生，vibe coding 最大受益者。平时喜欢看番剧、打游戏，这里记录一些生活点滴，偶尔写点技术文章。",
};

/** 教育经历：按时间倒序，想加就照着复制一条 */
export const EDUCATION = [
  {
    status: "硕士在读",
    school: "桂林电子科技大学",
    major: "机械工程 · 硕士",
    period: "2026 - 至今",
    link: "https://www.guet.edu.cn/",
    /** 校徽图片 + 底色（用学校自己的品牌色） */
    logo: "/images/education/guet.png",
    logoBg: "#003b7a",
  },
  {
    status: "本科",
    school: "桂林理工大学",
    major: "自动化 · 学士",
    period: "2022 - 2026",
    link: "https://www.glut.edu.cn/",
    logo: "/images/education/glut.png",
    logoBg: "#0a3f89",
  },
];

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
