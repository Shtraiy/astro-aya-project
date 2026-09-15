/**
 * 文章页「时间轴」视图用的中文月份雅称与数字写法。
 *
 * 原先是归档页里的局部常量，归档并入文章页后移到 utils，
 * 免得那点措辞逻辑跟着旧页面一起丢掉。
 */

/** 农历/古称式的月份名：孟春 = 正月，仲冬 = 十一月 */
export const MONTH_NAMES: Record<string, string> = {
  "1": "孟春",
  "2": "仲春",
  "3": "季春",
  "4": "孟夏",
  "5": "仲夏",
  "6": "季夏",
  "7": "孟秋",
  "8": "仲秋",
  "9": "季秋",
  "10": "孟冬",
  "11": "仲冬",
  "12": "季冬",
};

/** 阿拉伯数字转中文（一年里单月篇数够用，超过 99 直接回落成数字） */
export const toChineseNumber = (num: number): string => {
  const chars = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (num < 10) return chars[num];
  if (num === 10) return "十";
  if (num < 20) return "十" + (num % 10 === 0 ? "" : chars[num % 10]);
  if (num < 100) {
    return (
      chars[Math.floor(num / 10)] +
      "十" +
      (num % 10 === 0 ? "" : chars[num % 10])
    );
  }
  return num.toString();
};

/** 时间轴上每行的日期标签：07-09 */
export const shortDate = (date: Date) =>
  `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
