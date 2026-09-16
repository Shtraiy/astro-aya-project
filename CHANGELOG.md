# 更新记录

本项目从 2.0.0 起记录变更；更早的版本没有逐条留档。

## 2.1.0 — 2026-09-16

一轮「正文图片 + 检索 + 可达性」的更新：正文图从自建图床搬进仓库并压缩（省下 40+ MB），搜索结果能按栏目筛选，文章底部多了相关阅读。

### 新增

- **正文图片本地化**：83 张原本走自建图床（NAS + frp）的图片下载进 `public/images/<分组>/`，正文引用改成本地路径 —— 正文图不再依赖家里的 NAS 在线（构建产物里已无远程图，438 条本地引用 0 缺失）。
- **图片压缩**：正文引用的图片统一转 WebP（GIF 保留动画、宽度上限 1600px），**61.3 MB → 19.0 MB**；被替换的原图备份在 `.trash/image-optimize-<日期>/`。脚本 `npm run images:optimize` 幂等，可重复跑。
- **图片尺寸进 HTML**：构建前生成 `src/data/image-sizes.json`（`npm run images:sizes`），正文图统一带 `width`/`height`（101/101），浏览器能提前按宽高比占位，图片加载时不再跳版。
- **搜索结果按栏目筛选**：文章页写入 Pagefind 的 `data-pagefind-filter="栏目"`，搜索面板多出「栏目」分组（技术 4 / 随笔 1 …）。
- **相关阅读**：文章底部按「同栏目 + 共享标签」推荐 3 篇，构建时算好、页面零 JS。
- **`npm run check`**：单独跑 `astro check`，不必再借 `npm run build`。
- **尊重系统的「减少动态效果」**：`prefers-reduced-motion: reduce` 时关闭平滑滚动与过渡动画。

### 修复

- **图片地址含空格导致整条失效**：`Ave Mujica第七集观后感` 这类带空格的目录，markdown 会把 `![alt](/a b/x.png)` 解析成「地址 + 标题」而整句变纯文本（那篇文章的图全部没显示）。引用改为 `%20` 编码；`check:assets` 现在会拦这类写法。

## 2.0.1 — 2026-09-15

收尾清理：把仓库里攒下的死资源清出去，并把界面里剩下的英文无障碍文案换成中文。

### 变更

- **静态资源清理**：`public/` 下 48 个没有任何引用的文件（20.2 MB）移出仓库，部署体积从 73 MB 降到约 52 MB；移出的文件保留在本地 `.trash/unused-assets-2026-09-15/`，可随时回滚。
- **新增资源体检脚本**（`npm run check:assets`，CI 已接入）：正文或数据里引用了但不存在的资源会报错退出，`public/` 里的孤儿文件列出来提示。
- **老文章去掉第三方播放器**：`2023迟来的新年礼物`、`近期随笔2` 里的 APlayer + Meting（jsdelivr + 网易云 API）换成指向站内 `/collection/` 的链接，运行时不再请求第三方。
- **补上重复的描述**：四篇「近期随笔」原先共用同一句 description，改成各自的摘要，列表页与 OG 分享图不再重复。
- **移除失效图床图片**：`你好李鑫`、`近期随笔2` 里指向 i.loli.net 的 3 张图（该图床已不可用）。
- **界面文案中文化**：`Skip to content`、`Published:` / `Updated:` / `at`、`Previous` / `Next` / `Pagination`、`Open Menu`、`Search`、主题按钮的 `Toggles light & dark` 与 `light` / `dark` 无障碍名称，以及 YouTube 视频 iframe 的 `title`。
- **站内搜索关键词写进 URL**（`/search/?q=…`）：搜索结果可分享、刷新后保留。

## 2.0.0 — 2026-09-15

一次围绕「信息架构 + 检索 + 性能」的大更新：把重复的浏览入口收敛成一个，补上真正的全文搜索，字体改为自托管，并修掉两个会让浏览器返回键失灵的 bug。

### 新增

