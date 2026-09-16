import type { APIRoute } from "astro";
import { loadCollection } from "@utils/collectionData";

/**
 * 播放器的曲库：构建期把快照写成静态 JSON。
 *
 * 播放器现在挂在 Layout 上（常驻），不能再把整份曲库内联进收藏页 HTML ——
 * 那会让每个页面都背上上百 KB。改成这个端点按需取一份，浏览器与 CDN 各自缓存，
 * 而且曲库更新只影响这一个文件。
 *
 * 和快照一样，这里带着只读的 Subsonic 凭据（等同账号密码），别改成公开镜像。
 */
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(loadCollection()), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
