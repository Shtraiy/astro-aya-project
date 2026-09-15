# 站点体验补强设计（分类 / 全文搜索 / 字体 / 外链 / SEO）

- 日期：2026-09-15
- 状态：设计已确认，待实施
- 范围：借鉴本地参考主题（`参考主题/hana-blog`）中已被实际验证过的做法，补齐本站五处缺口

## 1. 背景

本站（SilentCage，AstroPaper 改编）此前已从参考主题移植了一批能力：正文块（Steps / Tabs /
Collapse / Spoiler）、代码块语言标签与复制按钮、代码行标注、图片 lightbox、目录滚动高亮、
首页统计条、语义色令牌。核对两边代码后，仍存在五处「参考主题有实践、本站缺失」的缺口。

设计原则（沿用本站既有约束）：

1. 纯静态输出，页面不做运行时外部请求（现有例外：收藏页音频流、评论组件）。
2. 能在构建期算完的，就不放到运行时。
3. 万不得已不引依赖；引依赖要换到明确收益。

## 2. 非目标

- 不做双语 i18n（参考主题的 `/en` 镜像在它自己 31 篇文章里一篇英文都没有，纯脚手架）。
- 不把参考主题的 MDX 组件族搬过来（本站正文是 `.md`，用不到；需要时按 `.tabs` 的思路用
  原生 HTML + 全局样式实现）。
- 不改造友链圈（本站构建期抓 RSS 快照的做法优于参考主题的运行时私有 API）。
- 不动既有工作区改动（草稿预览、`.gitignore`、未跟踪的新文章）。

## 3. 子项设计

### 3.1 分类（category）

**结论**：新增互斥的单值 `category` frontmatter 字段，配一份分类配置表，产出分类总览页与
分类详情页。

取舍：

- 单值字段 + 配置表（采用）。`src/data/categories.ts` 一处定义 slug、说明、图标、色相、
  排序；schema 用 `z.enum(分类名)`，写错分类名直接构建失败。
- 从 tags 派生映射（弃）。一个标签只能归属一类，多标签文章必然归得不顺。
- 多值 `categories`（弃）。与 tags 职责重叠，且「分类」应当是互斥栏目。

命名：分类名即 URL 片段，沿用本站中文 slug 风格（与 `/tags/随笔/` 一致），不使用
`番剧·游戏` 这类含分隔符的名字（`lodash.kebabcase` 会把 `·` 变成 `-`，URL 难看）。

第六类命名调整：导航里「收藏」已经指音乐收藏页（`/collection/`），因此把原拟的
「收藏」类改名为 **「分享」**（当前收录的是一篇网站归档）。若更倾向「音乐 + 网站归档」
合并成一类，则分类收为五类。

路由与页面：

| 路径 | 内容 |
| --- | --- |
| `/categories/` | 总览：每类一张卡（图标 / 名称 / 文章数 / 说明 / 最近一篇） |
| `/categories/<分类>/` | 该分类文章列表，分页每页 `SITE.postPerPage`（6） |

导航：「文章」后新增「分类」。文章页 meta 行（日期 / 阅读时长 / 标签）在标签前插入分类链接。

### 3.2 全文搜索

**结论**：采用 Pagefind（构建后生成索引）。

现状：搜索页把 `title` + `description` 内联进 HTML，正文不参与索引，站内搜索实际搜不到正文。

取舍：

- Pagefind（采用）。真全文、摘要片段、关键词高亮、索引不占页面体积、有中日韩分词处理。
  代价：索引在构建后生成，dev 环境没有索引，需要提示或额外生成步骤。
- 全文 Fuse（弃）。语料仅 152 KB，性能不是问题，但 Fuse 按空白切词，中文正文会退化成超长
  token，召回很差，要做好得自己加 bigram 预处理，工作量反超 Pagefind。
- 混合（保留 Fuse 做联想、Pagefind 做全文）（弃）。两套实现、两处 bug 面；仅当「dev 下必须
  能搜」成为硬需求时再考虑。

落地要点：`npm i -D pagefind @pagefind/default-ui`；`pagefind --site dist` 接在
`build:base` 之后，使 `build:vercel` 自动受益；dev 下首页搜索页显示「索引需构建后可用」提示，
并提供 `npm run search:index` 把索引生成到 `public/pagefind/`（gitignore）供本地搜索。

验证：用「母鸡卡」「Navidrome」「NAS折腾」「香港」「STM32」五个中文词实测召回与高亮；
若召回不理想，兜底为 bigram 预处理或退回全文 Fuse。

### 3.3 字体自托管

**结论**：字体改由 npm 包自托管，并让 OG 图生成改读本地字体。

现状两处外网依赖：运行时从 `fonts.googleapis.com` 与 jsdelivr 拉取 Inter / IBM Plex Mono /
霞鹜文楷；构建期 OG 图生成还会去 Google Fonts 下载 IBM Plex Mono + Noto Sans SC
（`src/utils/loadGoogleFont.ts`，带镜像回退，缓存进 `node_modules/.cache/fonts`）。

取舍：

- npm 包自托管（采用）：`@fontsource/inter`、`@fontsource/ibm-plex-mono`、
  `lxgw-wenkai-screen-webfont`，import 其 CSS 由 Vite 打包 woff2 分片；OG 生成改读本地字体
  文件（必要时用已有 devDependency `fontverter` 转 sfnt）。构建与运行都不再依赖第三方字体源。
