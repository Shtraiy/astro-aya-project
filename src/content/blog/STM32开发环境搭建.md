---
title: STM32开发环境搭建
tags: 
  - 技术
  - 单片机
  - STM32
pubDatetime: 2025-1-11 15:27:44
description: "本文记载了STM32单片机的开发环境配置"
---
# 本文记载了有关STM32单片机的Keil开发环境搭建过程

本文使用的keil版本是v5.33，安装教程就不一一赘述了

总所周知，STM32不同于51单片机，他的MCU主频更高，架构更复杂，性能更强。

同时STM32开发环境的搭建也相较于c51更麻烦一点

目前常用的STM32开发方式有很多种，下面我使用的是标准外设库开发方法

## 环境搭建

### 准备

1、在搭建STM32的SPL开发环境之前，请确保你拥有一整套STM32的驱动文件

2、正确安装并能正常运行keil软件

### 1、初始化项目

新建一个项目目录，目录下应该有如下结构

![结构](https://s21.ax1x.com/2025/01/11/pEPuZ8K.png "结构")

### 2、划分项目结构

打开keil，选定project路径新建一个项目，然后将STM32的启动文件和驱动文件分别移动进CMSIS和LIB文件夹

添加启动文件进入CMSIS目录

![CMSIS](https://s21.ax1x.com/2025/01/11/pEPumvD.png "CMSIS")

添加标准库文件进入LIB目录

![LIB](https://s21.ax1x.com/2025/01/11/pEPuuKe.png "LIB")

### 3、添加项目环境

在keil中为新建的项目添加环境

找到这个东西

![方块](https://s21.ax1x.com/2025/01/11/pEPu4aR.png "方块")

CMSIS需要添加目录下的所有.c文件以及.s文件

![CMSIS](https://s21.ax1x.com/2025/01/11/pEPuhZ9.png "CMSIS")

LIB同理，需要添加目录下所有的.c文件

### 4、添加头文件目录

为项目添加C/C++头文件目录

打开上端工具栏的魔术棒，点进C/C++选项，找到Include Paths

添加如下项

![inc](https://s21.ax1x.com/2025/01/11/pEPKEZj.png "inc")

添加完毕后在同样的选项下找到Preprocessor Symbols，添加宏定义

![宏定义](https://s21.ax1x.com/2025/01/11/pEPKkLQ.png "宏定义")

随后退出保存，STM32基本的keil开发环境就搭建完成了

### 5、项目结构的介绍

在根据以上步骤初始化一个正常的STM32开发项目后，就可以正常进行编写代码了

下面介绍一下各个目录的作用

1、CMSIS

CMSIS目录的作用是存放与芯片内核相关的文件，是 ARM 官方提供的 Cortex-M 系列标准化支持文件

2、LIB

LIB目录的作用是存放厂商提供的外设驱动库或第三方库(STM32F10x_StdPeriph_Driver)

3、USER

USER目录的作用是存放开发者自定义的功能函数，便于区分厂商提供的外设驱动库

4、project

project目录的作用是放置keil生成的工程文件，keil4生成的是.uvproj，keil5生成的是.uvprojx

### 6、关于使用其他编辑器开发STM32的配置方法

由于我最近一直在用nvim编辑器，所以在搭建了keil环境后便开始思考怎么用nvim写代码用keil进行调试

经过测试后我选择了CMake构建工具，CMake是一种跨平台的构建系统，它用于管理软件构建过程，尤其适合多语言、多配置的项目

用来管理.c的项目相当合适

下面是CMakeLists.txt的配置。

```
cmake_minimum_required(VERSION 3.28)
project(STM32F10xProject)

# 添加头文件目录
include_directories(
    ${CMAKE_SOURCE_DIR}/CMSIS
    ${CMAKE_SOURCE_DIR}/LIB/inc
    ${CMAKE_SOURCE_DIR}/USER/inc
)

add_definitions(
    -DUSE_STDPERIPH_DRIVER
)

# 添加源文件
add_executable(main project/main.c)

# 导出 compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
```

由于我对于CMake工具的接触也不算多，我并不清楚为什么正常初始化项目后会出现不生成compile_commands.json的问题

因此在初始化cmake目录的时候执行下面这一条

```cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -B build```

这样会手动将配置工具以及compile_commands.json生成进build目录，避免生成到根目录，影响项目的结构

执行完以上操作后就能够在nvim正常编写.c的代码了