- **文章分类（栏目）**：六个互斥栏目（技术 / 随笔 / 游记 / 番剧游戏 / 音乐 / 分享），定义集中在 `src/data/categories.ts`，同时作为 content schema 的枚举 —— 写错栏目名构建直接失败。文章页顶部有栏目筛选条，点一下就地过滤，地址同步成 `?category=<栏目>`（可分享、可刷新），年份条与年份分组的篇数跟着重算。
- **全文搜索（Pagefind）**：构建后生成静态索引（中文分词、中文界面、同源无外链），只索引标了 `data-pagefind-body` 的页面 —— 32 篇文章正文 + 关于 / 友链 / 收藏 / 追番；导航、栏目页、标签云不进索引。命令：`npm run search:index`，本地 dev 想搜先跑 `npm run search:index:dev`。
- **字体自托管**：Inter / IBM Plex Mono（Fontsource，只取 latin 子集与实际用到的字重）与霞鹜文楷屏幕版（97 个 unicode-range 分片按需加载），运行时不请求 Google Fonts 或 jsdelivr。
- **文章页按年份分组**：原「归档」页并入文章页，年份当分组标题（沿用年份水印）、页头年份条可跳转；文章页不再分页，一页到底。
- **404 页重做**：人话标题、主次分明的「回首页 / 搜索文章」、六个栏目 chips、客户端填入出错路径与「报告坏链」邮件；并加 `robots: noindex`。
- **站外链接统一处理**：正文里的 http/https 链接自动新窗口 + `rel="noopener noreferrer"`，尾标 `↗` 由 CSS 绘制（复制不带、屏幕阅读器不念）；自家域名、`mailto:` 与相对链接不受影响。
- **文章上下篇按栏目导航**：同一栏目内循环（栏目内不足 3 篇回落全站），文案带上栏目名。
- **脚注中文化**：`脚注 / 返回内容 / ↑`，不再出现英文默认标签。
- **元信息补齐**：`og:type`、`og:site_name`、`og:locale`、OG 图尺寸、`article:author/section/tag`，RSS 每篇输出 `<category>`。

### 变更（可能影响外部链接）

- 导航收敛为：文章 / 标签 / 收藏 / 追番 / 友链 / 关于我 + 搜索；「分类」「归档」不再占导航位。
- `/archives/`、`/categories/`、旧的 `/posts/2…6` 跳转回 `/posts/`：ASCII 路径由 `vercel.json` 提供真 301，页面里也有静态跳转页兜底。
- 与栏目同义的旧标签（技术 / 随笔 / 音乐 / 番剧 / 旅游 / 旅行 / 收藏）已从文章 frontmatter 撤掉，旧标签地址保留跳转页（meta refresh + canonical + noindex），并在 sitemap 中排除。
- 六个 `/categories/<栏目>/` 页面保留，作为无 JS 时的兜底与主题落点，但不再进导航。

### 修复

- **返回键失灵（筛选页）**：栏目筛选写 URL 时用 `history.replaceState(null, …)` 覆盖掉了 Astro 视图过渡存在 `history.state` 里的 `{ index, scrollX, scrollY }`，导致按返回键时「地址回到文章列表、页面却还停在文章上」。改为原样透传 `history.state`。
- **返回键失灵（文章目录）**：目录点击时的 `history.pushState(null, …)` 有同样问题，改为交给视图过渡自己处理页内锚点（它会先保存再恢复 state）。
- **移动端上下篇不对齐**：原来右侧那条在所有宽度都右对齐，窄屏堆叠时两行左右不一；重做为卡片式导航（窄屏等宽堆叠、≥640px 才左右分列）。
- **sitemap 混入空壳 URL**：跳转页与 `/search/` 不再进 sitemap。
- **自家域名被当成外链**：正文里写自己站点的完整 URL 不再加新窗口与 `↗`。
- **空栏目死芯片**：配置里存在的栏目若一篇都没有，不再出现在筛选条上。

### 工程

- 移动端实测：390×844 视口下 13 个页面零横向溢出，表格 / 代码块 / 热力图均在容器内自适应或滚动。
- 校验：`npm run lint`、`npm run format:check`、`npm run build`（含 `astro check` 与 Pagefind 索引）全绿。
