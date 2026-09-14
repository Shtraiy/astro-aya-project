/** 中文按字、英文按词，分别统计数量 */
function countText(text: string) {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return { chineseChars, englishWords };
}

/**
 * 估算中文混合文本阅读时间
 * 中文约 400 字/分钟，英文约 200 词/分钟
 */
export function getReadingTime(text: string): string {
  const { chineseChars, englishWords } = countText(text);
  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200);
  if (minutes < 1) return "不到 1 分钟";
  return `${minutes} 分钟`;
}

/** 全站字数统计：汉字段数 + 英文词数 */
export function countWords(text: string): number {
  const { chineseChars, englishWords } = countText(text);
  return chineseChars + englishWords;
}
