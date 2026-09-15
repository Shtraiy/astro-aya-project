/**
 * @pagefind/default-ui 没带类型声明（package.json 里既没有 types 也没有 exports），
 * `astro check` 会报找不到模块。这里只声明本站用到的部分：
 * 构造器与那几个选项 / 中文翻译键。
 */
declare module "@pagefind/default-ui" {
  export interface PagefindUITranslations {
    placeholder?: string;
    clear_search?: string;
    load_more?: string;
    search_label?: string;
    filters_label?: string;
    zero_results?: string;
    many_results?: string;
    one_result?: string;
    alt_search?: string;
    search_suggestion?: string;
    searching?: string;
  }

  export interface PagefindUIOptions {
    /** 挂载点：CSS 选择器或元素本身 */
    element: string | HTMLElement;
    /** 结果 bundle 的路径，默认 "/pagefind/" */
    bundlePath?: string;
    /** 结果里是否显示图片（本站文章没有列表图，默认关掉） */
    showImages?: boolean;
    /** 是否显示命中的小标题子结果 */
    showSubResults?: boolean;
    /** 界面文案 */
    translations?: PagefindUITranslations;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
    /** 用代码触发一次搜索（`/search/?q=…` 直接出结果就靠它） */
    triggerSearch(term: string): void;
    destroy(): void;
  }
}
