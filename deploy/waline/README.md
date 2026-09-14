# 把 NAS 当后端（以 Waline 评论为例）

博客在 Vercel 上是**纯静态**的：Vercel 只负责把 HTML / CSS / JS 发出去，
它和你的 NAS 之间没有任何连接。所谓"NAS 当后端"，实际是
**访客的浏览器直接去请求 NAS 上的服务**：

```
访客浏览器 ──① HTML/CSS/JS ──> Vercel（静态）
          └─② 评论 / 播放音频 ─> frps（公网 VPS）──> frp 隧道 ──> NAS
```

你的音乐收藏页已经是这套玩法了（`https://music.frp.wynio.pw:62026`），
评论只是再加一个同样的映射。

## 四个硬条件

1. **公网可达**：NAS 上的服务得有一个公网地址。你有 frp，这一步已经解决 ——
   和 Navidrome 那条映射一模一样的做法。
2. **必须 HTTPS**：Vercel 默认强制 https，https 页面里请求 http 的资源会被浏览器
   当混合内容直接拦掉。所以要复用你现在给 `*.frp.wynio.pw` 那个证书（或另签一张）。
3. **跨域白名单**：浏览器从 `wynio.pw` 去请求 `comments.xxx` 属于跨域，
   服务端要放行。Waline 用环境变量 `SECURE_DOMAINS` 控制（配了之后，
   非白名单来源一律 403）。Navidrome 播放不用管这个 —— `<audio>` 拉流不受 CORS 限制。
4. **接受"NAS 挂了就没有评论"**：静态页面在 Vercel 的 CDN 上照常打开，
   只有评论区和音乐播放会不可用。这是这套架构的好处：家里断网不会让整站挂掉。

## 步骤

### 1. NAS 上起服务

```bash
cd deploy/waline
WALINE_JWT_TOKEN=$(openssl rand -hex 32) docker compose up -d
docker compose logs -f          # 看到 "Waline server is running" 就成了
```

本机验证：

```bash
curl -s "http://127.0.0.1:8360/comment?path=/&pageSize=1&lang=zh-CN"
```

### 2. frp 映射一条 HTTPS

照着 Navidrome 那条抄一份，把端口和目标换掉就行（`62026` 那种端口号换成新的，
目标端口从 Navidrome 的 `4533` 换成 Waline 的 `8360`）：

```ini
# frpc.ini / frpc.toml 里再加一个
[waline]
type = tcp
local_ip = 127.0.0.1
local_port = 8360
remote_port = 62030
```

如果 Navidrome 那条是靠 frps 侧的 TLS 终止（`https` 类型 + 泛域名证书），
就把 `type` 换成同样的写法、`subdomain = comments`，省得再申请证书。

验证：`curl -I https://comments.frp.wynio.pw:62030` 能通、且证书有效。

### 3. 告诉博客服务端在哪

在两个地方各配一次（**Vercel 上部署时以 Vercel 的环境变量为准**，
本地 `.env` 只影响 `npm run dev` / 本地构建）：

```
PUBLIC_COMMENT_PROVIDER=waline
PUBLIC_WALINE_SERVER=https://comments.frp.wynio.pw:62030
```

Vercel：Project → Settings → Environment Variables 里加这两条，然后重新部署。

配好之后文章底部就会出现评论区（组件会等滚动到附近才去加载，
首屏不下载 Waline 的 JS）。

### 4. 备份

评论数据全在 `deploy/waline/data/waline.sqlite` 这一个文件里，
跟着你 NAS 现有的备份任务一起拷走就行。

## 常见坑

- **评论框一直转圈 / 403**：八成是 `SECURE_DOMAINS` 没放行当前域名。
  在 Vercel 的预览域名（`xxx.vercel.app`）上测试时也要加上。
- **浏览器控制台报 Mixed Content**：服务端不是 https，或者证书域名对不上。
- **评论发出去了但看不到**：`COMMENT_AUDIT: true` 时新评论要先审核，
  去 `/ui/register` 注册第一个账号（就是管理员）后在后台通过。
- **想换后端**：视频播放、追番、评论都是同一个思路 ——
  NAS 上跑服务 + frp 暴露 https + 前端填地址。追番那个不需要 NAS，
  Vercel 构建时就把数据抓好了。
