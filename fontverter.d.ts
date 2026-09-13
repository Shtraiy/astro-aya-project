declare module "fontverter" {
  export type FontFormat = "sfnt" | "woff" | "woff2";

  /** 根据文件头判断字体格式，无法识别时抛错 */
  export function detectFormat(buffer: Buffer): FontFormat;

  /** 在 sfnt(ttf/otf) / woff / woff2 之间转换 */
  export function convert(
    buffer: Buffer,
    toFormat: FontFormat,
    fromFormat?: FontFormat
  ): Promise<Buffer>;
}
