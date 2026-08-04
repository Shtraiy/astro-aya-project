import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

/** Minimal fallback when satori + font loading fails entirely */
function fallbackOgPng(title: string): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#fefbfb"/>
    <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#000" stroke-width="4" rx="4"/>
    <text x="600" y="340" font-family="sans-serif" font-size="48" font-weight="bold" fill="#333"
          text-anchor="middle" dominant-baseline="middle">${escapeXml(title)}</text>
  </svg>`;
  const resvg = new Resvg(svg);
  return resvg.render().asPng();
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  try {
    const svg = await postOgImage(post);
    return svgBufferToPngBuffer(svg);
  } catch (e) {
    console.warn(`[OG] Falling back to simple OG for "${post.data.title}": ${e}`);
    return fallbackOgPng(post.data.title);
  }
}

export async function generateOgImageForSite() {
  try {
    const svg = await siteOgImage();
    return svgBufferToPngBuffer(svg);
  } catch (e) {
    console.warn(`[OG] Falling back to simple OG for site: ${e}`);
    return fallbackOgPng("Site OG");
  }
}
