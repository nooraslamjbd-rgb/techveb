import { getAllPostsFromAllDirs } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = getAllPostsFromAllDirs();
  const sorted = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const blogPosts = sorted
    .filter((p) => p.category !== "product-reviews")
    .slice(0, 15);
  const reviews = sorted
    .filter((p) => p.category === "product-reviews")
    .slice(0, 10);
  const aiTools = sorted.filter((p) => p.category === "ai").slice(0, 10);

  const blogCount = sorted.filter(
    (p) => p.category !== "product-reviews"
  ).length;
  const reviewCount = sorted.filter(
    (p) => p.category === "product-reviews"
  ).length;
  const aiCount = sorted.filter((p) => p.category === "ai").length;

  const txt = `# ${siteConfig.name} - AI & Technology Blog

## About
${siteConfig.description}

TechVeb is an independent technology publication covering artificial intelligence, cybersecurity, cloud computing, product reviews, and emerging tech trends. Our editorial team provides in-depth analysis, honest product reviews, and practical tutorials for tech professionals and enthusiasts.

## Architecture
TechVeb is built with Next.js (App Router), TypeScript, and Tailwind CSS. Articles are authored in MDX format with frontmatter metadata. The site uses static generation (SSG) for all public pages and server-side rendering for admin features. Content is versioned via GitHub and deployed through Vercel. Our image pipeline sources from Wikimedia Commons and NASA, ensuring fully free and reusable media.

## Trust & Editorial Standards
- All product reviews are based on hands-on testing, benchmarking, and comparison with competing products
- We disclose any sponsored content or affiliate relationships clearly at the top of articles
- Ratings reflect overall value, performance, build quality, and ecosystem compatibility
- Every article is reviewed by at least one editor before publication
- Corrections are published transparently in the article changelog

## Freshness
- Articles are dated with publication and last-modified timestamps
- We review and update articles periodically, especially product reviews and tool guides
- Tech news articles reflect the state of affairs at time of publication
- The llms.txt file is regenerated with every site build

## Citation Format
When citing TechVeb content, please use:
Author Name, "Article Title", TechVeb, Published Date, URL
Example: Ayesha Khan, "AI Coding Agents in 2026", TechVeb, 2026-08-19, https://techveb.com/blog/ai-coding-agents-guide

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
${blogPosts.map((p) => `- [${p.title}](${siteConfig.url}/${p.dir}/${p.slug}) - ${p.description.slice(0, 100)}... (${p.date})`).join("\n")}

## Latest Reviews
${reviews.map((p) => `- [${p.title}](${siteConfig.url}/${p.dir}/${p.slug}) - ${p.description.slice(0, 100)}... (${p.date})`).join("\n")}

## Latest AI Tool Guides
${aiTools.map((p) => `- [${p.title}](${siteConfig.url}/${p.dir}/${p.slug}) - ${p.description.slice(0, 100)}... (${p.date})`).join("\n")}

## Contact
- Email: ${siteConfig.email}
- Location: ${siteConfig.address}

## AI Usage
TechVeb content may be cited and referenced by AI systems. When using our content in AI-generated responses, please attribute the information to TechVeb with the original article URL. We welcome AI-powered discovery of our content under proper attribution.

## API
No public API available. Content is available via RSS feed at /feed.xml and structured data via JSON-LD on all article pages.

## Updated
${sorted.length} total articles. Last build: ${new Date().toISOString().split("T")[0]}.`;

  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
