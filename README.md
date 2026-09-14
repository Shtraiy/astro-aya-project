# SilentCage

个人博客，基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改编。

> **Attribution:** This project is adapted from [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev), licensed under the [MIT License](LICENSE). Original copyright © 2023 Sat Naing.

当前版本 **v1.1.0**（主题元数据见 `package.json`）。

## 功能

- 文章列表、标签、归档、分页与模糊搜索（Fuse.js）
- 音乐收藏（`/collection`）：从 Navidrome 同步的音乐库快照，封面墙 + 艺术家筛选 +
  站内浮空播放窗（进度、音量、随机、逐首失败跳过）
- 追番（`/anime`）：从 Bangumi 同步的收藏快照，按在看 / 想看 / 看过 / 搁置 / 抛弃分组，
  带评分角标与「看到第几话」进度
- 文章页：目录、阅读进度条、代码块语言标签与一键复制、图片灯箱
- 友链页面（`/links`）
- 关于页：站长信息 + 教育经历卡片
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

| 命令                     | 说明                                     |
| :----------------------- | :--------------------------------------- |
| `npm run dev`            | 启动开发服务器（`localhost:4321`）       |
| `npm run build`          | 类型检查 + 构建生产版本到 `./dist`       |
| `npm run build:vercel`   | 先同步 Bangumi 追番再构建（Vercel 用）   |
| `npm run preview`        | 本地预览构建结果                         |
| `npm run sync`           | 生成内容集合的类型声明                   |
| `npm run sync:navidrome` | 同步音乐收藏 → `src/data/navidrome.json` |
| `npm run sync:bangumi`   | 同步追番列表 → `src/data/bangumi.json`   |
| `npm run lint`           | ESLint 检查                              |
| `npm run format`         | Prettier 格式化                          |
| `npm run format:check`   | 只检查格式，不写入（CI 用这个）          |

## 项目结构

```
/
├── .github/workflows/ci.yml     # CI：npm ci → lint → format:check → build
├── deploy/waline/               # Waline 评论服务端的 docker-compose 与部署说明
├── public/                      # 静态资源（图片、图标、播放器脚本）
├── scripts/                     # Navidrome / Bangumi 同步脚本
├── src/
│   ├── assets/socialIcons.ts    # 社交图标
│   ├── components/              # 组件
│   ├── content/
│   │   ├── blog/                # 文章（.md）
│   │   └── albums/              # 音乐专辑（.md，已无页面消费，仅作留档）
│   ├── content.config.ts        # 内容集合的 schema（注意：不在 src/content 里）
│   ├── layouts/
│   ├── data/navidrome.json      # Navidrome 收藏快照（由 sync:navidrome 生成）
│   ├── data/bangumi.json        # Bangumi 追番快照（由 sync:bangumi 生成）
│   ├── pages/                   # 路由：posts / tags / archives / collection / anime / links …
│   ├── styles/base.css          # Tailwind 主题与全局样式
│   ├── utils/                   # 排序、标签、OG 图片生成等
│   └── config.ts                # 站点信息、社交链接
├── astro.config.ts
├── vercel.json                  # Vercel 构建命令（含追番同步）
└── package.json
```

## Navidrome 音乐收藏

`/collection` 页面的数据来自 Navidrome（走它内置的 Subsonic API），在**构建时**同步成
`src/data/navidrome.json`。所以站点仍然是纯静态的：运行时不连 Navidrome，前端也不含任何凭据。

同步步骤（两种方式任选）：

1. **直接跑，脚本会问你要凭据**（推荐，密码不回显、不进 Shell 历史）

   ```bash
   npm run sync:navidrome
   ```

   依次输入 Navidrome 地址（公网 https）、用户名、密码。跑完会问要不要写进
   `.env`（已 gitignore），写了以后就不用再输。

2. **先用 `.env` 配好**（适合 CI / 无人值守）：复制 `.env.example` 为 `.env`，填
   `NAVIDROME_URL` / `NAVIDROME_USER` / `NAVIDROME_PASS`，再跑同一条命令。

同步会做两件事：

- 拉取专辑列表 → `src/data/navidrome.json`
- 下载专辑封面 → `public/images/navidrome/`（页面运行时不依赖 Navidrome 在线）

