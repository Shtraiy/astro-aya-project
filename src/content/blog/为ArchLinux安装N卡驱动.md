---
title: 为ArchLinux安装N卡驱动
tags: ["Linux", "系统", "折腾"]
pubDatetime: 2022-07-26 08:17:50
description: "本文记录了一些站长在为ArchLinux安装N卡驱动遇到的情况"
---
# 安装完Arch后我就一直在尝试装N卡驱动

曾经有那么一段时间，我把主力机的Win10彻底替换成了ArchLinux

然后用了一段时间后，就萌生出了用Linux打游戏的想法

但是毕竟是Linux，原生支持Linux的游戏本来就不多，在Linux下驱动的效果也不如Windows那么好

事实证明Linux下的游戏体验确实不咋地，如果原本就支持Linux的倒也还好，但是在只能用Wine模拟Windows进行游戏的情况下体验就特别糟糕了

Steam推出了一个叫ProtonDB的东西，貌似是wine的魔改版，但是支持很多Steam上的游戏

我Steam有不少游戏，而我刚好又在用Arch，天底下怎么会有这么巧的事情

于是我用Arch下载了Steam，想试试靠这个所谓的ProtonDB能运行我库里的多少个游戏

但是如果要玩游戏，光靠核显肯定是不够用的，那我的主力机也有独显，如果不用上也就太浪费了

这就有了后面我安装N卡驱动测试Steam游戏的事情

回归正题，官方Wiki上关于N卡驱动的安装过程很简单，只有短短几条命令

但按照Wiki上的步骤安装结束后还是出现了很多问题

比如安装后不显示驱动也进不去图形化界面

亦或者驱动装上了但是进不去桌面

经过多次尝试和排错我终于找到了正确的打开方式

下面是官方中文Wiki

[这里是链接](https://wiki.archlinux.org/title/NVIDIA_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

### 安装

首先安装linux-lts内核

```
yay -S linux-lts
```

然后安装N卡驱动

```
sudo pacman -S nvidia-lts
```

需要注意的是，12代intelCPU可能会遇到系统无法正常启动的问题

这时候需要在引导加载程序中设置内核参数```ibt=off```

下面以我用grub引导为例子

```
sudo vim /etc/default/grub
```

找到LINUX_DEFAULT，并在后面添加ibt=off

保存退出后重新加载grub文件

```
sudo grub-mkconfig -o /etc/grub/grub.cfg
```

正常情况下N卡驱动在执行pacman命令后就已经安装完成了，这时我们重启一下电脑

重新开机后输入```nvidia-msi```

正常情况下会显示你显卡驱动的信息，这个时候就已经安装成功了

### 安装后配置

##### DRM内核级显示模式设置

在引导程序中添加DRM内核参数

```
sudo vim /etc/default/grub
```

在LINUX_DEFAULT后面添加```nvidia-drm.modeset=1```

保存退出后记得更新引导文件

```
sudo grub-mkconfig -o /etc/grub/grub.cfg
```
安装流程大概就这些了，不过Linux的驱动体验肯定没Windows那么好，所以在这之后不久我又换回Win10了
