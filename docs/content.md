# 写文章与页面内容

## 文章

放在 `src/content/blog/`，文件名即 URL 片段（支持中文），frontmatter：

```yaml
---
title: 文章标题
author: Resalia
pubDatetime: 2026-09-13T08:00:00+08:00
modDatetime: 2026-09-14T10:00:00+08:00 # 可选，用于「最近更新」
featured: false # 可选，置顶
draft: false # 可选，草稿不进列表与 RSS
tags: [随笔]
description: 列表页与 OG 图里显示的摘要
ogImage: "" # 可选，不填会自动生成
canonicalURL: "" # 可选
---
```

标签颜色是**按标签名算出来的稳定色相**（`src/utils/tagHue.ts`），不用手工配置，
同一个标签在任何页面都是同一个颜色。

## 正文里可嵌入的块

正文是 `.md`，写不了 Astro 组件，所以这几块用「原生 HTML + `src/styles/base.css`
里的全局样式」实现，零依赖。**每个外层标签后面要空一行**，里面的内容才会按 markdown 解析。

````html
<!-- 带序号的步骤条 -->
<div class="steps">
  1. **准备环境**：确认 Node 版本。 2. **装依赖**：`npm ci`。
</div>

<!-- 标签页（标签栏由脚本生成；没有 JS 时顺序排列） -->
<div class="tabs" data-tabs>
  <div data-tab="Debian / Ubuntu">```bash sudo apt install foo</div>
</div>
````

</div>

<div data-tab="Arch Linux">

```bash
sudo pacman -S foo
```

</div>

</div>

<!-- 折叠块：原生 details，类名必须叫 collapsible -->
<details class="collapsible">
<summary>展开看完整配置</summary>

正文照常写 markdown。

</details>

<!-- 剧透：默认糊掉，悬停或点击显形 -->

结局是<span class="spoiler">主角其实早就把坑填完了</span>。

`````

> 折叠块不能叫 `.collapse` —— Tailwind 自带 `.collapse { visibility: collapse }`，
> 会把 summary 直接藏掉。

## 代码行的标注

写在代码行末尾，shiki 渲染时会把这些注释删掉（页面上看不到）：

| 写法                           | 效果                                   |
| :----------------------------- | :------------------------------------- |
| `// [!code highlight]`         | 高亮这一行                             |
| `// [!code focus]`             | 聚焦这一行，其余行淡出（悬停恢复）     |
| `// [!code ++]` / `// [!code --]` | diff 增删（带 +/− 标记与绿红底色） |
| `// [!code error]` / `warning` | 标红 / 标黄                            |

注释符号按语言写（`//`、`#`、`--` 都行），**但必须写在有语法高亮的代码块里**
（```` ```js ```` 这种）—— 纯文本块或语言标错时不会解析。转换器注册在
`astro.config.ts`，样式在 `base.css` 的「代码行标注」一节。

## 图片

正文图片会在构建时自动补上 `loading="lazy"` / `decoding="async"`
（`src/plugins/rehype-lazy-images.mjs`），不用手动写。

## 关于页 / 首页的个人信息

数据全在 `src/data/profile.ts`：`PROFILE`（头像、网名、副标题、一句话、坐标、
自我介绍段落、首页用的 `shortIntro`）、`EDUCATION`（含校徽图片与品牌色）、
`FAVORITES`、`ABOUT_SITE`。页面结构在 `src/pages/about.astro`，通常不用动。

名片上的社交标签来自 `src/config.ts` 的 `SOCIALS`，加一条链接就多一枚标签。

## 友链

数据源是 `src/data/links.json`（页面与友链圈脚本共用）：

```json
{
  "name": "对方站名",
  "intro": "一句话介绍",
  "link": "https://example.com",
  "avatar": "https://example.com/avatar.png",
  "feed": "https://example.com/rss.xml",
  "theme": { "background": "#009688", "text": "rgb(235, 171, 87)" }
}
`````

`feed` 和 `theme` 都可选：前者用于友链圈抓取，后者让这张卡保留对方站点的配色。
本站信息（申请友链时给对方抄的字段）与申请须知在 `src/data/links.ts`。
