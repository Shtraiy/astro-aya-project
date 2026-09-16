import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeExternalLinks from "rehype-external-links";
import type { Element } from "hast";

import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { SITE } from "./src/config";
import { RETIRED_TAG_NAMES } from "./src/data/retiredTags";
import rehypeLazyImages from "./src/plugins/rehype-lazy-images.mjs";

/** 只做跳转、没有内容的页面：sitemap 不该收录 */
const REDIRECT_PAGES = ["/archives/", "/categories/", "/music/", "/search/"];

/** 不是网页的构建产物：播放器的曲库 JSON，别当成页面推给搜索引擎 */
const DATA_ASSETS = ["/collection/data.json"];

/** decodeURIComponent 遇到非法编码会抛错，这里退回原串 */
function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    react(),
    sitemap({
      /*
        跳转页与没有内容的页面不该进 sitemap：
        /archives、/categories、/music 与退场标签页都是跳转页（meta refresh + noindex），
        /search 只有一个搜索框。把它们列进 sitemap 等于向搜索引擎推荐空壳 URL。
      */
      filter: page => {
        const path = safeDecode(new URL(page).pathname);
        if (REDIRECT_PAGES.includes(path)) return false;
        if (DATA_ASSETS.includes(path)) return false;

        return !RETIRED_TAG_NAMES.some(tag => path === `/tags/${tag}/`);
      },
    }),
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
      /*
        脚注标签中文化：Astro 默认是英文的 Footnotes / Back to content，
        正文里冒出来会很突兀。这里跟参考主题对齐（返回内容用 ↑ 更省地方）。
      */
      remarkRehype: {
        footnoteLabel: "脚注",
        footnoteBackLabel: "返回内容",
        footnoteBackContent: "↑",
      },
      rehypePlugins: [
        // 正文图片统一补上 loading="lazy" / decoding="async"（见插件注释）
        rehypeLazyImages,
        /*
          站外链接统一加新窗口 + rel，并打上 external-link 类（箭头由 CSS 画，
          见 base.css：这样复制粘贴不会带上箭头，屏幕阅读器也不会念出它）。
          默认只处理 http/https 的 <a>，相对链接、mailto、图片都不受影响。
        */
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            properties: { className: ["external-link"] },
            /*
              自家域名的绝对地址不算外链：正文里若写成完整 URL（例如引用自己的另一篇
              文章），不该被加新窗口与 ↗。顺带把 mailto / 相对链接挡在外面。
            */
            test: (element: Element) => {
              const href = element.properties?.href;
              if (typeof href !== "string" || !/^https?:\/\//i.test(href)) {
                return false;
              }

              try {
                return new URL(href).host !== new URL(SITE.website).host;
              } catch {
                return false;
              }
            },
          },
        ],
      ],
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
