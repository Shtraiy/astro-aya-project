import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://wynio.pw",
  author: "Resalia",
  profile: "https://wynio.pw/about",
  desc: "无言的鸟笼 —— 记录随笔、技术笔记，以及一些收藏。",
  title: "SilentCage",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 3,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
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
    href: "mailto:weihuazhen24@gmail.com",
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
    name: "PGP",
    href: "/pgp/pgp/",
    linkTitle: `${SITE.title} on PGP`,
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
