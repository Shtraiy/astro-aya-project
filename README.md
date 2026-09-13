# SilentCage

个人博客，基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改编。

> **Attribution:** This project is adapted from [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev), licensed under the [MIT License](LICENSE). Original copyright © 2023 Sat Naing.

## 功能

- 文章列表、标签、归档、分页与模糊搜索（Fuse.js）
- 音乐藏馆（`/music`）：专辑展示与播放器
- 友链页面（`/links`）与 PGP 公钥页面（`/pgp`）
- RSS、sitemap、robots.txt
- 每篇文章在构建时自动生成 OG 分享图，站点另有默认图 `/og.png`
- 浅色 / 深色主题，中文排版（霞鹜文楷屏幕版）

## 技术栈

| 用途     | 方案                                                                                                                  |
| :------- | :-------------------------------------------------------------------------------------------------------------------- |
| 框架     | [Astro](https://astro.build/) 7（静态输出）                                                                           |
| 类型     | TypeScript 5                                                                                                          |
| 交互组件 | React 18（搜索框等）                                                                                                  |
| 样式     | Tailwind CSS 4，通过 `@tailwindcss/vite` 接入，配置写在 `src/styles/base.css`                                         |
| Markdown | `@astrojs/markdown-remark` 的 unified 管线，插件：`remark-toc` / `remark-collapse` / `remark-github-blockquote-alert` |
| 代码高亮 | Shiki（浅色 min-light / 深色 night-owl 双主题）                                                                       |
| OG 图片  | satori + `@resvg/resvg-js`，字体从 Google Fonts 与其镜像获取，woff/woff2 用 `fontverter` 转成 satori 可读的 sfnt      |

## 环境要求

- Node.js `>= 22.12.0`（Astro 7 的要求），`.nvmrc` 指定 24
- npm `>= 9`

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
```

构建与预览：

```bash
npm run build    # astro check && astro build，产物在 ./dist
npm run preview
```

## 常用命令

| 命令                   | 说明                               |
| :--------------------- | :--------------------------------- |
| `npm run dev`          | 启动开发服务器（`localhost:4321`） |
| `npm run build`        | 类型检查 + 构建生产版本到 `./dist` |
| `npm run preview`      | 本地预览构建结果                   |
| `npm run sync`         | 生成内容集合的类型声明             |
| `npm run lint`         | ESLint 检查                        |
| `npm run format`       | Prettier 格式化                    |
| `npm run format:check` | 只检查格式，不写入（CI 用这个）    |

## 项目结构

```
/
├── .github/workflows/ci.yml     # CI：npm ci → lint → format:check → build
├── public/                      # 静态资源（图片、图标、播放器脚本）
├── src/
│   ├── assets/socialIcons.ts    # 社交图标
│   ├── components/              # 组件（含音乐播放器）
│   ├── content/
│   │   ├── blog/                # 文章（.md）
│   │   └── albums/              # 音乐专辑（.md）
│   ├── content.config.ts        # 内容集合的 schema（注意：不在 src/content 里）
│   ├── layouts/
│   ├── pages/                   # 路由：posts / tags / archives / music / links / pgp …
│   ├── styles/base.css          # Tailwind 主题与全局样式
│   ├── utils/                   # 排序、标签、OG 图片生成等
│   └── config.ts                # 站点信息、社交链接
├── astro.config.ts
└── package.json
```

## 写文章

文章放在 `src/content/blog/`，文件名即 URL 片段（支持中文）。frontmatter 字段：

```yaml
---
title: 文章标题
author: Resalia
pubDatetime: 2026-09-13T08:00:00+08:00
modDatetime: 2026-09-14T10:00:00+08:00 # 可选，用于「最近更新」排序
featured: false # 可选，置顶
draft: false # 可选，草稿不会出现在列表与 RSS 中
tags: [随笔]
description: 列表页与 OG 图里显示的摘要
ogImage: "" # 可选，指定后不再自动生成 OG 图
canonicalURL: "" # 可选
---
```

专辑放在 `src/content/albums/`，字段为 `title` / `artist` / `theme`（`#RRGGBB` 主题色）/ `cover` / `date` / `tracks[]` / `lyrics[]`。

## OG 图片

- 每篇文章构建时生成 `/posts/<标题>.png`；站点默认图是 `/og.png`（由 `src/utils/og-templates/site.tsx` 渲染）
- 字体按「标题 + 作者 + 站点名」请求子集：拉丁字符用 IBM Plex Mono，中文回退到 Noto Sans SC
- 拉取顺序为 Google Fonts 与几个国内镜像并行，结果缓存在 `node_modules/.cache/fonts`（`npm ci` 会清掉缓存，届时首次构建需要联网，约多花 40 秒）

## 部署

**Vercel**：直接连仓库，构建命令 `npm run build`，输出目录 `dist`。Node 版本由 `package.json` 的 `engines.node` 决定（Vercel 面板里的 Node.js Version 会被它覆盖，所以会出现 "Node.js Version Override" 提示，属正常）。

**Docker**：

```bash
docker build -t silentcage .
docker run -p 8080:80 silentcage
```

`Dockerfile` 用 `node:lts` 构建静态文件，再用 nginx 提供；`docker-compose.yml` 是开发用容器（挂载源码跑 `npm run dev`）。

## 代码规范

- Prettier 对源码、配置与 `src/pages` 生效；`src/content/blog`（文章正文由作者手写维护）与 `public/js/*.min.*`（第三方压缩产物）已在 `.prettierignore` 中排除
- ESLint 忽略 `dist/`、`.astro` 与 `**/*.min.js|css`
- 行尾统一为 LF，规则见 `.gitattributes`

## License

本项目遵循 MIT 许可证。原始版权归 Sat Naing 所有，改编部分版权归 Resalia 所有。

详见 [LICENSE](LICENSE) 文件。
