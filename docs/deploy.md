# 部署与工程规范

## Vercel（当前方式）

直接连仓库即可，构建命令和输出目录都写在 `vercel.json`：

```json
{ "buildCommand": "npm run build:vercel", "outputDirectory": "dist" }
```

`build:vercel` = `sync:bangumi` → `sync:friend-circle` → `build`
（构建机在墙外，抓 Bangumi 不需要代理）。

`build` = `astro check` → `astro build` → `pagefind --site dist`：最后一步扫描产物生成
站内搜索索引（`dist/pagefind/`）。索引是构建产物，所以**本地 dev 默认搜不了**：
看搜索效果用 `npm run preview`，或跑一次 `npm run search:index:dev` 把索引也写进 `public/`。

需要在 Vercel 项目里配的环境变量：

| 变量                                               | 用途                     |
| :------------------------------------------------- | :----------------------- |
| `BANGUMI_USER`                                     | 追番同步（用户名或 UID） |
| `PUBLIC_COMMENT_PROVIDER` / `PUBLIC_WALINE_SERVER` | 可选，开启评论时才要     |

`src/data/navidrome.json` 是提交进仓库的（Vercel 上不跑 Navidrome 同步），
所以**本地跑过 `sync:navidrome` 之后要记得把快照一起提交**，
否则线上音乐页会是空的。

## 构建产物

`astro build` 输出到 `./dist`，纯静态，可以直接丢给任何静态托管。
Node 版本由 `package.json` 的 `engines.node` 决定（`>= 22.12`，`.nvmrc` 是 24）。

## Docker（可选）

```bash
docker build -t silentcage .
docker run -p 8080:80 silentcage
```

`Dockerfile` 用 `node:lts` 构建静态文件再用 nginx 提供；`docker-compose.yml`
是开发用容器（挂源码跑 `npm run dev`）。

## 评论服务端（Waline，默认关闭）

评论区在文章底部，`src/config.ts` 里没配服务端时**整块不渲染**。
要开启就部署一个 Waline 服务端，然后在 Vercel / `.env` 配
`PUBLIC_COMMENT_PROVIDER=waline` + `PUBLIC_WALINE_SERVER=https://…`。

放自己 NAS 上的那份 docker-compose、frp 映射、跨域与备份说明都在
[`../deploy/waline/README.md`](../deploy/waline/README.md)。

组件本身不装 npm 依赖：Waline 的 JS / CSS 从 jsDelivr 按需加载，
而且滚到评论区附近才开始下载。

## 代码规范

- Prettier 只管源码、配置与 `src/pages`；`src/content/blog`（正文手写维护）和
  `public/js/*.min.*` 已在 `.prettierignore` 里排除
- ESLint 忽略 `dist/`、`.astro`、`**/*.min.js|css`，以及 `参考主题/**`
  （本地对照用的另一个完整项目，不提交）
- 行尾统一 LF，规则见 `.gitattributes`
- CI（`.github/workflows/ci.yml`）在主分支 push 与 PR 上跑
  `npm ci` → `lint` → `format:check` → `build`，推之前本地跑一遍最稳
