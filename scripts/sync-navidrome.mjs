#!/usr/bin/env node
/**
 * 从 Navidrome 同步音乐收藏 → src/data/navidrome.json（+ public/images/navidrome/ 封面）
 *
 * Navidrome 实现了 Subsonic API，这里只用到两个接口：
 *   getAlbumList2  拉专辑列表
 *   getCoverArt    下载封面（构建时落地到本地，页面运行时不依赖 Navidrome）
 *
 * 用法（两种都行）：
 *   1) 直接 `npm run sync:navidrome`，脚本会依次问你地址 / 用户名 / 密码
 *      （密码不回显，也不会进 Shell 历史）
 *   2) 或者把凭据写进 .env（已 gitignore），脚本读环境变量，静默执行
 *
 * 认证用的是 Subsonic 标准的 salt+token 方式（md5(密码+salt)），
 * 不会把明文密码放进 URL；但请求仍然要带用户名，所以务必用独立的只读账号。
 *
 * 可选环境变量：
 *   NAVIDROME_LIMIT        最多同步多少张专辑，默认 500
 *   NAVIDROME_COVER_SIZE   封面边长，默认 300
 *   NAVIDROME_SKIP_COVERS=1 跳过封面下载（只更新列表）
 *   NAVIDROME_PROXY        HTTP 代理，例如 http://127.0.0.1:7890（本机连不上时才需要）
 */

import { createHash } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import { stdin, stdout } from "node:process";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { getJson, httpGet } from "./lib/http.mjs";

let serverUrl = (process.env.NAVIDROME_URL ?? "").replace(/\/+$/, "");
let userName = process.env.NAVIDROME_USER ?? "";
let userPass = process.env.NAVIDROME_PASS ?? "";
const LIMIT = Number(process.env.NAVIDROME_LIMIT ?? 500);
const COVER_SIZE = process.env.NAVIDROME_COVER_SIZE ?? "300";
const SKIP_COVERS = process.env.NAVIDROME_SKIP_COVERS === "1";
/** 可选：本地网络连不上 Navidrome 时走代理（HTTP 层在 lib/http.mjs） */
const PROXY = (process.env.NAVIDROME_PROXY ?? "").trim();
const UA = "SilentCage-Blog/1.0 (https://wynio.pw)";

const OUT_JSON = path.join(process.cwd(), "src", "data", "navidrome.json");
const COVER_DIR = path.join(process.cwd(), "public", "images", "navidrome");

const ENV_HELP = [
  "缺少 Navidrome 凭据。可以直接重跑让脚本问你，或先把这些写进 .env（已 gitignore）：",
  "  NAVIDROME_URL   例如 https://music.example.com（公网、https）",
  "  NAVIDROME_USER  只读账号",
  "  NAVIDROME_PASS  该账号密码",
].join("\n");

async function ask(question) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

/**
 * 密码输入：自己进 raw mode 逐字符读，不回显（就是 `read -s` 的做法）。
 * 不走 readline 的内部钩子，行为可控。
 */
async function askHidden(question) {
  if (!stdin.isTTY) return ask(question);

  stdout.write(question);
  const wasRaw = stdin.isRaw;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return new Promise(resolve => {
    let value = "";

    const finish = () => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
      stdout.write("\n");
      resolve(value.trim());
    };

    const onData = chunk => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") return finish();
        if (char === "\u0003") {
          stdout.write("\n");
          process.exit(130); // Ctrl+C
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        value += char;
      }
    };

    stdin.on("data", onData);
  });
}

async function resolveCredentials() {
  const missing = [
    !serverUrl && "NAVIDROME_URL",
    !userName && "NAVIDROME_USER",
    !userPass && "NAVIDROME_PASS",
  ].filter(Boolean);
  if (!missing.length) return false;

  if (!stdin.isTTY) {
    console.error(ENV_HELP);
    process.exit(1);
  }

  console.log(
    `没有读到完整的凭据（缺 ${missing.join(" / ")}），直接问你几句：`
  );
  if (!serverUrl) {
    serverUrl = (await ask("Navidrome 地址（例如 https://music.example.com）："))
      .replace(/\/+$/, "");
  }
  if (!userName) userName = await ask("用户名：");
  if (!userPass) userPass = await askHidden("密码（输入时不显示）：");

  if (!serverUrl || !userName || !userPass) {
    console.error("\n✗ 三项都不能为空。");
    process.exit(1);
  }
  return true;
}

/** 交互录入的凭据可以顺手存进 .env，省得下次再输 */
async function offerToSaveEnv() {
  let exists = true;
  try {
    await access(path.join(process.cwd(), ".env"));
  } catch {
    exists = false;
  }
  if (exists) return;

  const answer = await ask("要把这些凭据写进 .env 吗？下次就不用再输（y/N）：");
  if (!/^y(es)?$/i.test(answer)) return;
  await writeFile(
    path.join(process.cwd(), ".env"),
    [
      `NAVIDROME_URL=${serverUrl}`,
      `NAVIDROME_USER=${userName}`,
      `NAVIDROME_PASS=${userPass}`,
      "",
    ].join("\n")
  );
  console.log("✓ 已写入 .env（已在 .gitignore 里，不会提交）");
}

