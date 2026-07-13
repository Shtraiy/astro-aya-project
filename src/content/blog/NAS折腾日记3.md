---
title: "NAS折腾日记3"
tags:
  - 技术
  - 折腾
  - NAS
pubDatetime: 2026-07-14 00:00:00
description: "NAS折腾日记第三篇：犯贱用apt装了官方docker-compose，导致飞牛主页的Docker面板直接崩掉，排查到最后发现是两个Docker在打架。"
featured: false
draft: false
---

## 导火索

上一篇把自动化追番流水线搭好了，就想着通过Vibe coding设计一套自动化总结文献的流程

但是代码怎么改都不满意，然后整个人就魔怔了，疯狂用命令行肘击docker，然后鬼脑上头，为什么不直接用命令行来控制docker呢，然后就安装了docker-compose

使用apt包管理器，然后灾难发生了

Docker 管理面板直接整个灰了。整个模块显示"未知错误"。

![Docker面板变灰了](https://images.wynio.pw:28090/api/images/NAS%E6%8A%98%E8%85%BE%E6%97%A5%E8%AE%B03/Docker%E9%9D%A2%E6%9D%BF%E5%8F%98%E7%81%B0%E4%BA%86.png)

天都塌了，看到这个我就知道今晚有的忙了

## 排查

然后就是连忙 SSH 连上 NAS，看看容器还在不在：

```bash
docker ps
```

还好，容器都还在跑。又试了试 `docker images`，镜像也都在。

松了一口气。心想这不正好吗——本来装 docker-compose 就是为了用命令行管理容器，飞牛面板挂了就挂了，CLI 又不是不能用

然而好景不长。试着拉了一个新镜像，结果死活拉不下来，一直超时。想着应该是 Docker Hub 在国内的访问问题，顺手加了几个镜像加速源，顺便按网上教程调了一堆 daemon 配置。

改完之后重启 Docker 服务，习惯性敲了 `docker images`——

```
IMAGE   ID             DISK USAGE   CONTENT SIZE   EXTRA
```

空了

ani-rss、qBittorrent、Jellyfin、AstrBot、lucky……之前辛辛苦苦拉的那一堆镜像，一个不剩，干净得像刚装完系统。`docker ps` 也空了，容器全没了。

然后我打开Gemini，把报错一股脑贴进去，绝望地肘击哈基米，疯狂追问"怎么恢复"、"怎么修复"、"镜像去哪了"。

Gemini 也很配合，给了一堆操作——卸载重装 Docker、清理残留配置、重建网络、重启 daemon……我一个一个照着敲，越敲越不对劲。每执行一步，问题不但没解决，反而更糟了。Docker 服务开始启动失败，systemd 日志里红的绿的搅在一起完全看不懂。

搞到最后只能重装了

### 破局

事情发展到这个地步，我已经冷静下来了

再次确认过容器还在运行，我做出了一个选择，没有选择重装系统，而是继续思考症结所在

最后我抓住了问题的关键，去哪找到飞牛系统绑定的docker路径？

为了得到这个答案，我开始查找fnos的论坛，我相信绝对有不少人出过问题

果不其然，我找到了，一位提问者的回复下面，有人给出了飞牛的默认配置

![破局](https://images.wynio.pw:28090/api/images/NAS%E6%8A%98%E8%85%BE%E6%97%A5%E8%AE%B03/%E7%A0%B4%E5%B1%80.png)

那现在要做的就很明确了：**重新安装 Docker，然后把飞牛面板指向正确的路径。**

## 赎罪

有了飞牛的默认配置，就知道该往哪走了。现在要做的就是三步：**用正确的姿势重装 Docker、注入飞牛的数据目录配置、让面板重新认到 Docker。**

### 第一步：通过 apt 重装 Docker（这次用阿里云镜像加速）

上次一把梭 `apt install docker-compose` 翻车了，这次老老实实走标准 Debian 流程：

```bash
# 安装前置依赖
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 导入 Docker 官方 GPG 密钥（走阿里云镜像）
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/debian/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 写入 Docker 软件源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://mirrors.aliyun.com/docker-ce/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker 全家桶
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

注意最后一行——这次装的是 `docker-compose-plugin`，不是那个独立的 `docker-compose` 包。它是 Docker CLI 的插件，通过 `docker compose` 子命令调用，不会引入额外的依赖冲突。

### 第二步：注入飞牛的默认配置

Docker 装好了，但默认的 daemon.json 是空的。得把飞牛原来的配置写进去，让它知道数据该存哪、镜像从哪拉：

```bash
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "data-root": "/vol1/docker",
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-file": "5",
    "max-size": "100m"
  },
  "proxies": {},
  "registry-mirrors": [
    "https://docker.fnnas.com",
    "https://registry.hub.docker.com",
    "https://docker.1ms.run"
  ]
}
EOF
```

配好之后载入新配置并启动：

```bash
# 载入新配置并启动
sudo systemctl daemon-reload
sudo systemctl restart docker
sudo systemctl enable docker
```

其实到这里，飞牛的docker主页已经正常了

## 反思

冷静下来复盘，整个过程可以说是一连串的错误决策叠加出来的灾难。

最主要的问题，也是最大的问题

**我为什么没备份？**

飞牛系统本身就带快照功能，我却没有实现进行备份

甚至没想到

要是有一张快照，从发现问题到解决大概只需要五分钟——回滚，重启，完事。而不是像个无头苍蝇一样折腾了一整晚，把系统从"面板认不到 Docker"一路搞到"系统里没有 Docker"，再灰溜溜地从零装回来。

不得不多熬了两个小时的夜来处理这个问题，只能说在这方面的管理，我的水平还有待加强...

先写这么多了，困死了
