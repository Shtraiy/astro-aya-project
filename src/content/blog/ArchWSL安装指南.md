---
title: ArchWSL安装指南
tags: 
  - 技术
  - Linux
  - wsl2
pubDatetime: 2024-12-5 00:02:00
description: "本文记载了ArchWSL的安装流程"
---
# 有关ArchWSL的安装流程

如果你想在windows上使用ArchLinux的命令行，可以试试ArchWSL

本文全文参考[官方文档](https://wsldl-pg.github.io/ArchW-docs/)

本文只记载了一些比较基本的安装流程，遇到意外的情况以官方文档为准

## 安装前准备

### 系统需求
+ Windows 10 1709 秋季创意者更新或者更高版本
+ 开启 ```适用于 Linux 的 Windows 子系统``` 功能

### 启动Windows子系统并配置WSL2

以管理员打开终端并运行以下指令：
```
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
```

```
# 更新WSL版本
wsl --update
# 将 WSL 默认版本设置为 WSL 2
wsl --set-default-version 2
```

### 安装ArchWSL

官方文档给出了两个安装方法，这里只写其中一种

1. 下载[[GH](https://github.com/yuk7/ArchWSL/releases/latest)/[镜像](https://gitee.com/yuk7/archwsl-mirror)]安装zip

2. 解压zip到一个相同的目录，并确保该目录有足够的读写权限

3. 运行Arch.exe 来提取rootfs并配置注册表到WSL

### 安装结束后初始化ArchWSL

设置Root密码

```
>Arch.exe
[root@PC-NAME]# passwd
```

### 设置默认用户
参考ArchWiki的[Sudo](https://wiki.archlinux.org/index.php/Sudo#Example_entries)和[User and groups](https://wiki.archlinux.org/index.php/Users_and_groups)页。

```
>Arch.exe
[root@PC-NAME]# echo "%wheel ALL=(ALL) ALL" > /etc/sudoers.d/wheel
    (设置 sudoers 文件。)

[root@PC-NAME]# useradd -m -G wheel -s /bin/bash {username}
(添加用户)

[root@PC-NAME]# passwd {username}
(设置默认用户密码)

[root@PC-NAME]# exit

>Arch.exe config --default-user {username}
    (设置默认用户)
```

### 初始化密钥环(keyring)

```
>Arch.exe
[user@PC-NAME]$ sudo pacman-key --init

[user@PC-NAME]$ sudo pacman-key --populate

[user@PC-NAME]$ sudo pacman -Syy archlinux-keyring
```

### 一些常用指令 

备份并以tar.gz的格式打包系统
```
Arch.exe backup --tgz
```

还原备份的系统
```
Arch.exe install backup.tar.gz
```

进入本地WSL2目录
```
\\wsl.localhost
```

下载oh-my-zsh
```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

为主机设置入站规则连通WSL
```
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound  -InterfaceAlias "vEthernet (WSL)"  -Action Allow
```

注释镜像源
```
sudo nvim /etc/pacman.d/mirrorlist
```

### 在WSL2下运行图形界面程序

WSL2默认是不启用图形界面的，当你运行图形程序时可能会出现如下报错

```
Failed to open X11 display; make sure the DISPLAY environment variable is set correctly
```

WSL2的最新版已经支持wslg，可以通过将X11连接到wslg来运行图形程序

```
sudo rm -r /tmp/.X11-unix
ln -s /mnt/wslg/.X11-unix /tmp/.X11-unix
```

但是当系统重启以后可能需要再次连接这两个文件

可以写一个配置文件```/etc/tmpfiles.d/wslg.conf```

```
L+     /tmp/.X11-unix -    -    -    -   /mnt/wslg/.X11-unix
```

