#!/usr/bin/env node
/**
 * 友链圈：抓各家友链的最新文章 → src/data/friends-posts.json
 *
 * 为什么在构建时抓、而不是前端调第三方服务（参考主题用的 friend-circle-lite）：
 * 少一个要部署和维护的服务，也不用让访客的浏览器去请求一堆外站。
 * 数据是快照，跟着站点一起重新部署即可。
 *
 * 用法：
 *   npm run sync:friend-circle
 * 好友列表读 src/data/links.json；某个人的 feed 字段没填时，脚本会去他首页
 * 找 <link rel="alternate" type="application/rss+xml">，找不到再试几个常见路径。
 *
 * 可选环境变量：
 *   FRIEND_CIRCLE_PER_SITE   每个人取几篇，默认 2
 *   FRIEND_CIRCLE_LIMIT      合并后最多留几篇，默认 8
 *   FRIEND_CIRCLE_PROXY      需要代理时填，例如 http://127.0.0.1:7890
 *
 * 抓不到不会把构建搞挂：单个站点失败就跳过；全部失败则沿用上一次的快照。
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { httpGet } from "./lib/http.mjs";

const UA = "SilentCage-Blog/1.0 (https://wynio.pw)";
const PROXY = (process.env.FRIEND_CIRCLE_PROXY ?? "").trim();
const PER_SITE = Number(process.env.FRIEND_CIRCLE_PER_SITE ?? 2);
const LIMIT = Number(process.env.FRIEND_CIRCLE_LIMIT ?? 8);

const LINKS_JSON = path.join(process.cwd(), "src", "data", "links.json");
const OUT_JSON = path.join(process.cwd(), "src", "data", "friends-posts.json");

/** 常见订阅路径（首页里没声明 feed 时挨个试） */
const FEED_CANDIDATES = [
  "/rss.xml",
  "/feed",
  "/feed.xml",
  "/atom.xml",
  "/index.xml",
  "/rss",
];

const get = (url, timeoutMs = 12_000) =>
  httpGet(url, { proxy: PROXY, headers: { "User-Agent": UA }, timeoutMs });

/** 去掉标签与实体，拿到纯文本 */
function textOf(xml) {
  return xml
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** 从 XML 里按标签名取第一段内容（RSS / Atom 的写法都兼容） */
function pick(block, names) {
  for (const name of names) {
    const match = block.match(
      new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i")
    );
    if (match) {
      const value = textOf(match[1]);
      if (value) return value;
    }
  }
  return "";
}

/** Atom 的链接在属性里：<link rel="alternate" href="…"/> */
function atomLink(block) {
  const alternate = block.match(
    /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i
  );
  if (alternate) return alternate[1];
  const any = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  return any ? any[1] : "";
}

/** 从订阅内容里解析出文章列表 */
function parseFeed(xml) {
  const isAtom = /<feed[\s>]/i.test(xml.slice(0, 800));
  const blocks = xml.match(isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi) ?? [];

  return blocks
    .map(block => {
      const title = pick(block, ["title"]);
      const link = isAtom
        ? atomLink(block)
        : pick(block, ["link", "guid"]) || atomLink(block);
      const date = pick(block, ["pubDate", "published", "updated", "dc:date"]);
      return { title, link, date };
    })
    .filter(item => item.title && item.link);
}

/** 首页里声明的 feed 地址 */
async function discoverFeed(site) {
  const html = await get(site);
  const declared = html.match(
    /<link[^>]*type=["']application\/(?:rss|atom)\+xml["'][^>]*>/i
  );
  if (declared) {
    const href = declared[0].match(/href=["']([^"']+)["']/i);
    if (href) return new URL(href[1], site).href;
  }

  for (const candidate of FEED_CANDIDATES) {
    const url = new URL(candidate, site).href;
    try {
      const body = await get(url);
      if (/<(rss|feed)[\s>]/i.test(body.slice(0, 500))) return url;
    } catch {
      // 试下一个路径
    }
  }
  return "";
}

async function readFriends() {
  const raw = await readFile(LINKS_JSON, "utf8");
  return JSON.parse(raw).friends ?? [];
}

/** 带上一次的结果，方便失败时兜底 */
async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT_JSON, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const friends = await readFriends();
  if (!friends.length) {
    stdout.write("· links.json 里没有友链，跳过\n");
    return;
  }

  stdout.write(`→ 正在读 ${friends.length} 位友链的订阅…\n`);

  const collected = [];
  const results = await Promise.allSettled(
    friends.map(async friend => {
      const feed = friend.feed || (await discoverFeed(friend.link));
      if (!feed) throw new Error("没找到订阅地址");
      const items = parseFeed(await get(feed));
      if (!items.length) throw new Error("订阅里没有文章");
      return { friend: friend.name, feed, items: items.slice(0, PER_SITE) };
    })
  );

  results.forEach((result, index) => {
    const friend = friends[index];
    if (result.status === "rejected") {
      stdout.write(`  ! ${friend.name}：${result.reason?.message ?? "失败"}\n`);
      return;
    }
    stdout.write(
      `  ✓ ${friend.name}：${result.value.items.length} 篇（${result.value.feed}）\n`
    );
    for (const item of result.value.items) {
      collected.push({
        friend: result.value.friend,
        title: item.title,
        link: item.link,
        date: item.date ? new Date(item.date).toISOString() : null,
      });
    }
  });

  if (!collected.length) {
    const previous = await readPrevious();
    stdout.write(
      previous?.posts?.length
        ? "· 这次一篇都没抓到，沿用上一次的快照\n"
        : "· 这次一篇都没抓到，页面上的友链圈会先隐藏\n"
    );
    return;
  }

  const posts = collected
    .sort(
      (a, b) =>
        (b.date ? new Date(b.date).getTime() : 0) -
        (a.date ? new Date(a.date).getTime() : 0)
    )
    .slice(0, LIMIT);

  await writeFile(
    OUT_JSON,
    `${JSON.stringify({ syncedAt: new Date().toISOString(), posts }, null, 2)}\n`,
    "utf8"
  );
  stdout.write(
    `✓ 已写入 ${path.relative(process.cwd(), OUT_JSON)}（最新 ${posts.length} 篇）\n`
  );
}

main().catch(error => {
  stdout.write(`✗ 友链圈同步失败：${error.message}\n`);
  // 不阻断构建：页面读不到文件时会自己隐藏这一块
});
