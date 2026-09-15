/**
 * GitHub 活跃度数据（构建时抓一次，渲染成 SVG 热力图）。
 *
 * 用的是公开的 github-contributions-api（不需要 token、不需要 GitHub App），
 * 抓不到就返回 null，调用方跳过这一块 —— 本地断网构建也不会挂。
 */

export interface ActivityDay {
  date: string;
  count: number;
  /** 0-4，GitHub 自己的分档 */
  level: number;
}

export interface ActivityGrid {
  total: number;
  /** 按周分组的格子，每列 7 天；开头会补 null 让第一列从周日开始 */
  weeks: (ActivityDay | null)[][];
  /** 月份标签：x 是第几列 */
  months: { week: number; label: string }[];
}

const API = "https://github-contributions-api.jogruber.de/v4";
const UA = "SilentCage-Blog/1.0 (https://wynio.pw)";

/** 从 GitHub 个人主页地址里取出用户名 */
export function usernameFromUrl(url: string): string {
  const match = url.match(/github\.com\/([^/?#]+)/i);
  return match ? match[1] : "";
}

export async function fetchGitHubActivity(
  username: string
): Promise<ActivityGrid | null> {
  if (!username) return null;

  let payload: { contributions?: ActivityDay[]; total?: { lastYear?: number } };
  try {
    const res = await fetch(`${API}/${username}?y=last`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    payload = await res.json();
  } catch {
    return null;
  }

  const days = payload.contributions ?? [];
  if (!days.length) return null;

  // 第一列从周日开始：前面补几个空格子
  const leading = new Date(days[0].date).getDay();
  const cells: (ActivityDay | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...days,
  ];

  const weeks: (ActivityDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // 每个月第一次出现的那个格子所在的列，用来画月份标签
  const months: { week: number; label: string }[] = [];
  let lastMonth = "";
  weeks.forEach((week, index) => {
    for (const day of week) {
      if (!day) continue;
      const month = day.date.slice(0, 7);
      if (month !== lastMonth) {
        lastMonth = month;
        months.push({ week: index, label: `${Number(month.slice(5))}月` });
      }
      break;
    }
  });

  return {
    total: payload.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0),
    weeks,
    months,
  };
}
