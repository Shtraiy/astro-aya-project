#!/usr/bin/env node
/**
 * 从 Bangumi 同步追番列表 → src/data/bangumi.json
 *
 * 用的是 Bangumi 官方 v0 API（公开接口，不需要 OAuth 就能读公开收藏）：
 *   GET /v0/users/{用户名}                        拿用户信息（顺便验证用户名）
 *   GET /v0/users/{用户名}/collections            拿收藏（subject_type=2 即动画）
 *
 * 用法（两种都行）：
 *   1) 直接 `npm run sync:bangumi`，脚本会问你的 Bangumi 用户名 / UID
 *   2) 把配置写进 .env（已 gitignore），静默执行
 *
 * 在哪里跑：
 *   - 本地：大陆直连 bgm.tv 基本不通（接口和封面图床都超时），需要挂代理，
 *     见下面的 BANGUMI_PROXY
 *   - Vercel 构建时：构建机在墙外，直连即可，什么都不用配；
 *     仓库里的 vercel.json 会把构建命令指到 `npm run build:vercel`
 *
 * 可选环境变量：
 *   BANGUMI_USER        你的 Bangumi 用户名，或 UID（必填）
 *                       ⚠️ 官方接口对「UID」有前提：只有**没设置过用户名**的账号才能用 UID，
 *                          设置过用户名的账号必须用用户名（个人主页 /user/ 后面那段）。
 *                          打开 https://bangumi.tv/user/<UID>，如果地址栏跳成了字母形式，
 *                          那个就是用户名。
 *   BANGUMI_TOKEN       访问令牌，只有收藏设为「私密」或要更高频率限制时才需要
 *   BANGUMI_PROXY       HTTP 代理，例如 http://127.0.0.1:7890
 *                       只有本地同步才需要；数据请求和封面下载都会走它
 *   BANGUMI_LIMIT       每个分类最多同步多少条，默认 200
 *   BANGUMI_SKIP_COVERS=1   跳过封面下载（默认会把封面存到 public/images/bangumi/）
 *
 * 关于封面：默认把封面下载到本地。因为你的访客多半也在同一个网络环境里，
 * 直接引用 lain.bgm.tv 的图床大概率是一片裂图 —— 落地到仓库里，
 * 页面就完全不依赖 Bangumi，跟音乐收藏页一个思路。
 *
 * 失败时不会把构建搞挂：没配 BANGUMI_USER 会直接跳过；连不上但本地已有快照，
 * 就沿用上一次的数据继续构建，只在日志里留一条警告。
 */

import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { getJson, httpGet } from "./lib/http.mjs";

const API = "https://api.bgm.tv";
/** Bangumi 要求带一个能识别来源的 User-Agent，否则可能被拒 */
const UA = "SilentCage-Blog/1.0 (https://wynio.pw)";

let userName = (process.env.BANGUMI_USER ?? "").trim();
const token = (process.env.BANGUMI_TOKEN ?? "").trim();
const proxy = (process.env.BANGUMI_PROXY ?? "").trim();
const LIMIT = Number(process.env.BANGUMI_LIMIT ?? 200);
const SKIP_COVERS = process.env.BANGUMI_SKIP_COVERS === "1";

const OUT_JSON = path.join(process.cwd(), "src", "data", "bangumi.json");
const COVER_DIR = path.join(process.cwd(), "public", "images", "bangumi");

/** 收藏状态 → 数字，和 Bangumi 的 type 对应 */
const STATUS = {
  1: { key: "wish", label: "想看" },
  2: { key: "done", label: "看过" },
  3: { key: "doing", label: "在看" },
  4: { key: "on_hold", label: "搁置" },
  5: { key: "dropped", label: "抛弃" },
};

async function ask(question) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

/** 请求头：标识用的 UA + 可选 token */
function bgmHeaders(extra = {}) {
  const headers = { "User-Agent": UA, Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { ...headers, ...extra };
}

/** 带代理和请求头的 GET（HTTP 层在 lib/http.mjs，两个同步脚本共用） */
const fetchJson = url => getJson(url, { proxy, headers: bgmHeaders() });

/** 本地是否已经有上一次的快照（决定同步失败时能不能兜底） */
async function hasExistingSnapshot() {
  try {
    await access(OUT_JSON);
    return true;
  } catch {
    return false;
  }
}

/** 一个分类的全部收藏（自动翻页） */
async function fetchCollections(username, type) {
  const items = [];
  const pageSize = 50;

  for (let offset = 0; offset < LIMIT; offset += pageSize) {
    const url =
      `${API}/v0/users/${encodeURIComponent(username)}/collections` +
      `?subject_type=2&type=${type}&limit=${pageSize}&offset=${offset}`;

    const page = await fetchJson(url);
    const data = Array.isArray(page?.data) ? page.data : [];
    items.push(...data);
    if (data.length < pageSize) break;
  }

  return items.slice(0, LIMIT);
}

/** 把 Bangumi 的一条收藏压成页面要用的字段 */
function normalize(item) {
  const subject = item?.subject ?? {};
  const images = subject.images ?? {};
  const cover = images.common ?? images.large ?? images.medium ?? images.grid;
  const name = (subject.name ?? "").trim();
  const nameCN = (subject.name_cn ?? "").trim();

  return {
    id: subject.id ?? item.subject_id,
    status: item.type,
    name,
    nameCN,
    cover: cover ?? null,
    date: subject.date ?? null,
    // 总话数：不同接口给的字段名不一致，能拿到就用
    eps: subject.eps ?? subject.eps_count ?? item.eps_count ?? null,
    // 看到第几话
    epStatus: item.ep_status ?? null,
    volumeStatus: item.vol_status ?? null,
    /** 你自己的评分（Bangumi 用 0 表示没打分） */
    rate: item.rate > 0 ? item.rate : null,
    /** 全站均分与排名（条目侧的数据，和上面的个人评分是两回事） */
    score: subject.score > 0 ? subject.score : null,
    rank: subject.rank > 0 ? subject.rank : null,
    comment: (item.comment ?? "").trim() || null,
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 6) : [],
    updatedAt: item.updated_at ?? null,
  };
}

