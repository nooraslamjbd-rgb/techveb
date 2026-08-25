import { getAllPosts, getAllNewsPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = getAllPosts("blog");
  const reviews = getAllPosts("reviews");
  const aiTools = getAllPosts("ai-tools");
  const news = getAllNewsPosts();

  const allItems = [
    ...posts.map((p) => ({ ...p, section: "Blog" })),
    ...reviews.map((p) => ({ ...p, section: "Reviews" })),
    ...aiTools.map((p) => ({ ...p, section: "AI Tools" })),
    ...news.map((p) => ({ ...p, section: "News", dir: "news" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = allItems
    .map(
      (post) => {
        const dir = post.dir;
        const link = `${siteConfig.url}/${dir}/${post.slug}`;
        const imageExt = post.image?.split('.').pop()?.toLowerCase() || 'png';
        const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif', svg: 'image/svg+xml' };
        const mimeType = mimeMap[imageExt] || 'image/jpeg';
        const imageTag = post.image
          ? `      <enclosure url="${post.image}" type="${mimeType}"/>\n`
          : "";
        return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
      <category>${post.section}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${link}</guid>
${imageTag}    </item>`;
      }
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${siteConfig.name}]]></title>
    <link>${siteConfig.url}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/logo.png</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
