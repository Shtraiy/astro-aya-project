/**
 * 估算中文混合文本阅读时间
 * 中文约 400 字/分钟，英文约 200 词/分钟
 */
export function getReadingTime(text: string): string {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200);
  if (minutes < 1) return "不到 1 分钟";
  return `${minutes} 分钟`;
}
