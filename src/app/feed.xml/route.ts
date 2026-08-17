import { getAllPosts } from "@/lib/mdx";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = getAllPosts("blog");
  const reviews = getAllPosts("reviews");
  const aiTools = getAllPosts("ai-tools");

  const allItems = [
    ...posts.map((p) => ({ ...p, section: "Blog" })),
    ...reviews.map((p) => ({ ...p, section: "Reviews" })),
    ...aiTools.map((p) => ({ ...p, section: "AI Tools" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = allItems
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://techveb.com/${post.section.toLowerCase().replace(" ", "-")}/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.section}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">https://techveb.com/${post.section.toLowerCase().replace(" ", "-")}/${post.slug}</guid>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>TechVeb</title>
    <link>https://techveb.com</link>
    <description>AI & Technology News, Reviews, and Tutorials</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://techveb.com/feed.xml" rel="self" type="application/rss+xml"/>
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