最后 `npm run build` 重新构建即可。建议在 Navidrome 里单独建一个**非管理员**账号给这一步用。

数据是构建时快照：Navidrome 里新增专辑后，重跑一次同步再构建即可。

### 站内播放与安全

收藏页点封面会打开一个浮空播放窗，音频直连 Navidrome 的 Subsonic `/rest/stream`
（支持 Range，所以可以拖进度条），不经过本站服务器。

这个接口需要认证，所以同步时会往 `src/data/navidrome.json` 写一份 `stream` 凭据
（`u` / `t` / `s`；其中 `t = md5(密码 + salt)`，而 Subsonic 接受任意 salt，
所以它等同于一份**长期有效**的凭据）。

> **⚠️ 这意味着：任何打开你收藏页的人都能拿到这份凭据，进而读取你的整个音乐库。**
> 站点是公开的话，建议改成反代在服务端注入凭据（前端只请求自己域名下的路径，
> 例如 `/nd/rest/stream?...`），这样凭据永远不出现在浏览器里。
> 播放地址只在 `src/components/CollectionPlayer.astro` 的 `streamUrl()` 里拼一次，
> 换模式是改一处的事。

## Bangumi 追番

`/anime` 页面的数据来自 Bangumi 官方 v0 API，同样在**构建时**同步成 `src/data/bangumi.json`。

```bash
# .env 里填 BANGUMI_USER=你的用户名或 UID（公开收藏不需要 token）
npm run sync:bangumi
```

- 拉取收藏（在看 / 想看 / 看过 / 搁置 / 抛弃）→ `src/data/bangumi.json`
- 下载封面 → `public/images/bangumi/`（默认开启，`BANGUMI_SKIP_COVERS=1` 可跳过）

**在 Vercel 上跑**：`vercel.json` 已经把构建命令设成 `npm run build:vercel`
（先同步追番、再构建），你只要在 Vercel 的环境变量里加一个 `BANGUMI_USER` 就行，
不需要代理 —— 构建机在墙外，直连 bgm.tv。封面是构建时下载的，不会进仓库。

**在本地跑**：大陆直连 bgm.tv 基本不通（`api.bgm.tv` 和封面图床都会超时），要挂代理：
`BANGUMI_PROXY=http://127.0.0.1:7890`，数据请求和封面下载都会走它。

同步失败不会把构建搞挂：没配 `BANGUMI_USER` 直接跳过；连不上但本地已有快照，
就沿用上一次的数据继续构建，只在日志里留一行警告。

页面是构建时快照，所以 Bangumi 里更新之后要**重新部署**才会反映出来
（Vercel 可以配 Deploy Hook + 定时任务，或者手动 Redeploy）。

## 评论（Waline）

评论区在文章底部，默认**关闭** —— `src/config.ts` 里没配服务端时整块不渲染，
页面里不会留下空标题。开启走三步：

1. 部署一个 Waline 服务端（见 [Waline 文档](https://waline.js.org/guide/get-started/)，Docker、Vercel 都行）
2. 在 `.env` 里填：

   ```
   PUBLIC_COMMENT_PROVIDER=waline
   PUBLIC_WALINE_SERVER=https://comments.example.com
   ```

3. 重新构建

组件本身不装 npm 依赖：Waline 的 JS / CSS 从 jsDelivr 按需加载，而且滚动到评论区
附近才开始下载，首屏不受影响。

**服务端放哪**：博客在 Vercel 上是纯静态的，评论服务端放哪都行，只要有个公网
HTTPS 地址。想放自己 NAS 上（和 Navidrome 一个套路：Docker + frp 映射），
照 [`deploy/waline/`](deploy/waline/README.md) 那份配置抄一遍即可，
里面把跨域、证书、备份这些坑都写了。

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

**Vercel**：直接连仓库即可，构建命令和输出目录都写在 `vercel.json` 里
（`npm run build:vercel` / `dist`）—— 它会先同步 Bangumi 追番再构建，
所以记得在 Vercel 项目里配环境变量 `BANGUMI_USER`（可选：`PUBLIC_COMMENT_PROVIDER`、
`PUBLIC_WALINE_SERVER`）。Node 版本由 `package.json` 的 `engines.node` 决定
（Vercel 面板里的 Node.js Version 会被它覆盖，所以会出现 "Node.js Version Override" 提示，属正常）。

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
