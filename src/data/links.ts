import linksData from "./links.json";

/**
 * 友链数据放在 links.json 里（不是这里），因为「友链圈」同步脚本也要读它 ——
 * 脚本是纯 Node 跑的，读不了 TS。这里只负责给它补上类型。
 *
 * theme 是可选字段：想让某张卡片保留对方站点的配色，就填它。
 * 比如原来的友链页里 Subilan 那张是 #009688 的底色配橙色字。
 * 不填就是站点默认的中性样式。
 *
 * feed 是可选字段：对方的 RSS/Atom 地址，用来抓「朋友们最近写了什么」。
 * 不填的话脚本会去对方首页找 <link rel="alternate"> 或试几个常见路径。
 */
export interface Friend {
  name: string;
  intro: string;
  link: string;
  avatar: string;
  /** 对方站点的订阅地址 */
  feed?: string;
  /** 这张卡单独配色（沿用对方站点的主题色） */
  theme?: {
    /** 卡片底色 */
    background?: string;
    /** 站名与介绍的文字颜色 */
    text?: string;
  };
}

export const FRIENDS = linksData.friends as Friend[];

/**
 * 本站信息：申请友链时给对方抄的字段。
 * 页面上每一行点击即复制，值可以直接改。
 */
export const SITE_INFO: { label: string; value: string }[] = [
  { label: "网站名称", value: "Nocturne" },
  { label: "网站介绍", value: "The Encyclopedia of Ivory Tower" },
  { label: "网站主题色", value: "#fc03e3" },
  { label: "网站地址", value: "https://wynio.pw" },
  { label: "头像", value: "https://wynio.pw/css/logo.png" },
];

/** 申请友链前的须知 */
export const APPLY_RULES: string[] = [
  "网站的内容必须健康合法，不得违反法律法规或包含不良信息",
  "网站内容应以原创为主，严禁包含剽窃、洗稿或极其劣质的采集内容",
  "网站若转载他人文章，必须严格遵守原作者协议并明确标注出处",
  "友链申请基于互惠原则，申请前请先在贵站添加本站链接",
  "长期无法访问的域名将被暂时移除；若无法联系到博主或长期未恢复，本站有权单方面终止友链",
];
