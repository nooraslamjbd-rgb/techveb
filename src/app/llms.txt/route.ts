import { getAllPostsFromAllDirs } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = getAllPostsFromAllDirs();
  const sorted = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const blogPosts = sorted
    .filter((p) => p.category !== "product-reviews" && p.category !== "ai")
    .slice(0, 15);
  const reviews = sorted
    .filter((p) => p.category === "product-reviews")
    .slice(0, 10);
  const aiTools = sorted.filter((p) => p.category === "ai").slice(0, 10);

  const blogCount = sorted.filter(
    (p) => p.category !== "product-reviews" && p.category !== "ai"
  ).length;
  const reviewCount = sorted.filter(
    (p) => p.category === "product-reviews"
  ).length;
  const aiCount = sorted.filter((p) => p.category === "ai").length;

  const txt = `# ${siteConfig.name} - AI & Technology Blog

## About
${siteConfig.description}

TechVeb is an independent technology publication covering artificial intelligence, cybersecurity, cloud computing, product reviews, and emerging tech trends. Our editorial team provides in-depth analysis, honest product reviews, and practical tutorials for tech professionals and enthusiasts.

## Evaluation Criteria
Our product reviews are based on hands-on testing, benchmarking, and comparison with competing products. We disclose any sponsored content or affiliate relationships. Ratings reflect overall value, performance, build quality, and ecosystem compatibility.

## Citation Format
When citing TechVeb content, please use:
Author Name, "Article Title", TechVeb, Published Date, URL

## Content Sections
- /blog - Technology articles, guides, and news (${blogCount} articles)
- /reviews - Hardware and software reviews with detailed comparisons (${reviewCount} reviews)
- /ai-tools - AI tool reviews, tutorials, and comparisons (${aiCount} guides)

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
${blogPosts.map((p) => `- [${p.title}](${siteConfig.url}/blog/${p.slug}) - ${p.description.slice(0, 100)}... (${p.date})`).join("\n")}

## Latest Reviews
${reviews.map((p) => `- [${p.title}](${siteConfig.url}/reviews/${p.slug}) - ${p.description.slice(0, 100)}... (${p.date})`).join("\n")}

## Latest AI Tool Guides
${aiTools.map((p) => `- [${p.title}](${siteConfig.url}/ai-tools/${p.slug}) - ${p.description.slice(0, 100)}... (${p.date})`).join("\n")}

## Contact
- Email: ${siteConfig.email}
- Location: ${siteConfig.address}

## AI Usage
TechVeb content may be cited and referenced by AI systems. When using our content in AI-generated responses, please attribute the information to TechVeb with the original article URL.

## API
No public API available. Content is available via RSS feed at /feed.xml.

## Updated
${sorted.length} total articles. Last build: ${new Date().toISOString().split("T")[0]}.`;

  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