const interactive = await resolveCredentials();

const salt = Math.random().toString(36).slice(2, 12);
const token = createHash("md5").update(userPass + salt).digest("hex");

/** 拼出 Subsonic 请求地址（认证信息在查询串里） */
function urlOf(method, params = {}) {
  const query = new URLSearchParams({
    u: userName,
    t: token,
    s: salt,
    v: "1.16.1",
    c: "silentcage-blog",
    f: "json",
    ...params,
  });
  return `${serverUrl}/rest/${method}.view?${query}`;
}

async function call(method, params) {
  const body = await getJson(urlOf(method, params), {
    proxy: PROXY,
    headers: { "User-Agent": UA },
  });
  const payload = body["subsonic-response"];
  if (payload?.status !== "ok") {
    const detail = payload?.error
      ? `${payload.error.code} ${payload.error.message}`
      : "未知错误";
    throw new Error(`${method} 失败：${detail}`);
  }
  return payload;
}

async function main() {
  console.log(`→ 连接 Navidrome：${serverUrl}`);
  await call("ping");
  console.log("✓ 认证通过");

  const list = await call("getAlbumList2", {
    type: "alphabeticalByArtist",
    size: String(LIMIT),
    offset: "0",
  });
  const albums = list.albumList2?.album ?? [];
  console.log(`✓ 取到 ${albums.length} 张专辑`);

  // 逐张拉曲目：站内播放需要每首歌的 id
  const tracksByAlbum = new Map();
  for (const [index, album] of albums.entries()) {
    try {
      const detail = await call("getAlbum", { id: album.id });
      tracksByAlbum.set(
        album.id,
        (detail.album?.song ?? []).map(song => ({
          id: song.id,
          title: song.title,
          track: song.track ?? null,
          duration: song.duration ?? null,
        }))
      );
    } catch (error) {
      console.warn(`  ! 曲目失败 ${album.name}：${error.message}`);
      tracksByAlbum.set(album.id, []);
    }
    if ((index + 1) % 25 === 0) {
      console.log(`  … 曲目 ${index + 1}/${albums.length}`);
    }
  }
  console.log("✓ 曲目已抓取");

  let covers = 0;
  if (!SKIP_COVERS) {
    await mkdir(COVER_DIR, { recursive: true });
    for (const [index, album] of albums.entries()) {
      if (!album.coverArt) continue;
      try {
        const bytes = await httpGet(
          urlOf("getCoverArt", { id: album.coverArt, size: COVER_SIZE }),
          { binary: true, proxy: PROXY, headers: { "User-Agent": UA } }
        );
        await writeFile(path.join(COVER_DIR, `${album.id}.jpg`), bytes);
        covers += 1;
      } catch (error) {
        console.warn(`  ! 封面失败 ${album.name}：${error.message}`);
      }
      if ((index + 1) % 25 === 0) {
        console.log(`  … 封面 ${index + 1}/${albums.length}`);
      }
    }
    console.log(`✓ 下载封面 ${covers} 张 → public/images/navidrome/`);
  }

  const data = {
    serverUrl,
    syncedAt: new Date().toISOString(),
    albums: albums.map(album => ({
      id: album.id,
      name: album.name,
      artist: album.artist ?? "",
      artistId: album.artistId ?? null,
      year: album.year ?? null,
      genre: album.genre ?? null,
      songCount: album.songCount ?? null,
      /** 秒 */
      duration: album.duration ?? null,
      starred: Boolean(album.starred),
      playCount: album.playCount ?? 0,
      cover:
        !SKIP_COVERS && album.coverArt
          ? `/images/navidrome/${album.id}.jpg`
          : null,
      tracks: tracksByAlbum.get(album.id) ?? [],
    })),
    /*
      站内播放用的凭据。token 是 md5(密码 + salt)，而 Subsonic 接受任意 salt，
      所以它等同于一份长期有效的凭据，会随本文件进仓库、进前端。
      想避免这一点，就用反代在服务端注入凭据，前端只请求 /nd/rest/stream（README 有说明）。
    */
    stream: { user: userName, token, salt, client: "silentcage-blog" },
  };

  await writeFile(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`✓ 写入 src/data/navidrome.json`);
  console.warn(
    "⚠ 该文件含 stream token（等同于读取整个音乐库的凭据）。" +
      "站点公开的话，建议改用反代在服务端注入（README「站内播放」一节）。"
  );
  console.log("→ 下一步：npm run build");

  if (interactive) await offerToSaveEnv();
}

main().catch(error => {
  console.error(`✗ 同步失败：${error.message}`);
  process.exit(1);
});
