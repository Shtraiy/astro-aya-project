import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { remarkAlert } from "remark-github-blockquote-alert";

import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { SITE } from "./src/config";
import rehypeLazyImages from "./src/plugins/rehype-lazy-images.mjs";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [react(), sitemap()],
  markdown: {
    // Astro 7 默认改用 Sätteri（Rust）渲染 Markdown，本项目的 remark 插件
    // （目录、折叠、GitHub 提示框）需要显式装回 unified/rehype 管线，
    // 插件列表也随之从 markdown.remarkPlugins 移到 unified() 的参数里。
    processor: unified({
      remarkPlugins: [
        remarkToc,
        remarkAlert,
        [
          remarkCollapse,
          {
            test: "Table of contents",
          },
        ],
      ],
      // 正文图片统一补上 loading="lazy" / decoding="async"（见插件注释）
      rehypePlugins: [rehypeLazyImages],
    }),

    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
      /*
        代码行的标注语法（写在行尾，渲染时会被自动删掉）：
          // [!code highlight]      高亮这一行
          // [!code focus]          聚焦这一行，其余变淡
          // [!code ++] / [!code --]  diff 增删
          // [!code error] / [!code warning]
        样式在 base.css 的「代码行标注」一节。
      */
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
