---
title: ArchLinux安装指南
pubDatetime: 2021-01-26 12:23:19
description: "本文旨在记录当时装系统的全套过程及供他人参考"
tags: 
  - Linux
  - 系统
  - 折腾
  - 笔记
---
# 先前有尝试过用VMware装Archlinux

因为整个系统都是在Cli下一步步引导安装

打算针对只会Windows的完全没接触过GNU/Linux的新手写一个零基础安装教学

这回不再使用VMware进行安装，直接上手实机进行EFI引导安装arch

内容可能会有一些错误，如有发现请即刻私信我

我也是没有过这类手动安装linux的经历，如果遇到什么问题也可以找我讨论![](/images/1.jpg)

另外，尽管这类教程Google上一搜一大片

但还是有些不全面的地方，这个教程会针对新人，保证仅通过复制代码不清楚代码作用的情况下也能顺利安装

这个教学不只是针对新人，也为了日后我速通archlinux。冷知识：目前世界记录是一分多钟

具体安装速度取决于网速，取决于你安装基本包的速度

Tips：本次安装使用y7000p进行实机安装

废话说完了，开始操作

### 安装前准备

> 首先把官方文档的链接放在下面，有能力的先对照着看

>https://wiki.archlinux.org/index.php/Installation_guide

备份结束后就可以下载ISO了

>https://www.archlinux.org/download/

进入以后可以选择下载磁力链或种子
![](/images/2.png)

当然我是选择的磁力链，迅雷下载也是比较快的

下载结束后也最好检验一下哈希值，这里就不详细说明怎么检验了

下载完镜像后可以使用rufus创建引导U盘，这里也不一一阐述

引导盘弄好后，就可以开始安装了

---

### 安装

 首先重启电脑进入BIOS界面

![另外如果出现这样的界面已经成功了](/images/1.png)

然后设置你的U盘启动项为首位

 这里选择第一个选项或是等待过后自动进入安装页面

![1](/images/3.png)

### 首先确定自己的引导方式

执行以下命令

```ls /sys/firmware/efi/efivars```

执行命令后，如果弹出一大堆东西，说明你是EFI引导，如果弹出下面的信息

```
ls: cannot access '/sys/firmware/efi/efivars': No such file or directory
```
则说明你是以BIOS方式引导

两种不同的类型安装方式也会有所不同

本次安装采用EFI引导安装

---

### 联网

**arch**不能离线安装，需要通过联网来下载相关的包和组件，首先我们需要联网

如果你是有线网，输入以下命令获取IP地址

```dhcpcd```

然后再通过ping来判断是否联网，例如：

```ping www.baidu.com```

ping通了就说明连上网了

如果你是无线网，就执行以下命令：

```iwctl```

会进入一个以**iwd**开头的Cli环境中，然后执行

```device list```

会出现以下情况

![1](/images/4.png)

有的人可能会像我这样，设备的powered是off的，这时候可以执行rfkill unblock wlan

再次```device list```即可

然后执行

```
station name scan # 使用wlan0进行无线网络扫描
station name get-networks # 使用wlan0列出扫描到的网络
station name connect WIFI # 使用wlan0连接到你家WIFI
```

之后按要求输入密码，就能成功连上网了，执行下面命令以退出iwd

```quit```

之后再尝试```ping baidu.com```

如果ping的通就连上了

目前我没遇到过什么问题，如遇到问题可以先上官方论坛查找，下方是官方wiki

>https://wiki.archlinux.org/index.php/Wireless_network_configuration
---
### 分区

操作前一定要特别注意，一定不要操作失误，一定要清楚自己所做的每一步带来的影响，不然你数据就没了

首先查看目前的分区情况

```fdisk -l```

![1](/images/5.png)

可以先清空磁盘，删除掉不需要的分区，需要注意的是不要删错，下面以我为例

执行```fdisk /dev/nvme0n1```

然后输入```d```，一路回车，最后输入```w```保存

然后可以**CTRL+C**退出fdisk

下面对磁盘进行分区

我采用的是cfdisk进行，还是以我为例

执行```cfdisk /dev/nvme0n1```

下方回车new选项，回车

大小输入300M，回车，创建一个EFI分区

![1](/images/38.png)

此时已经创建了一个EFI分区

然后再选中剩下的free space再创建一个根分区

回车new创建完成后再回车write，输入yes，回车

然后回车quit离开

此时再```fdisk -l```就会发现已经分区完成了

格式化分区

执行以下命令对EFI分区和根分区进行格式化

```
mkfs.fat -F32 /dev/nvme0n1p1 #对EFI分区进行格式化
mkfs.ext4 /dev/nvme0n1p2 #对根分区进行格式化
```

格式化结束进行下一步

挂载

首先挂载根分区

```
mount /dev/你的根分区 /mnt
```

随后创建EFI分区的挂载点

```
mkdir /mnt/boot
mkdir /mnt/boot/EFI
```

