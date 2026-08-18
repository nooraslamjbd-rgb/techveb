import { getAllPostsFromAllDirs, getDirFromCategory } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = getAllPostsFromAllDirs();
  const sorted = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sections = sorted.map((post) => {
    const dir = getDirFromCategory(post.category);
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

  const txt = `# ${siteConfig.name} - Complete Content Directory

${siteConfig.description}

This file contains full summaries of all ${sorted.length} articles on TechVeb.

${sections.join("\n")}

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
