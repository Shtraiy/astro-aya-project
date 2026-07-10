# SilentCage

个人博客，基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改编。

> **Attribution:** This project is adapted from [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev), licensed under the [MIT License](LICENSE). Original copyright © 2023 Sat Naing.

## 在原版基础上的改动

- 新增音乐馆页面（`/music`），支持专辑展示与播放
- 新增友链页面（`/links`）
- 新增 PGP 公钥页面
- 自定义页脚与页头组件
- 语言设置调整为中文（`zh-CN`）
- 社交链接扩展（Bilibili、Steam 等）

## 技术栈

- **框架** - [Astro](https://astro.build/)
- **类型检查** - [TypeScript](https://www.typescriptlang.org/)
- **组件** - [React](https://reactjs.org/)
- **样式** - [TailwindCSS](https://tailwindcss.com/)
- **模糊搜索** - [Fuse.js](https://fusejs.io/)
- **部署** - [Cloudflare Pages](https://pages.cloudflare.com/)

## 项目结构

```
/
├── public/
│   ├── assets/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── socialIcons.ts
│   ├── components/
│   ├── content/
│   │   └── blog/        # 博客文章 (.md)
│   ├── layouts/
│   ├── pages/
│   │   ├── music/       # 音乐馆
│   │   ├── posts/       # 文章列表
│   │   ├── tags/        # 标签
│   │   └── archives/    # 归档
│   └── config.ts        # 站点配置
└── package.json
```

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
npm run preview
```

Docker：

```bash
docker compose up -d
```

## 常用命令

| 命令                   | 说明                           |
| :--------------------- | :----------------------------- |
| `npm run dev`          | 启动本地开发服务器 `localhost:4321` |
| `npm run build`        | 构建生产版本到 `./dist/`       |
| `npm run preview`      | 本地预览构建结果               |
| `npm run format`       | Prettier 格式化代码            |
| `npm run lint`         | ESLint 检查                    |

## License

本项目遵循 MIT 许可证。原始版权归 Sat Naing 所有，改编部分版权归 Resalia 所有。

详见 [LICENSE](LICENSE) 文件。
