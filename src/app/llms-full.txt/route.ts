import { getAllPostsFromAllDirs, getAllNewsPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = getAllPostsFromAllDirs();
  const allNews = getAllNewsPosts();
  const sorted = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedNews = allNews.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sections = sorted.map((post) => {
    const dir = post.dir;
    const url = `${siteConfig.url}/${dir}/${post.slug}`;
    return `## ${post.title}

- URL: ${url}
- Category: ${post.category}
- Author: ${post.author}
- Published: ${post.date}
${post.updated ? `- Updated: ${post.updated}` : ""}

${post.description}

---
`;
  });

  const newsSections = sortedNews.map((post) => {
    const url = `${siteConfig.url}/news/${post.slug}`;
    return `## ${post.title}

- URL: ${url}
- Category: ${post.category}
- Language: ${post.language === "ur" ? "Urdu" : "English"}
- Source: ${post.source || "TechVeb News"}
- Author: ${post.author}
- Published: ${post.date}

${post.description}

---
`;
  });

  const txt = `# ${siteConfig.name} - Complete Content Directory

${siteConfig.description}

This file contains full summaries of all ${sorted.length + sortedNews.length} articles on TechVeb (${sorted.length} blog/reviews/AI tools + ${sortedNews.length} news articles).

## Blog, Reviews & AI Tools
${sections.join("\n")}

## News Articles (English & Urdu)
${newsSections.join("\n")}

---
Generated: ${new Date().toISOString().split("T")[0]}
`;

  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
