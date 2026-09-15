/**
 * 「药丸筛选 + 卡片显隐」这套交互在收藏页（按艺术家筛）和追番页（按收藏状态筛）
 * 都要用，逻辑本来是一模一样的两份，这里收成一份：
 * 重复绑定、astro:page-load 重复注册这类坑只在一个地方处理。
 *
 * 约定：
 * - 按钮带 `data-<buttonKey>`，值是筛选键，`all` 表示全部
 * - 卡片带 `data-<itemKey>`，值要和按钮对应
 * - （可选）需要一起显隐的分组容器带 `data-<groupKey>`
 *
 * 页面本身是静态的，按钮和内容都在同一个文档里，所以直接切 hidden 属性；
 * 没有 JS 时列表照常完整显示。
 */

export interface ChipFilterConfig {
  /** 按钮选择器 */
  buttonSelector: string;
  /** 按钮上存筛选值的 data 属性名（camelCase，例如 "artistFilter"） */
  buttonKey: string;
  /** 卡片选择器 */
  itemSelector: string;
  /** 卡片上存筛选值的 data 属性名 */
  itemKey: string;
  /** 可选：需要同步显隐的分组容器选择器 */
  groupSelector?: string;
  /** 可选：分组容器上存分组键的 data 属性名 */
  groupKey?: string;
}

export function initChipFilter(config: ChipFilterConfig): void {
  const { buttonSelector, buttonKey, itemSelector, itemKey } = config;

  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(buttonSelector)
  );
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(itemSelector)
  );
  if (!buttons.length || !items.length) return;

  // 首次加载时直接调一次、astro:page-load 又调一次，这里挡住重复绑定
  if (buttons.some(button => button.dataset.bound === "true")) return;

  const groups =
    config.groupSelector && config.groupKey
      ? Array.from(document.querySelectorAll<HTMLElement>(config.groupSelector))
      : [];
  const groupKey = config.groupKey;

  const apply = (value: string) => {
    for (const button of buttons) {
      button.classList.toggle(
        "is-current",
        button.dataset[buttonKey] === value
      );
    }
    for (const item of items) {
      item.hidden = value !== "all" && item.dataset[itemKey] !== value;
    }
    if (groupKey) {
      for (const group of groups) {
        group.hidden = value !== "all" && group.dataset[groupKey] !== value;
      }
    }
  };

  for (const button of buttons) {
    button.dataset.bound = "true";
    button.addEventListener("click", () =>
      apply(button.dataset[buttonKey] ?? "all")
    );
  }
}