async function main() {
  if (!userName) {
    if (!stdin.isTTY) {
      stdout.write(
        "· 没有配置 BANGUMI_USER，跳过追番同步（/anime/ 会显示导入引导）\n"
      );
      return;
    }
    userName = await ask("Bangumi 用户名或 UID（例如 shtraiy 或 123456）：");
  }

  if (/^\d+$/.test(userName)) {
    stdout.write(
      "  （纯数字按 UID 处理：Bangumi 只有「没设置过用户名」的账号能用 UID；\n" +
        "    如果下面报 404 用户不存在，请改用个人主页 /user/ 后面那段用户名）\n"
    );
  }

  stdout.write(`→ 正在读取 ${userName} 的收藏…\n`);

  let user;
  try {
    user = await fetchJson(`${API}/v0/users/${encodeURIComponent(userName)}`);
    // 接口 404 时也会返回一段合法 JSON（错误对象），这里挡一下，
    // 否则会拿着一个不存在的用户名继续往下跑，报错还看不懂
    if (!user?.id) throw new Error("接口返回的不是用户对象");
  } catch (error) {
    throw new Error(
      [
        `拿不到用户信息：${error.message}`,
        "",
        "常见原因：",
        "  1. 填的是 UID，但账号设置过用户名 —— 官方接口此时只认用户名，",
        "     换成 https://bangumi.tv/user/<UID> 跳转后地址栏里的那个名字",
        "  2. 用户名写错了",
        "  3. 这台机器连不上 bgm.tv —— 换个网络，或者配 BANGUMI_PROXY 走代理",
        "  4. 收藏设成了「私密」—— 需要在 .env 里补 BANGUMI_TOKEN",
      ].join("\n")
    );
  }

  const username = user.username ?? String(user.id);
  const items = [];

  for (const type of Object.keys(STATUS)) {
    const collected = await fetchCollections(username, Number(type));
    items.push(...collected.map(normalize));
    stdout.write(
      `  ${STATUS[type].label}：${collected.length} 部\n`
    );
  }

  const payload = {
    user: {
      id: user.id ?? null,
      username,
      nickname: user.nickname ?? username,
      avatar: user.avatar?.large ?? user.avatar?.medium ?? null,
      sign: user.sign ?? null,
      url: `https://bgm.tv/user/${username}`,
    },
    syncedAt: new Date().toISOString(),
    items,
  };

  if (!SKIP_COVERS) {
    await mkdir(COVER_DIR, { recursive: true });
    stdout.write("→ 正在缓存封面…\n");
    let saved = 0;
    for (const item of items) {
      if (!item.cover) continue;
      try {
        const buffer = await httpGet(item.cover, {
          binary: true,
          proxy,
          headers: bgmHeaders({ Referer: "https://bgm.tv/" }),
        });
        const file = path.join(COVER_DIR, `${item.id}.jpg`);
        await writeFile(file, buffer);
        item.cover = `/images/bangumi/${item.id}.jpg`;
        saved += 1;
      } catch {
        // 单张失败不影响整体
      }
    }
    stdout.write(`  已缓存 ${saved} 张封面到 public/images/bangumi/\n`);
  }

  await mkdir(path.dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  stdout.write(
    `\n✓ 已写入 ${path.relative(process.cwd(), OUT_JSON)}（共 ${items.length} 部）\n`
  );
  stdout.write("重新构建站点后即可在 /anime/ 看到。\n");
}

main().catch(error => {
  stdout.write(`\n✗ ${error.message}\n`);
  return hasExistingSnapshot().then(existing => {
    if (existing) {
      // 构建机偶尔抽风、或者 bgm 临时 502，都不该让整站部署失败
      stdout.write(
        "  ↳ 已有 src/data/bangumi.json，本次沿用上一次的快照继续构建。\n"
      );
      return;
    }
    stdout.write("  ↳ 本地没有可用的快照，这次同步没有产出数据。\n");
    process.exitCode = 1;
  });
});
