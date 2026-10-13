import { getAllNewsPosts, getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = siteConfig.url;

  const latest = [...getAllNewsPosts(), ...getAllPosts("blog")].reduce(
    (max, post) => {
      const t = new Date(post.date).getTime();
      return Number.isFinite(t) && t > max ? t : max;
    },
    0
  );
  const lastmod = new Date(latest || Date.now()).toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/news-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
    },
  });
}
