/**
 * 曲库（`/collection/data.json`，构建期由 `sync:navidrome` 的快照发布）的浏览器侧读取。
 *
 * 两个消费者：站内播放器（要 stream 凭据与曲目 id）和收藏页的搜索（要曲名）。
 * 收在一个模块里，是为了两者共用同一份缓存 —— 收藏页不会为了搜曲名再拉一次 79 KB。
 * 曲库只在真要用的时候才请求，失败后可以重试。
 */

export interface LibraryTrack {
  id: string;
  title: string;
  track: number | null;
  duration: number | null;
}

export interface LibraryAlbum {
  id: string;
  name: string;
  artist: string;
  cover: string | null;
  tracks: LibraryTrack[];
}

/** 站内播放用的 Subsonic 凭据（等同只读账号，见 docs/data-sync.md） */
export interface LibraryStream {
  user: string;
  token: string;
  salt: string;
  client: string;
}

export interface Library {
  serverUrl: string;
  stream: LibraryStream;
  albums: LibraryAlbum[];
}

const DATA_URL = "/collection/data.json";

let cache: Library | null = null;
let pending: Promise<Library | null> | null = null;

/** 已经拿到的曲库（还没有就是 null）：给「拿到了就用」的场景，避免白等一次 Promise */
export const peekLibrary = (): Library | null => cache;

export function loadLibrary(): Promise<Library | null> {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;

  pending = fetch(DATA_URL)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<Library>;
    })
    .then(data => {
      if (!data?.albums?.length) throw new Error("曲库是空的");
      cache = data;
      return cache;
    })
    .catch(() => {
      // 失败不缓存，下次调用可以重试
      pending = null;
      return null;
    });

  return pending;
}
