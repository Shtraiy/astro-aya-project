---
name: new-album
description: |
  在 SilentCage 博客的音乐馆中创建新的音乐专辑页面。自动生成符合 album collection
  schema 的 frontmatter，包含曲目列表、封面配置和主题色设置。
metadata:
  type: project
  tags:
    - music
    - astro
    - content-creation
    - albums
---

# 新建音乐专辑

## 前置信息

音乐专辑存放在 `src/content/albums/` 目录下。每个 `.md` 文件代表一张专辑。

Schema 定义见 `src/content/config.ts` 中的 `albums` collection。

## Frontmatter 模板

```yaml
---
title: "「专辑名」"
artist: "艺术家/团体"
theme: "#HEX颜色"
cover: "/images/albums/cover-name.jpg"
date: YYYY-MM-DDTHH:mm:ss.sssZ
tracks:
  - name: "曲目1"
    artist: "艺术家"
    url: "https://音频文件URL"
  - name: "曲目2"
    artist: "艺术家"
    url: "https://音频文件URL"
lyrics:   # 可选，仅当需要打轴歌词时
  - time: 0
    text: "歌词第一句"
  - time: 5
    text: "歌词第二句"
---
```

### 必填字段

| 字段 | 说明 |
|------|------|
| `title` | 专辑名，格式为 `「专辑名」`（带日式书名号） |
| `artist` | 艺术家/团体名称 |
| `theme` | 主题色 HEX 值，用于播放器 UI 配色 |
| `cover` | 封面图路径，放在 `public/images/` 下 |
| `tracks` | 曲目数组，每项含 name、artist、url |

### 可选字段

| 字段 | 说明 |
|------|------|
| `date` | 专辑发行日期 (ISO 8601) |
| `lyrics` | 打轴歌词，time 为秒数，text 为歌词文本 |

## 音频文件托管

目前专辑音频托管在 GitHub 仓库 `Resalia/music3`：

```
https://github.com/Resalia/music3/raw/refs/heads/main/{专辑文件夹}/{曲目文件}.flac
```

**格式**: 优先使用 FLAC 无损格式，备选 MP3 320kbps。

## 主题色 (theme) 选取

从专辑封面中提取主色调作为 `theme` 值：

| 专辑 | theme | 风格 |
|------|-------|------|
| Dream-Blue | `#2F82C4` | 蓝色系 |
| COLOURS 系列 | 各异 | 根据封面变化 |
| SWANSONG | 暗色系 | 黑色/深蓝 |

**建议**: 使用封面主色的中间亮度值，避免过亮或过暗影响播放器 UI 可读性。

## 专辑命名

文件名使用英文或罗马音：
- `Dream-Blue.md`
- `COLOURS-01.md`
- `SWANSONG.md`

## 发布流程

1. 准备封面图，放入 `public/images/albums/`
2. 确认音频 URL 可正常访问
3. 创建 `.md` 文件到 `src/content/albums/`
4. 填写 frontmatter，确认 tracks 数组格式正确
5. 如需歌词，按时间轴填入 `lyrics` 数组
6. 运行 `npm run dev`，访问 `/music` 和 `/music/[slug]` 验证

## 注意事项

- ❌ `tracks` 是数组，每项必须包含 `name` 和 `url`
- ❌ 音频 URL 不要使用需要认证的链接
- ❌ `theme` 必须带 `#` 前缀
- ✅ `cover` 路径以 `/images/albums/` 开头
- ✅ 同人音乐专辑通常标注 `artist` 为社团名而非单个 vocal
- ✅ 可以在专辑正文添加介绍文字（markdown），但播放器主要使用 frontmatter 数据
