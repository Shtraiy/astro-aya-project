---
title: "NAS折腾日记2"
tags:
  - 技术
  - 折腾
  - NAS
pubDatetime: 2026-07-11 00:00:00
description: "NAS折腾日记第二篇：用AstrBot+ani-rss+Jellyfin搭建全自动追番流水线，从订阅到下载再到刮削海报墙，一条龙全自动。"
featured: false
draft: false
---

上一篇把frp和图床搞定了，外网访问的问题暂时告一段落。

但NAS的玩法有很多，其中对我来说比较实用的就是自动化追番

以前追番的流程可能是这样的，首先去bangumi看看有没有想看的，然后记一下更新时间，更新的时候去kazumi看

或者就是时间到了忘记看，过了几天才发现更新了去看

有人喜欢这样追番，但是我更倾向于更新的时候提醒我该看了，把番剧下载到本地方便观看

那么有没有一种自动化追番的手段呢，通过qq群聊让astrbot的agent自动调用工具进行订阅，然后下载到本地并保证每天提醒更新情况

有的，当然有，得益于ani-rss这个强大的追番工具，我们的梦想终于得到实现，下面来介绍这个过程

> ani-rss 项目地址：[https://github.com/wushuo894/ani-rss](https://github.com/wushuo894/ani-rss)

## 整体架构

先画一下这套自动化追番流水线长什么样：

<div class="mermaid">
flowchart LR
    Mikan[蜜柑计划<br/>Mikan Project] -->|RSS订阅| AniRSS[ani-rss<br/>追番管理]
    AniRSS -->|推送种子| QB[qBittorrent<br/>下载器]
    QB -->|下载完成| AniRSS
    AniRSS -->|重命名+移动| Media[媒体库目录]
    Media -->|自动刮削| Jellyfin[Jellyfin<br/>媒体服务器]
    AstrBot[AstrBot<br/>QQ机器人] -->|MCP调用| AniRSS
    User[用户] -->|指令| AstrBot
    User -->|观看| Jellyfin
</div>

简单来说就是一条链：**蜜柑计划提供片源 → ani-rss负责订阅和调度 → qBittorrent负责下载 → ani-rss整理入库 → Jellyfin刮削展示**。再加上AstrBot作为交互入口，在QQ群里就能查追番状态。

下面一个一个来。

## AstrBot

之前在NAS那篇里提过一嘴AstrBot，这里展开说一下。

### 为什么选AstrBot

市面上的QQ机器人框架不少，但AstrBot有几个点比较对我胃口：

- **多平台支持**：QQ、微信、钉钉、飞书都能接，不绑死一个平台
- **插件生态**：插件市场丰富，不想写代码也能用现成的
- **MCP支持**：这个最关键——它原生支持MCP协议，可以直接把ani-rss的MCP接口接进去。这一点后面会细说
- **Docker部署**：一条compose直接起，和NAS上的其他服务管理方式统一

部署就不展开来说了，过于简单

### 配置MCP连接ani-rss

这是整个自动化体系里最重要的环节。ani-rss本身就暴露了MCP Server接口，AstrBot可以通过MCP协议直接调用ani-rss的功能。

在AstrBot的MCP配置里添加ani-rss的连接：

```json
{
  "mcpServers": {
    "ani-rss": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-ani-rss"],
      "env": {
        "ANI_RSS_URL": "http://你的NAS_IP:7788"
      }
    }
  }
}
```

配置好之后，AstrBot就能调ani-rss的MCP工具了，可以利用工具操作nas本地的ani-rss

## ani-rss 与 MCP

ani-rss 本身就是一个成熟的追番管理工具，部署和基础配置（RSS 订阅、下载器对接、重命名规则）在 WebUI 里点点就能完成，这里不展开。

这一节重点说 ani-rss 最让我惊喜的功能——**MCP 支持**。

### 什么是 MCP

MCP（Model Context Protocol）是 Anthropic 提出的一套开放协议，简单理解就是让 AI 模型能够调用外部工具的标准化接口。一个服务只要实现了 MCP Server，AI 就能通过 MCP Client 去调用它暴露出来的工具。

ani-rss 内置了 MCP Server，意味着**任何支持 MCP 的客户端都能直接操控 ani-rss**——不需要打开 WebUI，不需要手动操作，全部交给 AI 去调度。

### ani-rss 暴露了哪些 MCP 工具

ani-rss 的 MCP 接口暴露了相当完整的追番操作能力，包括但不限于：

- **番剧搜索**：按关键词在蜜柑计划中搜索番剧
- **订阅管理**：查看当前订阅列表、添加/取消订阅
- **下载状态查询**：查看某部番的下载进度、当前队列状态
- **RSS 更新触发**：手动触发一次 RSS 拉取

换句话说，你在 WebUI 上能做的事情，MCP 接口基本都能做。这就给自动化留出了非常大的想象空间。

### 为什么这很重要

传统的追番流程是：打开浏览器 → 进入 ani-rss WebUI → 搜索番剧 → 添加订阅 → 等下载。每一步都需要人手动参与。

有了 MCP 之后，流程变成了：**在 QQ 群里发一条消息 → AI 调用 MCP 工具 → ani-rss 执行操作**。

这也是为什么我选择 AstrBot 作为入口——AstrBot 原生支持 MCP Client，只需要在配置里把 ani-rss 的 MCP 地址填进去，机器人就能直接调用 ani-rss 的所有能力。具体联动效果见下一节。

## Jellyfin：媒体展示层

下载完了、整理好了，总得有个地方看吧。

飞牛系统自带的飞牛影视体验已经很棒了，刮削全面，播放体验也好，但是生态不如Jellyfin

Jellyfin负责最后一步——刮削元数据、生成海报墙、提供播放服务。

把ani-rss的输出目录挂载到Jellyfin的媒体库目录，Jellyfin检测到新文件就会自动刮削。

### 配置番剧库

在Jellyfin后台创建媒体库的时候，**类型一定要选"Shows"（电视节目）**，不要选"Movies"。番剧的季、集号信息需要靠这个类型才能正确解析。

刮削器我装了 **AniList** 和 **Bangumi** 两个插件。AniList 对日番元数据的覆盖很全，Bangumi 则更贴近中文用户的习惯，番剧别名、简介、评分都更符合国内观感。两个一起用，刮削准确率和信息完整度比默认的 TMDB 高出一大截。

### 配合frp实现外网观看

上一篇搭好了frp，直接把Jellyfin的8096端口映射到服务器上，外网就能看了。不过视频播放的流量比较大，建议根据服务器的带宽适当设置Jellyfin的转码策略——在外面用移动数据看的时候可以降到720p，省流量也不卡。

## AstrBot + ani-rss 联动

现在所有组件都跑起来了，最后一步是把AstrBot和ani-rss串起来。

ani-rss提供了MCP Server接口，AstrBot可以通过MCP调用它。这意味着在QQ群里直接@机器人就能：

- **查订阅列表**：看看都订阅了哪些番
- **查更新进度**：某部番更到第几集了、下载状态怎么样
- **即时搜索**：在群里直接搜番，让机器人加到订阅里

那么如何配置呢，方式如下图

![ani-rss MCP配置](https://images.wynio.pw:28090/api/images/NAS%E6%8A%98%E8%85%BE%E6%97%A5%E8%AE%B02/mcp%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F.png)

通过这个方式在astrbot的设置里注册mcp服务

效果如下

![AstrBot测试效果](https://images.wynio.pw:28090/api/images/NAS%E6%8A%98%E8%85%BE%E6%97%A5%E8%AE%B02/astrbot%E6%B5%8B%E8%AF%95%E5%9B%BE.png)

然后经过qbit的下载，以及ani-rss的管理分类和重命名，在Jellyfin的页面下，我们能看到刮削完成后的尼古喵喵

![Jellyfin刮削效果](https://images.wynio.pw:28090/api/images/NAS%E6%8A%98%E8%85%BE%E6%97%A5%E8%AE%B02/jellyfin%E6%95%88%E6%9E%9C%E5%9B%BE.png)

全程不需要什么繁琐的操作，只需要@你的astrbot，让他添加追番列表，然后他就会自动把整理好的番剧下载到媒体库，然后通过astrbot通知你追番情况

回到最开始说的——**躺着追番**。现在打开QQ就能掌握一切，打开Jellyfin就能看最新一集，中间所有的下载、重命名、整理，一只手都不需要动。

最后在astrbot的设置里添加任务，让bot在一个特定的时间段唤醒，查询追番情况，告诉你追番的更新情况

![追番提醒](https://images.wynio.pw:28090/api/images/NAS%E6%8A%98%E8%85%BE%E6%97%A5%E8%AE%B02/%E8%BF%BD%E7%95%AA%E6%8F%90%E9%86%92.png)

一切大功告成，你再也不会错过你的追番更新而你却忘记第一时间观看

## 总结

下一个目标就是找到性价比高的frp穿透方案，让视频观看体验更上一层楼了

从刚开始的装机到穿透，从图床到追番自动化，这台NAS折腾下来已经基本达到了我当初的预期。

现在再回头看那个连IPv6都连不稳的初始状态，真是恍如隔世。

---

本博客所有文章除特别声明外，均采用 CC BY-NC-SA 4.0 许可协议。