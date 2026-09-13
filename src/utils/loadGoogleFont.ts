import type { FontStyle, FontWeight } from "satori";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { convert, detectFormat } from "fontverter";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

// Local cache so fonts are downloaded only once
const CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "fonts");

// satori 底层用 opentype.js 解析字体，只认 ttf / otf（woff1 还得先解包）。
// Google Fonts 对现代 UA 会返回 woff2，所以这里伪装旧 UA 尽量拿到 ttf/woff1；
// 但各镜像不一定遵守，所以下载后一律用 fontverter 转成 sfnt 再交给 satori。
const FONT_UA = "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko";

// 标题里有汉字，而 IBM Plex Mono 没有汉字字形，缺字体时 satori 会画成豆腐块，
// 所以额外请求一个中文字体，让 satori 逐字回退（拉丁字符仍用 IBM Plex Mono）。
const CJK_RE =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/;

type FontConfig = {
  name: string;
  font: string;
  weight: FontWeight;
  style: FontStyle;
  /** 只有文本里出现中日文字符时才需要请求这个字体 */
  onlyIfCjk?: boolean;
};

const FONTS: FontConfig[] = [
  {
    name: "IBM Plex Mono",
    font: "IBM+Plex+Mono",
    weight: 400 as FontWeight,
    style: "normal" as FontStyle,
  },
  {
    name: "IBM Plex Mono",
    font: "IBM+Plex+Mono:wght@700",
    weight: 700 as FontWeight,
    style: "bold" as FontStyle,
  },
  {
    name: "Noto Sans SC",
    font: "Noto+Sans+SC",
    weight: 400 as FontWeight,
    style: "normal" as FontStyle,
    onlyIfCjk: true,
  },
  {
    name: "Noto Sans SC",
    font: "Noto+Sans+SC:wght@700",
    weight: 700 as FontWeight,
    style: "bold" as FontStyle,
    onlyIfCjk: true,
  },
];

function cachePathFor(url: string): string {
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
  return path.join(CACHE_DIR, `font-${hash}.bin`);
}

/** 同一次构建里每个字体+文本只查一次 CSS；跨构建也复用，冷构建才需要联网 */
function cssCachePathFor(font: string, text: string): string {
  const hash = crypto
    .createHash("md5")
    .update(`${font}|${text}`)
    .digest("hex")
    .slice(0, 8);
  return path.join(CACHE_DIR, `css-${hash}.txt`);
}

/**
 * Buffer 常常只是 Node 内存池上的一个视图，直接取 .buffer 会带上池里其它字节，
 * 交给 satori 就会报「Unsupported OpenType signature」。
 */
function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength
  ) as ArrayBuffer;
}

/** woff / woff2 -> sfnt(ttf/otf)；已经是 sfnt 就原样返回 */
async function toSfnt(buf: Buffer): Promise<Buffer> {
  return detectFormat(buf) === "sfnt" ? buf : await convert(buf, "sfnt");
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  headers?: Record<string, string>
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: headers ?? {},
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Try multiple CDN mirrors to fetch the Google Fonts CSS.
 * Falls back to Chinese-accessible mirrors when Google is blocked.
 * Uses a legacy UA so Google Fonts returns ttf/woff1 URLs (not woff2).
 */
async function fetchCssFromMirrors(
  font: string,
  text: string
): Promise<string> {
  const cacheFile = cssCachePathFor(font, text);

  if (fs.existsSync(cacheFile)) {
    try {
      const cached = fs.readFileSync(cacheFile, "utf8");
      if (cached.includes("src: url(")) return cached;
    } catch {
      // ignore — 缓存读不出来就重新请求
    }
  }

  const cssPath = `css2?family=${font}&text=${encodeURIComponent(text)}`;

  const mirrors = [
    {
      name: "google",
      url: `https://fonts.googleapis.com/${cssPath}`,
      timeout: 5000,
    },
    { name: "loli", url: `https://fonts.loli.net/${cssPath}`, timeout: 8000 },
    { name: "fontim", url: `https://fonts.font.im/${cssPath}`, timeout: 8000 },
    {
      name: "geekzu",
      url: `https://fonts.geekzu.org/${cssPath}`,
      timeout: 8000,
    },
  ];

  // 并行请求所有镜像：串行时被墙的镜像会把超时一层层叠起来（最坏 29s/次）
  const attempts = mirrors.map(async ({ name, url, timeout }) => {
    const res = await fetchWithTimeout(url, timeout, { "User-Agent": FONT_UA });
    if (!res.ok) throw new Error(`${name} HTTP ${res.status}`);
    const css = await res.text();
    // 有的镜像会返回 200 + 一个错误页面，必须确认拿到的是字体 CSS
    if (!css.includes("src: url(")) throw new Error(`${name} returned non-CSS`);
    return { name, css };
  });

  try {
    const { name, css } = await Promise.any(attempts);
    console.log(`[OG] Font CSS fetched via ${name} mirror`);
    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      fs.writeFileSync(cacheFile, css);
    } catch {
      // 缓存失败不影响出图
    }
    return css;
  } catch {
    throw new Error("All font CSS mirrors unreachable");
  }
}

async function loadGoogleFont(
  font: string,
  text: string
): Promise<ArrayBuffer> {
  // 1. Get the CSS (which contains the actual font file URL)
  //    Legacy UA ensures the URL points to ttf/woff, not woff2.
  const css = await fetchCssFromMirrors(font, text);

  const resource = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype|woff2?|woff)'\)/
  );

  if (!resource) {
    console.warn(
      "[OG] Could not parse font URL from CSS. Raw CSS:",
      css.slice(0, 300)
    );
    throw new Error("Failed to parse font URL from CSS");
  }

  const fontUrl = resource[1];
  const cacheFile = cachePathFor(fontUrl);

  // 2. 先看本地缓存（存的是原始字节，读取时再按需转换）
  if (fs.existsSync(cacheFile)) {
    try {
      return toArrayBuffer(await toSfnt(fs.readFileSync(cacheFile)));
    } catch {
      // 缓存损坏或格式不认识，删掉重新下载
      try {
        fs.unlinkSync(cacheFile);
      } catch {
        // ignore
      }
    }
  }

  // 3. Fetch the actual font binary (legacy UA → compatible format)
  const res = await fetchWithTimeout(fontUrl, 12000, { "User-Agent": FONT_UA });

  if (!res.ok) {
    throw new Error(`Font file download failed (HTTP ${res.status})`);
  }

  const raw = Buffer.from(await res.arrayBuffer());

  // 4. Persist to local cache
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cacheFile, raw);
  } catch {
    // Non-fatal — cache is just an optimisation
  }

  // 5. 统一转成 satori 能解析的格式
  return toArrayBuffer(await toSfnt(raw));
}

async function loadGoogleFonts(text: string): Promise<FontOptions[]> {
  const fonts: FontOptions[] = [];
  const hasCjk = CJK_RE.test(text);

  for (const { name, font, weight, style, onlyIfCjk } of FONTS) {
    if (onlyIfCjk && !hasCjk) continue;
    try {
      const data = await loadGoogleFont(font, text);
      fonts.push({ name, data, weight, style });
    } catch (e) {
      console.warn(`[OG] Skipping font "${name}" wght=${weight}: ${e}`);
      // Continue without this font — OG image will render with whatever fonts are available
    }
  }

  return fonts;
}

export default loadGoogleFonts;
