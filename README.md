# SilentCage

个人博客：随笔 + 技术笔记 + 音乐收藏 + 追番 + 友链圈。
基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改编，Astro 7 + Tailwind 4，
**纯静态输出**。

> **Attribution:** Adapted from [AstroPaper](https://github.com/satnaing/astro-paper) by
> [Sat Naing](https://satnaing.dev), MIT License. Original copyright © 2023 Sat Naing.

---

## 30 秒理解这个项目

- **纯静态**：页面在构建时生成，运行时不查数据库、不调外部 API。外部数据都在构建时
  抓成 JSON 快照（`src/data/*.json`）+ 本地图片（`public/images/*`）。
- **三条数据管道**（构建时跑，详见 [docs/data-sync.md](docs/data-sync.md)）：
  Navidrome → 音乐封面墙 / Bangumi → 追番 / 友链 RSS → 友链圈。
- **唯一的运行时外链**：收藏页的音频直连 Navidrome，前端因此带一份只读凭据
  （⚠️ 见 [docs/data-sync.md](docs/data-sync.md) 的「播放凭据」）。
- **部署**：Vercel。`vercel.json` 把构建命令设成 `npm run build:vercel`，
  会在构建前自动跑同步脚本。Node `>= 22.12`（`.nvmrc` 指定 24）。

## 目录地图

> 找工作方式看这里，不必逐个文件打开。

```
src/
├── config.ts              站点信息、社交链接 SOCIALS（导航、关于页名片都读它）
├── content.config.ts      blog 集合的 schema（注意：不在 src/content 里）
├── content/blog/          文章 .md，文件名即 URL 片段（支持中文）
├── data/
│   ├── profile.ts         关于页/首页共用的个人信息，改数据只动这里
│   ├── links.json         友链数据源（页面和同步脚本共用）
│   ├── links.ts           给 links.json 补类型，外加本站信息/申请须知
│   ├── navidrome.json     音乐快照（sync:navidrome 生成，⚠️ 含播放凭据）
│   ├── bangumi.json       追番快照（sync:bangumi 生成）
│   └── friends-posts.json 友链圈快照（sync:friend-circle 生成）
├── layouts/
│   ├── Layout.astro       <html> 骨架、字体、ClientRouter、主题脚本
│   ├── Main.astro         常规页面容器 + 统一页头（图标块 + 标题 + 说明）
│   ├── PostDetails.astro  文章页：正文、版权卡、上下篇、评论区挂载点、文章级脚本
│   └── Posts / TagPosts / AboutLayout / LinksLayout / CommonPage
├── components/
│   ├── Card.tsx           文章列表卡片（首页/列表/标签页共用）
│   ├── Section.astro      「左标签 · 右内容」版式（首页分区）
│   ├── SectionBlock.astro 「图标块 + 标题 + 说明」分区（关于页/友链页）
│   ├── StatsStrip.astro   分段统计条（首页/收藏/追番共用，容器查询自适应列数）
│   ├── CollectionPlayer.astro 收藏页浮空播放窗 + 最小化迷你条（播放逻辑都在这里）
│   ├── Comments.astro     评论区（Waline，默认关闭，未配置时整块不渲染）
│   ├── PostCopyright.astro 文章底部版权卡（复制链接 / 二维码 / 分享）
│   ├── GitHubActivity.astro 关于页的 GitHub 热力图（构建时抓数据，渲染成 SVG）
│   └── Header / Footer / Icon / TOC / TagCloud / Pagination / Search
├── pages/                 路由：posts / categories（分类）/ tags / archives /
│                          search / about / links / collection（音乐）/ anime
├── styles/base.css        全局样式 + 主题令牌，改样式基本都在这里
├── utils/                 纯函数：阅读时间、slug、标签色、chip 筛选、
│                          GitHub 活跃度、OG 图模板
└── plugins/               markdown 管线插件（图片懒加载等）
scripts/                   同步脚本；lib/http.mjs 是共用 HTTP 层（支持代理）
deploy/waline/             评论服务端部署说明（评论默认关闭）
docs/                      详细文档：content / data-sync / deploy
```

## 关键约定与坑（改代码前扫一眼）

1. **颜色写法**：`--palette-*` 存的是 `"R, G, B"` 三元组，用 `rgb(var(--palette-x))`。
   要透明度用 `color-mix(in srgb, rgb(var(--palette-x)) 40%, transparent)`；
   `rgb(var(--x) / 0.4)` 是非法语法，**整条声明会被浏览器丢掉**。
   语义色（`--color-background` 等）在 `base.css` 的 `@theme inline` 里映射。
2. **根字号 18px**：页面里的 `rem` 按 18px 算，媒体查询里的 `rem` 按 16px 算
   —— 涉及宽度阈值的写 `px`，别用 `rem` 猜。
3. **Astro scoped style**：脚本用 `innerHTML` 生成的元素拿不到 scope 类，
   这类样式必须写在 `<style is:global>`（`CollectionPlayer.astro` 就是例子）。
4. **内联脚本**要加 `data-astro-rerun` 才会在站内软跳转后重跑；
   重复绑定用 `dataset.bound` 守卫（`utils/chipFilter.ts` 已内置这套）。
5. **`.md` 里可以写 HTML**，但标签后要**空一行**内容才按 markdown 解析；
   `<style>` 会原样输出成全局样式。能用 `.astro` 就别用这个写法。
6. **类名别撞 Tailwind 工具类**：`.collapse` 会让内容 `visibility: collapse`
   —— 折叠块因此叫 `.collapsible`。
7. `base.css` 有一条「正文链接 hover 反白」（`.prose a:hover`）。
   整块卡片级别的链接要加 `class="card-link"` 豁免，否则鼠标移上去整张卡会被刷成深色。
8. 统计条用**容器查询**（容器是 `#main-content` 和 `.section-row-body`），
   别改回媒体查询：首页那条会被塞进窄栏，按视口判断会把日期挤成两行。
9. `base.css` 把 `section` 统一成 `mx-auto max-w-3xl px-4`；组件里要用
   `<section>` 记得重置（见 `SectionBlock.astro`）。
10. **构建时快照**：页面不做运行时请求（音频流除外）。改了 Bangumi / Navidrome /
    友链，要重跑同步脚本再构建。

## 常用命令

| 命令                         | 作用                                            |
| :--------------------------- | :---------------------------------------------- |
| `npm run dev`                | 开发服务器（`localhost:4321`）                  |
| `npm run build`              | `astro check` + 构建到 `./dist`                 |
| `npm run build:vercel`       | 先跑 Bangumi + 友链圈同步再构建（Vercel 用）    |
| `npm run preview`            | 预览构建结果                                    |
| `npm run sync:navidrome`     | 同步音乐收藏 → `src/data/navidrome.json` + 封面 |
| `npm run sync:bangumi`       | 同步追番 → `src/data/bangumi.json` + 封面       |
| `npm run sync:friend-circle` | 抓友链 RSS → `src/data/friends-posts.json`      |
| `npm run lint` / `format`    | ESLint / Prettier（`format:check` 是 CI 用的）  |

## 改哪里

| 想改的东西               | 改哪里                                                        |
| :----------------------- | :------------------------------------------------------------ |
| 站点名 / 描述 / 社交链接 | `src/config.ts`                                               |
| 导航菜单                 | `src/components/Header.astro`                                 |
| 页头（图标块 + 标题）    | `src/layouts/Main.astro`                                      |
| 主题色 / 深浅色板        | `src/styles/base.css` 的 `:root` 与 `html[data-theme="dark"]` |
| 文章分类（六个栏目）     | `src/data/categories.ts` 的 `CATEGORIES`，加分类先改这里      |
| 首页 hero 与分区         | `src/pages/index.astro` + `Section.astro`                     |
| 关于页内容               | `src/data/profile.ts`                                         |
| 友链                     | `src/data/links.json`                                         |
| 文章排版 / 正文块语法    | [docs/content.md](docs/content.md)                            |
| 数据同步与环境变量       | [docs/data-sync.md](docs/data-sync.md)                        |
| 部署 / 评论服务端        | [docs/deploy.md](docs/deploy.md)                              |

## 有意保留的遗留项

- `src/pages/music/index.astro`：301 跳到 `/collection/`，让旧链接不 404。
- `src/components/Comments.astro` + `deploy/waline/`：评论默认关闭，随时可开。
- `scripts/sync-navidrome.mjs` 会往快照里写一份只读凭据（前端播放需要），
  风险与替代方案见 [docs/data-sync.md](docs/data-sync.md)。

## License

MIT。原始版权归 Sat Naing 所有，改编部分版权归 Resalia 所有，详见 [LICENSE](LICENSE)。
