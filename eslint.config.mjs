import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import astroParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    files: ["tailwind.config.cjs", "**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    // public/js/APlayer.min.js 这类第三方压缩产物不该参与 lint
    // 参考主题是本地拿来对照的另一个完整项目（含 node_modules），既不提交也不该扫
    ignores: [
      "dist/**",
      ".astro",
      "**/*.min.js",
      "**/*.min.css",
      // Pagefind 生成的搜索索引与运行时（search:index:dev 会写进 public/）
      "public/pagefind/**",
      "参考主题/**",
    ],
  },
];
