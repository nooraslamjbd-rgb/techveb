import { getAllNewsPosts, getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const newsPosts = getAllNewsPosts();
  const blogNews = getAllPosts("blog").filter((p) => p.category === "tech-news");

  const allNews = [...newsPosts, ...blogNews]
    .filter((p) => {
      try {
        return new Date(p.date).getTime() >= twoDaysAgo.getTime();
      } catch {
        return false;
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 1000);

  const items = allNews
    .map((post) => {
      const link = `${siteConfig.url}/news/${post.slug}`;
      const pubDate = new Date(post.date);
      const dateStr = pubDate.toISOString();
      const title = String(post.title || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
      return `  <url>
    <loc>${link}</loc>
    <news:news>
      <news:publication>
        <news:name>${siteConfig.name}</news:name>
        <news:language>${post.language === "ur" ? "ur" : "en"}</news:language>
      </news:publication>
      <news:publication_date>${dateStr}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
    },
  });
}