挂载EFI分区

```
mount /dev/你的EFI分区 /mnt/boot/EFI
```

挂载结束进行下一步

---

### 选择镜像

根据不同地区选择不同的镜像来加快下载速度

~~硬下也没关系，只不过可能要下到猴年马月~~

执行以下命令来编辑源文件

```
vim /etc/pacman.d/mirrorlist
```

找到标有China的镜像源，剪切到最前面的位置

找不到就直接手搓

```
Server = http://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
Server = http://mirrors.zju.edu.cn/archlinux/$repo/os/$arch
```

之后用`:wq`保存并退出即可![1](/images/37.png)

---

### 安装基本包

折腾了一堆东西，总算可以开始安装基本包了，本过程需要全程联网~~废话~~

执行以下命令：

```
pacstrap /mnt base base-devel linux linux-firmware dhcpcd 
```

能不能速通就看网速了，arch安装一般就卡在网速上

不过镜像配置好是不会很久的

---

### 配置Fstab

生成一个Fstab文件通过UUID或者标签进行定义

执行以下命令：

```
genfstab -U /mnt >> /mnt/etc/fstab
```

```
cat /mnt/etc/fstab
```

检查输出的文件`/mnt/etc/fstab`是否正确

比如查看是否有/boot/EFI的文件，如果没出现说明挂载没成功

需要重新挂载后再生成一次

结束进行下一步

### Chroot

切换到根目录

执行```arch-chroot /mnt```

![1](/images/7.png)

---

### 设置时区

输入以下指令：

```
ln -sf /usr/share/zoneinfo/Region/City /etc/localtime # /Region/City改为自己城市和地区，例如/Asia/Shanghai
hwclock --systohc #设置时间漂移
```

结束到下一步

---

### 安装vim和sudo

可以通过Archlinux的包管理器**pacman**下载，大部分情况只需要一行命令就帮你搞定依赖和安装的问题

输入以下指令：

```
pacman -S vim sudo
```

---

### 配置locale

执行以下命令已编辑/etc/locale.gen文件

```vim /etc/locale.gen```

在文件中找到zh_CN.UTF-8 UTF-8和en_US.UTF-8 UTF-8

去掉开头的#号，并:**wq**保存退出

再执行```locale-gen```

下一步

---

### 设置语言

```vim /etc/locale.conf```

在里面输入**LANG=en_US.UTF-8**

**:wq**退出

---

### 设置主机名字

```
echo 主机名 > /etc/hostname
```

---

### 配置hosts文件

```
vim /etc/hosts
```

![1](/images/39.png)

其中的anastasia改为上一步你设置的主机名字

**:wq**保存退出

---

### 启用dhcpcd服务

```
systemctl enable dhcpcd.service
```

---

### 设置Root密码

输入

```
passwd
```

按提示确认即可

---

### 创建普通用户并设置密码并赋予其sudo权限

```
useradd -m -G wheel -s /bin/bash 用户名
```

然后

```
passwd 用户名
```

接着

```
visudo
```

找到%wheel ALL=(ALL:ALL) ALL，并把其前面的注释#去掉，保存退出

---

### 安装引导

安装grub和efibootmgr：

```
pacman -S grub efibootmgr
```

部署grub：

```
grub-install --target=x86_64-efi --efi-directory=/boot/EFI
```

生成配置文件：

```
grub-mkconfig -o /boot/grub/grub.cfg
```

如果是EFI/GPT引导方式

如果引导或挂载没什么问题这里应该是正常的

---

### 安装后检查

输入以下指令检查是否成功生成各系统入口：

```
vim /boot/grub/grub.cfg
```

如果没生成其他系统入口，请自行查阅
>https://wiki.archlinux.org/index.php/GRUB/Tips_and_tricks#Combining_the_use_of_UUIDs_and_basic_scripting

vans后就进行下一步

---

### Reboot

一定要先确保所有步骤无误，否则重启后一切努力就会全部木大！

确保无误后先输入`exit`

```
reboot
```

重启

![1](/images/8.png)

如果你成功进入到这里了，恭喜你，你已经完成安装了

算算时间，看看你一共花了多长时间吧

---

### 安装后配置

查看显示设备

```
lspci | grep VGA
```

安装通用显示驱动

```
pacman -S xf86-video-vesa
```

安装xorg

```
pacman -S xorg
```

安装字体

安装字体，不然有可能出现方块字

```
pacman -S wqy-microhei
```

安装KDE桌面

```
pacman -S plasma kde-applications
```

启用sddm显示和network网络管理器

```
systemctl enable sddm
systemctl enable NetworkManager
```

重启```reboot```

这个时候就进入到archlinux的图形化界面了

---

### 结束

至此archlinux的图形化界面已经安装结束了

如果在安装过程中你们遇到什么问题可以上论坛找，也可以找我

整篇文章如有写错的地方还请指出

谢谢！
![1](/images/33.png)
