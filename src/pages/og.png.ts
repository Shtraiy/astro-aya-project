import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@utils/generateOgImages";

// 站点默认 OG 图（SITE.ogImage 指向 /og.png）：构建时用 site.tsx 模板生成，
// 之前因为字体解析失败而退回 public/astropaper-og.jpg（那是 AstroPaper 模板的演示截图）。
export const GET: APIRoute = async () =>
  new Response(await generateOgImageForSite(), {
    headers: { "Content-Type": "image/png" },
  });
