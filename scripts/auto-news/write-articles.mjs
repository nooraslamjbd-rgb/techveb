import fs from "fs";
import path from "path";
import { CONFIG, BLOCKED_IMAGE_DOMAINS } from "./config.mjs";

function sanitizeContent(content) {
  if (!content) return content;
  let text = content;
  // Remove linked images e.g. [![alt](http...)](#) and [] (http...)
  text = text.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "");
  text = text.replace(/\[\]\(https?:\/\/[^\s)]+\)/g, "");
  // Remove markdown images whose source is external (http/https) or a data URI placeholder
  text = text.replace(/!\[[^\]]*\]\((https?:\/\/[^)\s]+|data:image\/[^)]*)\)/g, "");
  // Remove bare external image URLs on their own line
  text = text.replace(/^\s*https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp|gif)\s*\n?/gim, "");
  // Remove common orphan caption lines
  text = text.replace(/^\s*(Image source,.*|Image caption,?.*|Figure caption,?.*)\s*\n?/gim, "");
  // Strip raw CSS/style blocks injected by upstream scrapers (e.g. `body { margin:0; ... }`)
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/(?:body|html|\*|p|div|img|h[1-6])\s*\{[^}]*\}\s*/gi, "");
  text = text.replace(/@media[^\{]*\{[^}]*\}\s*/gi, "");
  // Remove scraped source-attribution & social-follow leftovers (EN + UR)
  text = text.replace(
    /^\*{0,2}\s*(?:Originally reported by[^\n]*|(?:ہمارے تھریڈ اکاؤنٹ کو فالو کریں|Follow our Threads account|Follow us on Threads|Subscribe to our (?:youtube|channel|telegram|whatsapp) channel?)[^\n]*)\n?/gim,
    ""
  );
  text = text.replace(/^\*{0,2}\s*(?:Also read|Also Read)[^\n]*\n?/gim, "");
  const lines = text.split("\n");
  const filtered = lines.filter((line) => {
    for (const domain of BLOCKED_IMAGE_DOMAINS) {
      if (line.includes(domain)) return false;
    }
    return true;
  });
  return filtered.join("\n").replace(/\n{3,}/g, "\n\n");
}

function fallbackDescription(content) {
  const plain = (content || "").replace(/[#>*_`~|=\-\[\]()!]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > 160 ? `${plain.slice(0, 157).trim()}…` : plain;
}

function dedupKey(title) {
  return (title || "").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
}

function generateMDX(article, imagePath) {
  const enhanced = article.enhanced;
  const d = new Date(article.pubDate);
  const dateStr = d.toISOString().split("T")[0];

  const wordCount = (enhanced.content || "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const safeTitle = (t) => (t || "").replace(/"/g, '\\"');
  const safeDesc = (enhanced.description || article.description || "").replace(/"/g, '\\"').trim().substring(0, 160);
  const description = (safeDesc.length > 15) ? safeDesc : fallbackDescription(enhanced.content || article.description).substring(0, 160);

  const lines = [
    "---",
    `title: "${safeTitle(enhanced.title || article.title)}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
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
      const safe = sanitizeContent(kt);
      if (safe.trim()) lines.push(`- ${safe.trim()}`);
    }
    lines.push("");
  }

  // Main enhanced content
  if (enhanced.content) {
    lines.push(sanitizeContent(enhanced.content), "");
  } else {
    lines.push(article.description, "");
  }

  // FAQ section (AEO optimized)
  if (enhanced.faq && enhanced.faq.length > 0) {
    lines.push("## Frequently Asked Questions", "");
    for (const item of enhanced.faq) {
      lines.push(`### ${item.q}`, "");
      lines.push(sanitizeContent(item.a), "");
    }
  }

  return lines.join("\n");
}

function loadExistingTitles() {
  const titles = new Set();
  if (!fs.existsSync(CONFIG.CONTENT_DIR)) return titles;
  for (const f of fs.readdirSync(CONFIG.CONTENT_DIR).filter((f) => f.endsWith(".mdx"))) {
    try {
      const raw = fs.readFileSync(path.join(CONFIG.CONTENT_DIR, f), "utf-8");
      const m = raw.match(/^title:\s*"([^"]+)"/m);
      if (m) titles.add(dedupKey(m[1]));
    } catch {}
  }
  return titles;
}

export function writeArticles(articles, imagePaths) {
  console.log(`[WRITE] Writing ${articles.length} MDX files...`);
  fs.mkdirSync(CONFIG.CONTENT_DIR, { recursive: true });

  const existingTitleKeys = loadExistingTitles();
  const batchKeys = new Set();
  let written = 0;
  let skipped = 0;
  for (const article of articles) {
    const slug = article.enhanced?.slug || article.slug;
    const filePath = path.join(CONFIG.CONTENT_DIR, `${slug}.mdx`);
    const title = (article.enhanced?.title || article.title || "").trim();

    // Guard: never write pure-numeric/junk slugs (unindexable + duplicate-prone)
    if (/^\d+(-\d+)*$/.test(slug)) {
      console.log(`  SKIP: ${slug} (numeric slug "${title.slice(0, 40)}")`);
      skipped++;
      continue;
    }

    // Don't overwrite existing
    if (fs.existsSync(filePath)) {
      console.log(`  SKIP: ${slug} (exists)`);
      skipped++;
      continue;
    }

    // Title-based dedupe (both in-repo and within this batch)
    const key = dedupKey(title);
    if (!key || existingTitleKeys.has(key) || batchKeys.has(key)) {
      console.log(`  SKIP: ${slug} (duplicate title "${title.slice(0, 50)}")`);
      skipped++;
      continue;
    }

    const imagePath = imagePaths[article.slug] || null;
    const mdx = generateMDX(article, imagePath);

    fs.writeFileSync(filePath, mdx, "utf-8");
    console.log(`  WROTE: ${slug}`);
    existingTitleKeys.add(key);
    batchKeys.add(key);
    written++;
  }

  console.log(`[WRITE] Done. ${written} new files written, ${skipped} skipped.`);
  return written;
}
