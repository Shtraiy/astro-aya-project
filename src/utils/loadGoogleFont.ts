import type { FontStyle, FontWeight } from "satori";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

// Local cache so fonts are downloaded only once
const CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "fonts");

// satori uses opentype.js under the hood, which only supports ttf / otf / woff1.
// Google Fonts serves woff2 to modern User-Agents, so we spoof an older UA that
// only accepts truetype/woff1, forcing Google Fonts to give us a compatible format.
const FONT_UA =
  "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko";

function cachePathFor(url: string): string {
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
  return path.join(CACHE_DIR, `font-${hash}.bin`);
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
  const cssPath = `css2?family=${font}&text=${encodeURIComponent(text)}`;

  const mirrors = [
    { name: "google", url: `https://fonts.googleapis.com/${cssPath}`, timeout: 5000 },
    { name: "loli", url: `https://fonts.loli.net/${cssPath}`, timeout: 8000 },
    { name: "fontim", url: `https://fonts.font.im/${cssPath}`, timeout: 8000 },
    { name: "geekzu", url: `https://fonts.geekzu.org/${cssPath}`, timeout: 8000 },
  ];

  for (const { name, url, timeout } of mirrors) {
    try {
      const res = await fetchWithTimeout(url, timeout, { "User-Agent": FONT_UA });
      if (res.ok) {
        console.log(`[OG] Font CSS fetched via ${name} mirror`);
        return await res.text();
      }
    } catch {
      // Try next mirror
    }
  }

  throw new Error("All font CSS mirrors unreachable");
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
    console.warn("[OG] Could not parse font URL from CSS. Raw CSS:", css.slice(0, 300));
    throw new Error("Failed to parse font URL from CSS");
  }

  const fontUrl = resource[1];
  const cacheFile = cachePathFor(fontUrl);

  // 2. Check local cache first
  if (fs.existsSync(cacheFile)) {
    try {
      return fs.readFileSync(cacheFile).buffer as ArrayBuffer;
    } catch {
      // Corrupt cache — re-fetch
    }
  }

  // 3. Fetch the actual font binary (legacy UA → compatible format)
  const res = await fetchWithTimeout(fontUrl, 12000, { "User-Agent": FONT_UA });

  if (!res.ok) {
    throw new Error(`Font file download failed (HTTP ${res.status})`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  // 4. Persist to local cache
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(cacheFile, new Uint8Array(buffer));
  } catch {
    // Non-fatal — cache is just an optimisation
  }

  return buffer.buffer as ArrayBuffer;
}

async function loadGoogleFonts(text: string): Promise<FontOptions[]> {
  const fontsConfig = [
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
  ];

  const fonts: FontOptions[] = [];

  for (const { name, font, weight, style } of fontsConfig) {
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
