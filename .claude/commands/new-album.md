---
name: new-album
description: 在 SilentCage 音乐馆中创建一张新的音乐专辑
---

# 新建音乐专辑

按照 SilentCage 博客 album collection schema 创建新的音乐专辑。

## 工作流程

### 1. 读取参考文件
首先读取 `.claude/skills/new-album.md` 获取完整的 frontmatter 规范。

### 2. 确认信息
- 专辑名称（格式 `「专辑名」`）
- 艺术家/社团
- 主题色 HEX 值
- 封面图路径
- 曲目列表（每首：name, artist, url）

### 3. 创建文件
在 `src/content/albums/` 下创建 `.md` 文件，文件名使用英文或罗马音。

### 4. 填写 Frontmatter
```yaml
---
title: "「专辑名」"
artist: "艺术家"
theme: "#HEX颜色"
cover: "/images/albums/cover.jpg"
date: YYYY-MM-DDTHH:mm:ss.sssZ
tracks:
  - name: "曲名"
    artist: "艺术家"
    url: "https://音频URL"
---
```

### 5. 告知用户
完成后建议运行 `npm run dev` 访问 `/music` 验证。
