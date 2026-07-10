---
name: new-blog-post
description: 在 SilentCage 博客中创建一篇新文章（技术教程/游记/随笔/评论）
---

# 新建博客文章

你的任务是按照 SilentCage 博客的规范创建一篇新文章。

## 工作流程

### 1. 读取参考文件
首先读取以下文件获取完整规范：
- `.claude/skills/new-blog-post.md` — frontmatter 规范、标签体系、结构指南
- `.claude/skills/resalia-writing-style.md` — 博主文风、用词、句式

### 2. 确认信息
如果用户没有明确提供，确认：
- 文章标题
- 文章类型（技术教程/游记/生活随笔/番剧评论/轻量分享）
- 是否草稿

### 3. 创建文件
在 `src/content/blog/` 下创建 `.md` 文件，文件名与标题一致。

### 4. 填写 Frontmatter
```yaml
---
title: "标题"
tags:
  - 标签1
  - 标签2
pubDatetime: YYYY-MM-DD HH:mm:ss
description: "摘要"
featured: false
draft: false
---
```

### 5. 撰写正文
严格按照 resalia-writing-style 的文风规范撰写正文。

### 6. 告知用户
完成后告诉用户文件路径，建议运行 `npm run dev` 预览。
