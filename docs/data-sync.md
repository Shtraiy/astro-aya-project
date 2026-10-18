# 数据同步（构建时快照）

三条管道都在**构建时**把外部数据落成本地 JSON + 图片，页面运行时不再请求外部服务。
改完数据要重跑同步脚本再构建；Vercel 那边由 `npm run build:vercel` 自动跑前两条
（Navidrome 不在 Vercel 跑，见下）。

所有脚本共用 `scripts/lib/http.mjs`：配了代理就走 `curl`，否则用 `fetch`，
两个同步脚本行为一致。

---

## 1. Navidrome 音乐快照（页面暂时停用）

```bash
npm run sync:navidrome        # 交互式问凭据；或先写好 .env 静默执行
```

| 产出                       | 说明                                            |
| :------------------------- | :---------------------------------------------- |
| `src/data/navidrome.json`  | 专辑列表 + 每张专辑的曲目（供后续恢复页面使用） |
| `public/images/navidrome/` | 封面，文件名是专辑 id                           |

环境变量：`NAVIDROME_URL` / `NAVIDROME_USER` / `NAVIDROME_PASS`（建议单独建只读账号）；
可选 `NAVIDROME_LIMIT`（默认 500）、`NAVIDROME_COVER_SIZE`（默认 300）、
`NAVIDROME_SKIP_COVERS=1`、`NAVIDROME_PROXY`。

同步脚本仍可用于更新本地快照，但只写入专辑、曲目和封面元数据，
不会把 `u / t / s` 播放凭据写入 JSON。音乐收藏页和常驻播放器当前不会参与构建。

以后恢复播放器时，播放请求应通过 NAS 上的 Lucky 反向代理，
由代理在服务端注入 Navidrome 凭据，避免把长期 token 发布到前端。

---

## 2. Bangumi 追番 → `/anime`

```bash
npm run sync:bangumi
```

| 产出                     | 说明                                                                             |
| :----------------------- | :------------------------------------------------------------------------------- |
| `src/data/bangumi.json`  | 收藏（在看/想看/看过/搁置/抛弃）+ 全站均分 `score`、排名 `rank`、进度 `epStatus` |
| `public/images/bangumi/` | 封面，文件名是条目 id                                                            |

环境变量：`BANGUMI_USER`（用户名或 UID）、`BANGUMI_PROXY`、`BANGUMI_TOKEN`（私密收藏才需要）、
`BANGUMI_LIMIT`（每个分类上限，默认 200）、`BANGUMI_SKIP_COVERS=1`。

要点：

- **UID 有前提**：官方接口参数是 `{username}`，规范写明「设置了用户名之后无法使用 UID」。
  用 `https://bangumi.tv/user/<UID>` 打开一次，地址栏跳成字母形式时那个才是用户名。
- **本地跑要代理**：大陆直连 `api.bgm.tv` 与封面图床都会超时，配
  `BANGUMI_PROXY=http://127.0.0.1:7890`；Vercel 构建机在墙外，不需要。
- **失败不阻断构建**：没配 `BANGUMI_USER` 直接跳过；连不上但已有快照就沿用旧的。
- 页面显示的是**全站均分**（`subject.score`），不是个人评分；个人评分存在 `rate` 字段里
  但页面不用。

---

## 3. 友链圈 → `/links`

```bash
npm run sync:friend-circle
```

读 `src/data/links.json` 的 `friends`：`feed` 填了就直接抓，没填先去对方首页找
`<link rel="alternate" type="application/rss+xml">`，再试 `/rss.xml`、`/feed`、`/feed.xml` 等。
每人取最新若干篇，合并排序后写到 `src/data/friends-posts.json`。

可选：`FRIEND_CIRCLE_PER_SITE`（默认 2）、`FRIEND_CIRCLE_LIMIT`（默认 8）、`FRIEND_CIRCLE_PROXY`。
单个站点失败就跳过；全都失败沿用旧快照；文件缺失时友链页那一块整体不渲染。

---

## 4. GitHub 活跃度 → `/about`

不需要脚本：`src/utils/githubActivity.ts` 在构建时抓一次
`github-contributions-api.jogruber.de`（公开接口，不需要 token），
用户名从 `src/config.ts` 里 Github 链接解析。抓不到就不渲染那一块。

---

## 相关文件

- 脚本：`scripts/sync-*.mjs`，共用 HTTP 层 `scripts/lib/http.mjs`
- 数据：`src/data/*.json`；页面读取处都带 `try/catch`，文件缺失时退回空状态
- 环境变量模板：`.env.example`（`.env` 已 gitignore）
