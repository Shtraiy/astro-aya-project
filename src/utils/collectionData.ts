import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Navidrome 音乐收藏快照（`src/data/navidrome.json`，由 `npm run sync:navidrome` 生成）。
 *
 * 这份快照现在有两个消费者：
 * - 收藏页在构建期读它，渲染封面墙、艺术家药丸与统计
 * - `/collection/data.json` 端点把它原样发布成静态资源，播放器运行时按需取一份
 *
 * 读取逻辑收在这里，两处就不会各写一份、也不会各自处理一遍文件缺失。
 */
export interface Track {
  id: string;
  title: string;
  track: number | null;
  duration: number | null;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId?: string | null;
  year: number | null;
  genre: string | null;
  songCount: number | null;
  /** 秒 */
  duration: number | null;
  starred: boolean;
  /** 播放次数，快照里有，页面上暂时没用 */
  playCount?: number;
  cover: string | null;
  tracks: Track[];
}

/** 站内播放用的 Subsonic 凭据（等同只读账号，见 README「站内播放」） */
export interface StreamCredential {
  user: string;
  token: string;
  salt: string;
  client: string;
}

export interface CollectionData {
  serverUrl: string;
  syncedAt: string | null;
  stream: StreamCredential;
  albums: Album[];
}

export const EMPTY_COLLECTION: CollectionData = {
  serverUrl: "",
  syncedAt: null,
  stream: { user: "", token: "", salt: "", client: "" },
  albums: [],
};

/**
 * 读不到快照就退回空状态（收藏页显示导入引导），而不是让构建失败 ——
 * 数据文件提交与否、CI 上有没有，都不该把站点构建搞挂。
 */
export const loadCollection = (): CollectionData => {
  try {
    const file = path.join(process.cwd(), "src", "data", "navidrome.json");
    const parsed = JSON.parse(readFileSync(file, "utf8")) as CollectionData;
    return { ...EMPTY_COLLECTION, ...parsed, albums: parsed.albums ?? [] };
  } catch {
    return EMPTY_COLLECTION;
  }
};
