/**
 * 同步脚本共用的 HTTP 层。
 *
 * 配了代理就走 curl（Node 自带的 fetch 不支持代理），没配就用 fetch。
 * Navidrome / Bangumi 两个同步脚本都从这里发请求，行为保持一致；
 * 顺带让 Navidrome 那边也支持了 `NAVIDROME_PROXY`。
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** 默认 UA：有些接口（比如 Bangumi）会拒绝没有标识的请求 */
export const DEFAULT_UA = "SilentCage-Blog/1.0 (https://wynio.pw)";

/**
 * GET 一个地址。
 * @param {string} url
 * @param {{ headers?: Record<string,string>, proxy?: string, binary?: boolean, timeoutMs?: number }} [options]
 * @returns {Promise<string | Buffer>} 默认返回文本，binary 时返回 Buffer
 */
export async function httpGet(url, options = {}) {
  const { headers = {}, proxy = "", binary = false, timeoutMs = 30_000 } = options;

  if (proxy) {
    const args = [
      "-sS",
      "-L",
      "-f",
      "-x",
      proxy,
      "-m",
      String(Math.max(1, Math.round(timeoutMs / 1000))),
    ];
    for (const [name, value] of Object.entries(headers)) {
      args.push("-H", `${name}: ${value}`);
    }
    args.push(url);

    const { stdout } = await execFileAsync("curl", args, {
      encoding: binary ? "buffer" : "utf8",
      maxBuffer: 128 * 1024 * 1024,
    });
    return stdout;
  }

  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — ${url}`);
  }
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

/** GET 一个 JSON 地址并解析 */
export async function getJson(url, options) {
  const body = await httpGet(url, options);
  return JSON.parse(typeof body === "string" ? body : body.toString("utf8"));
}
