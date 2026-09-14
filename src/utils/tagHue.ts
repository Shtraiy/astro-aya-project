/**
 * 标签 → 稳定色相（0-359）。
 *
 * 同一个标签在任何页面、任何位置都得到同一个颜色，所以卡片上的「技术」和
 * 标签云里的「技术」是同一个色。乘 137（近似黄金角）是为了让相邻字符的
 * 标签尽量散开，不至于一堆标签挤在同一个色相上。
 */
export function tagHue(name: string): number {
  let hue = 0;
  for (const char of name) {
    hue = (hue * 137 + (char.codePointAt(0) ?? 0)) % 360;
  }
  return hue;
}
