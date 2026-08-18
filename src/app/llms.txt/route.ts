import { getAllPostsFromAllDirs } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = getAllPostsFromAllDirs();
  const sorted = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const blogPosts = sorted.filter((p) => p.category !== "product-reviews" && !["ai"].includes(p.category)).slice(0, 10);
  const reviews = sorted.filter((p) => p.category === "product-reviews").slice(0, 5);
  const aiTools = sorted.filter((p) => p.category === "ai").slice(0, 5);

  const txt = `# ${siteConfig.name} - AI & Technology Blog

## About
${siteConfig.description}

## Content Sections
- /blog - Technology articles, guides, and news (${sorted.filter((p) => p.category !== "product-reviews" && !["ai"].includes(p.category)).length} articles)
- /reviews - Hardware and software reviews with detailed comparisons (${sorted.filter((p) => p.category === "product-reviews").length} reviews)
- /ai-tools - AI tool reviews, tutorials, and comparisons (${sorted.filter((p) => p.category === "ai").length} guides)

## Categories
- AI & Machine Learning
- Tech News
- Cloud Computing
- Cybersecurity
- Tutorials & Guides
- Gaming Tech
- Emerging Tech
- Product Reviews

## Latest Articles
${blogPosts.map((p) => `- ${p.title}`).join("\n")}

## Latest Reviews
${reviews.map((p) => `- ${p.title}`).join("\n")}

## Latest AI Tool Guides
${aiTools.map((p) => `- ${p.title}`).join("\n")}

## Contact
- Email: ${siteConfig.email}
- Location: ${siteConfig.address}

## API
No public API available. Content is available via RSS feed at /feed.xml.

## Updated
Content is updated regularly with ${sorted.length} total articles. Last build: ${new Date().toISOString().split("T")[0]}.`;

  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