- 手放 `public/fonts` + 自写 `@font-face`（弃）：中文全量字体未做 unicode-range 分片就是几 MB，
  自己维护子集化流程成本高于收益。
- 中文退回系统字体栈，只自托管西文（备选）：最省体积，但站点视觉指纹（霞鹜文楷）消失，
  `base.css` 中「根字号 18px 是为文楷字形纤细而调」的设定也要跟着改。

验证：构建后 `dist` 内不再出现 `fonts.googleapis` / jsdelivr 字体引用；断网 `npm run preview`
首屏字体正常；断网可完成含 OG 图的构建。

### 3.4 正文外链

**结论**：正文外链统一加新窗口打开、`rel`，并用 CSS 画箭头。

取舍：

- `rehype-external-links`（采用，参考主题同款）：配置 `target="_blank"`、
  `rel="noopener noreferrer"` 与 `external-link` 类名；箭头的 `↗` 用 CSS `::after` 绘制而非注入
  文字，复制粘贴不带箭头、屏幕阅读器也不会念出来。库体量小且锚点 / 图片 / `mailto:` / 同域
  等边界已处理。
- 自写 rehype 插件（弃）：边界情况要自己兜，收益不抵风险。

作者侧说明写进 `docs/content.md`（外链会自动新窗口 + 箭头，个别需要豁免的写法）。

验证：正文中放站内 / 站外 / `mailto:` / 图片四类链接，确认只有站外文本链接带箭头且新窗口打开。

### 3.5 SEO 元信息

**结论**：补齐 OG 与文章结构化相关的 meta，无方案分叉。

| 字段 | 取值 |
| --- | --- |
| `og:type` | 有 `pubDatetime` → `article`，否则 `website` |
| `og:site_name` | `SITE.title` |
| `og:locale` | 由 `LOCALE.langTag` 派生 → `zh_CN` |
| `og:image:width` / `og:image:height` | 1200 / 630（与 og-templates 实际输出一致） |
| `article:author` | `SITE.profile` |
| `article:section` | 文章分类（与 3.1 联动） |
| `article:tag` | 逐条输出 `post.data.tags` |

验证：构建后 grep 一篇文章产物的 `<head>` 核对字段。

## 4. 分类映射（32 篇）

> 「分享」= 原拟的「收藏」类（见 3.1 的命名说明）。

| 分类 | 篇数 | 文章 |
| --- | --- | --- |
| 技术 | 10 | 从Hexo迁移到Astro、基于MA8601的USB2-0拓展坞、为ArchLinux安装N卡驱动、ArchLinux安装指南、ArchWSL安装指南、NAS从零到有的安装流程、NAS折腾日记1、NAS折腾日记2、NAS折腾日记3、STM32开发环境搭建 |
| 随笔 | 13 | 2025年全年总结、9月14日，一天里的几件有趣的事情、本科毕业和新的开始、尘埃落定终上岸、对近期发生的一些事的看法、近期随笔1、近期随笔2、近期随笔3、近期随笔4、开学两周了，买了一个iPad、你好李鑫、研1开学一周感想和一些心里话、Make a wish |
| 游记 | 4 | 初五游记、香港游记、五一南京行、小寒游京 |
| 番剧游戏 | 2 | 看完母鸡卡第七集后有感、与Katago对弈 |
| 音乐 | 2 | 2023迟来的新年礼物、关于我被春宵胡蝶俘虏了这档事 |
| 分享 | 1 | 收藏网页分享 |

存疑但不阻塞（可随时改一行 frontmatter）：「对近期发生的一些事的看法」可归番剧游戏；
「Make a wish」（明日方舟抽卡）可归番剧游戏；「关于我被春宵胡蝶俘虏了这档事」可归番剧游戏；
「你好李鑫」可归分享。

## 5. 实施顺序

四个阶段，每阶段独立可交付、可单独暂停；每阶段结束跑 `npm run lint` 与 `npm run build`
（后者内含 `astro check`）。

1. **分类**（本次先做）：分类配置表 → schema → 32 篇 frontmatter → 工具函数 →
   总览页与详情页 → 导航与文章页 meta 行 → 文档。
2. 外链 + SEO：正文外链插件与样式；`Layout.astro` 补 meta。
3. 字体：依赖安装 → `Layout.astro` / `base.css` 改造 → OG 字体改本地。
4. 搜索：依赖安装 → 构建脚本接线 → 搜索页替换 → 中文召回实测。

## 6. 风险与兜底

| 风险 | 兜底 |
| --- | --- |
| 分类归属不合口味（内容改动，32 个文件） | 分类名集中在配置表；改归属只需改一行 frontmatter，脚本可批量 |
| Pagefind 中文召回不达预期 | 加 bigram 预处理，或退回全文 Fuse 方案 |
| 中文字体自托管后首屏变慢 | 只保留 unicode-range 分片包；必要时改用「中文走系统字体栈」的备选方案 |
| 导航新增一项后桌面端拥挤 | 桌面端导航已用短标签，必要时把「分类」并入标签页顶部区块 |

## 7. 未纳入本次范围

文章头图 `heroImage`、系列 / 合集页、条款页、KaTeX 公式、代码块标题、脚注中文化、
关于页算法演示、文章内评分卡。这些在参考主题里多为未启用的脚手架，按需再议。
