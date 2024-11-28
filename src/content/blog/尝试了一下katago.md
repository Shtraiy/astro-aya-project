---
title: 与Katago对弈
tags: 
  - 休闲
  - 下棋
pubDatetime: 2021-07-12 18:15:03
description: "本文记述了有关Katago AI的训练以及对弈"
---
# 最近无聊到下棋

当然我不是什么职业棋士

对我来说下棋与其说是一种益智活动更像是一种催眠方式

因为有时下着下着就困了

但是我最近对一个叫做Katago围棋AI有了点兴趣，于是就研究了一下

Katago是由David J. Wu 所研究并开发的一套围棋软件。

并且以DeepMind的AlphaGo Zero与AlphaZero论文为基础为基础，训练速度更快，棋力更强

黑色是我![被乱杀](/images/28.png)

~~开局被乱杀~~

下面就简单讲一下KataGo和Sabaki的使用方法和下载方式

> https://github.com/SabakiHQ/Sabaki/releases/tag/v0.52.0  --Sabaki

> https://github.com/lightvector/KataGo/releases  --KataGo

我下载的KataGo是1.9.1版本的

![1](/images/29.png)

其中文件名字带有bs29的是娱乐版本，支持29x29棋盘，但我不打算用，因为19x19就已经够我下一年了

一般来说有显卡的用OpenCL或CUDA比较好，Eigen是纯CPU

这里我下的是1.9.1的OpenCL版本

下载好后用cmd进入Katago的目录并执行katago.exe genconfig -model (权重文件名字).bin.gz -output gtp_custom.cfg

![1](/images/17.png)

这里输入chinese即可

后面还有一系列指令一般有default的就直接回车吧，其他的大家英语好的自行判断该输什么

KataGo的权重文件可以到[这里](https://katagotraining.org/networks/)下载

然后你需要给Sabaki配置权重

下载完后打开Sabaki

![1](/images/30.png)

具体配置如上

详细介绍可以上网找，这里不一一阐述，其实我也是一知半解

配置完后打开这个运行

![1](/images/31.png)

等候几十秒就加载完成了

加载完成就可以正常和Katago下棋了
