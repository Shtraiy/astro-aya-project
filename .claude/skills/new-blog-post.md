---
name: new-blog-post
description: |
  在 SilentCage 博客中创建新的博客文章。自动生成符合项目规范的 frontmatter、
  文件命名、标签选择、以及遵循博主文风的内容结构。当需要新建文章、添加博文、
  或撰写博客内容时使用此技能。
metadata:
  type: project
  tags:
    - blog
    - astro
    - content-creation
---

# 新建博客文章

## 前置检查

在创建文章前，确认以下信息：

1. **文件位置**: `src/content/blog/` 目录下
2. **文件名**: 使用与标题一致的中文名，例如 `五一南京游记.md`、`从Hexo迁移到Astro.md`
3. **图片存放**: 如使用本地图片，放入 `public/images/`；推荐使用外部图床 `https://s41.ax1x.com/`

## Frontmatter 模板

```yaml
---
title: "标题"
tags:
  - 标签1
  - 标签2
pubDatetime: YYYY-MM-DD HH:mm:ss
modDatetime: YYYY-MM-DD HH:mm:ss  # 可选，修改时更新
description: "一句话描述，会显示在文章卡片和 OG 标签中"
featured: false    # 可选，设为 true 会在首页置顶
draft: false       # 可选，true = 草稿不发布
ogImage: "./image.png"  # 可选，OG 社交分享图 (≥1200×630)
---
```

### 必填字段

| 字段 | 说明 |
|------|------|
| `title` | 文章标题，清晰直接 |
| `tags` | 1-4 个标签，参考下方标签体系 |
| `pubDatetime` | 发布日期时间 |
| `description` | 摘要，120-200 字最佳 |

### 可选字段

| 字段 | 说明 |
|------|------|
| `modDatetime` | 最后修改时间，重大更新时设置 |
| `featured` | `true` 置顶 |
| `draft` | `true` 不发布 |
| `ogImage` | 社交分享图 |
| `canonicalURL` | 规范链接 |
| `editPost` | 编辑链接配置 |

## 标签体系

根据文章内容选择合适的标签（1-4个）：

### 技术类
- `技术` — 通用技术文章
- `Linux` / `系统` — Linux 相关
- `单片机` / `STM32` — 嵌入式开发
- `网页` — 网站/前端相关
- `折腾` — 踩坑记录、配置调试

### 生活类
- `生活` — 日常生活记录
- `杂谈` — 杂感、吐槽、评论
- `考研` — 考研相关
- `旅游` — 游记
- `笔记` — 随笔记事

### 地域类
- `北京` / `南京` — 游记地点

### 兴趣类
- `番剧` — 动画评论
- `收藏` — 资源分享

**规则**:
- 第一个标签通常标识文章大类（技术/生活/杂谈）
- 游记必带 `旅游` + 地点标签
- 技术教程必带 `技术` + 具体领域

## 文章结构指南

### 技术教程
```
个人动机(为什么写这篇) → 前置要求 → 分步操作 → 踩坑记录 → 成果/结语
```

### 游记
```
启程 → 按天叙述(日期作为二级标题) → 吃×景×感 → 总结感悟
```

### 生活随笔
```
事件陈述 → 内心活动 → 自嘲转折 → 感悟/决心 → 金句收尾
```

### 评论/吐槽
```
情绪开头 → 逐点分析 → 引用/金句 → 共鸣/共鸣 → 收尾
```

详见 `resalia-writing-style` 技能中的篇章结构模式。

## 发布流程

1. 创建 `.md` 文件到 `src/content/blog/`
2. 填写 frontmatter（检查必填字段）
3. 撰写正文（参考 resalia-writing-style 技能）
4. 确保外部图片链接可用
5. 运行 `npm run dev` 本地预览
6. `npm run build` 确认无错误后提交

## 注意事项

- ❌ 不要在 `description` 中使用 markdown 语法
- ❌ 不要在 `pubDatetime` 使用未来的日期（会被 postFilter 过滤，除非在 15 分钟 margin 内）
- ❌ 标签不支持中文以外的特殊字符，使用纯中文或英文单词
- ✅ 修改文章后更新 `modDatetime` 字段
- ✅ 草稿文章设置 `draft: true`，本地开发可见但构建时不发布
