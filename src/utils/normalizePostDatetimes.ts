import { readFileSync, statSync } from "node:fs";
import type { CollectionEntry } from "astro:content";
import { SITE_UTC_OFFSET } from "./siteDate";

type Post = CollectionEntry<"blog">;
type CachedDates = {
  mtimeMs: number;
  pubDatetime: Date | null;
  modDatetime: Date | null;
};

const cache = new Map<string, CachedDates>();

const normalizeLegacyValue = (value: string) => {
  const raw = value
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\s+#.*$/, "")
    .trim();

  if (/(?:z|[+-]\d{2}:?\d{2})$/i.test(raw)) return null;

  const match = raw.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!match) return null;

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
  return new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:${second}${SITE_UTC_OFFSET}`
  );
};

const readLegacyDates = (filePath: string) => {
  const { mtimeMs } = statSync(filePath);
  const cached = cache.get(filePath);
  if (cached?.mtimeMs === mtimeMs) return cached;

  const frontmatter = readFileSync(filePath, "utf8").match(
    /^---\r?\n([\s\S]*?)\r?\n---/
  )?.[1];
  const dates: CachedDates = {
    mtimeMs,
    pubDatetime: null,
    modDatetime: null,
  };

  if (frontmatter) {
    for (const line of frontmatter.split(/\r?\n/)) {
      const match = line.match(/^(pubDatetime|modDatetime):\s*(.+?)\s*$/);
      if (!match) continue;
      dates[match[1] as "pubDatetime" | "modDatetime"] = normalizeLegacyValue(
        match[2]
      );
    }
  }

  cache.set(filePath, dates);
  return dates;
};

/**
 * 旧文章的 YAML 时间没写时区时会被解析成 UTC。
 * 这里从源文件确认原始写法，只在缺时区时按站点时区重算，避免加 8 小时后
 * 跨日或让本地 / Docker 构建出现不同结果。
 */
const normalizePostDatetimes = (post: Post): Post => {
  if (!post.filePath) return post;

  const legacy = readLegacyDates(post.filePath);
  if (!legacy.pubDatetime && !legacy.modDatetime) return post;

  return {
    ...post,
    data: {
      ...post.data,
      pubDatetime: legacy.pubDatetime ?? post.data.pubDatetime,
      modDatetime: legacy.modDatetime ?? post.data.modDatetime,
    },
  };
};

export default normalizePostDatetimes;
