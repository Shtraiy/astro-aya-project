import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { remarkAlert } from "remark-github-blockquote-alert";

import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    react(),
    sitemap(),
  ],
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
    }),

    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
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
