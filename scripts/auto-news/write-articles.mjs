import fs from "fs";
import path from "path";
import { CONFIG } from "./config.mjs";

function generateMDX(article, imagePath) {
  const enhanced = article.enhanced;
  const d = new Date(article.pubDate);
  const dateStr = d.toISOString().split("T")[0];

  const wordCount = (enhanced.content || "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const lines = [
    "---",
    `title: "${(enhanced.title || article.title).replace(/"/g, '\\"')}"`,
    `description: "${(enhanced.description || article.description).replace(/"/g, '\\"').substring(0, 160)}"`,
    `date: "${dateStr}"`,
    `author: "${CONFIG.AUTHOR}"`,
    `category: "${enhanced.category || article.category}"`,
    `tags: [${(enhanced.tags || article.tags).map(t => `"${t}"`).join(", ")}]`,
    `language: "${article.language}"`,
  ];

  if (imagePath) {
    lines.push(`image: "${imagePath}"`);
  }

  lines.push(
    `source: "${article.source}"`,
    `sourceLink: "${article.link}"`,
    "featured: false",
    `readingTime: "${readTime} min read"`,
    "views: 0",
  );

  // FAQ frontmatter (for structured data)
  if (enhanced.faq && enhanced.faq.length > 0) {
    lines.push("faq:");
    for (const item of enhanced.faq) {
      const q = (item.q || "").replace(/"/g, '\\"');
      const a = (item.a || "").replace(/"/g, '\\"');
      lines.push(`  - question: "${q}"`);
      lines.push(`    answer: "${a}"`);
    }
  }

  // Key Takeaways frontmatter
  if (enhanced.keyTakeaways && enhanced.keyTakeaways.length > 0) {
    lines.push("keyTakeaways:");
    for (const kt of enhanced.keyTakeaways) {
      lines.push(`  - "${(kt || "").replace(/"/g, '\\"')}"`);
    }
  }

  lines.push("---", "");

  // Key Takeaways section (GEO optimized)
  if (enhanced.keyTakeaways && enhanced.keyTakeaways.length > 0) {
    lines.push("## Key Takeaways", "");
    for (const kt of enhanced.keyTakeaways) {
      lines.push(`- ${kt}`);
    }
    lines.push("");
  }

  // Main enhanced content
  if (enhanced.content) {
    lines.push(enhanced.content, "");
  } else {
    lines.push(article.description, "");
  }

  // FAQ section (AEO optimized)
  if (enhanced.faq && enhanced.faq.length > 0) {
    lines.push("## Frequently Asked Questions", "");
    for (const item of enhanced.faq) {
      lines.push(`### ${item.q}`, "");
      lines.push(item.a, "");
    }
  }

  // Attribution
  lines.push("---", "");
  lines.push(`*Originally reported by [${article.source}](${article.link}). Enhanced and optimized for search by TechVeb.*`);
  lines.push("");

  return lines.join("\n");
}

export function writeArticles(articles, imagePaths) {
  console.log(`[WRITE] Writing ${articles.length} MDX files...`);
  fs.mkdirSync(CONFIG.CONTENT_DIR, { recursive: true });

  let written = 0;
  for (const article of articles) {
    const slug = article.enhanced?.slug || article.slug;
    const filePath = path.join(CONFIG.CONTENT_DIR, `${slug}.mdx`);

    // Don't overwrite existing
    if (fs.existsSync(filePath)) {
      console.log(`  SKIP: ${slug} (exists)`);
      continue;
    }

    const imagePath = imagePaths[article.slug] || null;
    const mdx = generateMDX(article, imagePath);

    fs.writeFileSync(filePath, mdx, "utf-8");
    console.log(`  WROTE: ${slug}`);
    written++;
  }

  console.log(`[WRITE] Done. ${written} new files written.`);
  return written;
}
