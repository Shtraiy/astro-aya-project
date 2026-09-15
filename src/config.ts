import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://wynio.pw",
  author: "Resalia",
  profile: "https://wynio.pw/about",
  desc: "无言的鸟笼 —— 记录随笔、技术笔记，以及音乐与番剧收藏。",
  title: "SilentCage",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 3,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "zh-CN", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: false,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "http://github.com/Shtraiy",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:resalia@wynio.pw",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/profiles/76561198322010097/",
    linkTitle: `${SITE.title} on Steam`,
    active: true,
  },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/30547965",
    linkTitle: `${SITE.title} on Bilibili`,
    active: true,
  },
  {
    name: "Clock",
    href: "https://timer.wynio.pw/",
    linkTitle: `${SITE.title} on Clock`,
    active: true,
  },
  {
    name: "Linux",
    href: "https://lcm.wynio.pw/",
    linkTitle: `${SITE.title} on Linux`,
    active: true,
  },
];

/**
 * 评论区配置。
 *
 * 站点是纯静态的，评论数据不在仓库里 —— 它存在自己的评论服务端，
 * 前端只负责渲染。目前接的是 Waline（自托管，评论数据全在自己机器上）。
 *
 * 想开启：把 provider 改成 "waline"，再把 waline.server 填成你的服务端地址；
 * 或者不碰代码，在 .env 里写
 *   PUBLIC_COMMENT_PROVIDER=waline
 *   PUBLIC_WALINE_SERVER=https://comments.example.com
 * 两个都留空时评论区整块不渲染，页面里不会留下空标题。
 */
export const COMMENTS = {
  provider: (import.meta.env.PUBLIC_COMMENT_PROVIDER ?? "none") as
    "none" | "waline",
  waline: {
    /** 自建 Waline 服务端地址，例如 "https://comments.wynio.pw" */
    server: import.meta.env.PUBLIC_WALINE_SERVER ?? "",
    /** 界面语言 */
    lang: "zh-CN",
    /** 是否在评论框上方显示本文阅读量（需要服务端开启统计） */
    pageview: false,
    /** 表情包预设，例如 ["bmoji", "weibo"]；留空用 Waline 自带的那套 */
    emoji: [] as string[],
    /** 评论时必须填的字段 */
    requiredMeta: ["nick", "mail"] as string[],
  },
};
