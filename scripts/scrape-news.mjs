#!/usr/bin/env node

/**
 * News Scraper - Fetches RSS feeds and creates local MDX articles
 * Usage: node scripts/scrape-news.mjs
 * 
 * Creates MDX files in src/content/news/ with:
 * - Frontmatter: title, description, date, source, link, category, image, tags
 * - Content body: summary + attribution to original source
 * 
 * Images are sourced from our Wikimedia Commons pool (matched by topic).
 * Only titles and summaries are used (fair use with attribution).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "news");
const IMAGE_POOL_PATH = path.join(__dirname, ".wikimedia-images.json");

const RSS_SOURCES = [
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "tech-news", topic: "tech" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "tech-news", topic: "tech" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", category: "tech-news", topic: "tech" },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", category: "ai", topic: "ai" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", category: "tech-news", topic: "tech" },
  { name: "BBC Technology", url: "http://feeds.bbci.co.uk/news/technology/rss.xml", category: "tech-news", topic: "tech" },
];

const MAX_ARTICLES_PER_SOURCE = 10;
const MAX_AGE_DAYS = 7;

// Topic to image category mapping
const TOPIC_IMAGES = {
  tech: ["tech", "internet", "computer", "smartphone", "software"],
  ai: ["artificial-intelligence", "machine-learning", "robot", "neural"],
  business: ["business", "finance", "stock", "startup"],
  sports: ["cricket", "football", "sports"],
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadImagePool() {
  try {
    return JSON.parse(fs.readFileSync(IMAGE_POOL_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function getImageForTopic(topic, usedImages) {
  const pool = loadImagePool();
  const categories = TOPIC_IMAGES[topic] || TOPIC_IMAGES.tech;

  for (const cat of categories) {
    const images = pool[cat];
    if (!images || images.length === 0) continue;
    for (const img of images) {
      const url = typeof img === "string" ? img : img.url;
      if (!usedImages.has(url)) {
        usedImages.add(url);
        return url;
      }
    }
  }
  // Fallback: any image from pool
  for (const cat of Object.keys(pool)) {
    const images = pool[cat];
    if (!images || images.length === 0) continue;
    for (const img of images) {
      const url = typeof img === "string" ? img : img.url;
      if (!usedImages.has(url)) {
        usedImages.add(url);
        return url;
      }
    }
  }
  return undefined;
}

function extractTag(xml, tag) {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractLink(xml) {
  const atomLink = xml.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (atomLink) return atomLink[1];
  const regularLink = xml.match(/<link[^>]*>([^<]+)<\/link>/i);
  return regularLink ? regularLink[1].trim() : "";
}

function extractImage(xml) {
  const mediaMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  const encMatch = xml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (encMatch) return encMatch[1];
  const imgMatch = xml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  return undefined;
}

function cleanHTML(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function extractTags(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const keywords = [
    "ai", "artificial intelligence", "machine learning", "cloud", "aws", "azure", "google cloud",
    "cybersecurity", "hack", "breach", "encryption", "startup", "funding", "apple", "google",
    "microsoft", "openai", "chatgpt", "nvidia", "chip", "quantum", "blockchain", "crypto",
    "5g", "6g", "robot", "autonomous", "ev", "electric", "spacex", "nasa", "apple", "iphone",
    "android", "windows", "linux", "meta", "facebook", "twitter", "x", "tiktok",
  ];
  const found = keywords.filter((kw) => text.includes(kw));
  return found.length > 0 ? found.slice(0, 5) : ["tech-news"];
}

function parseItems(xml, source) {
  const items = [];
  const itemMatches =
    xml.match(/<item[\s\S]*?<\/item>/gi) ||
    xml.match(/<entry[\s\S]*?<\/entry>/gi) ||
    [];

  for (const item of itemMatches.slice(0, MAX_ARTICLES_PER_SOURCE)) {
    const title = cleanHTML(extractTag(item, "title"));
    const link = extractTag(item, "link") || extractLink(item);
    const description = cleanHTML(
      extractTag(item, "description") || extractTag(item, "summary") || extractTag(item, "content")
    );
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "published") || extractTag(item, "updated");
    const rssImage = extractImage(item);

    if (title && link) {
      items.push({
        title,
        link,
        description: description.substring(0, 300),
        pubDate: pubDate || new Date().toISOString(),
        source: source.name,
        category: source.category,
        topic: source.topic,
        rssImage,
        tags: extractTags(title, description),
      });
    }
  }
  return items;
}

async function fetchFeed(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { "User-Agent": "TechVeb News Aggregator/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseItems(xml, source);
  } catch (e) {
    console.warn(`  Failed to fetch ${source.name}: ${e.message}`);
    return [];
  }
}

function createMDX(item, image) {
  const date = new Date(item.pubDate);
  const dateStr = date.toISOString().split("T")[0];
  const fm = [
    "---",
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `description: "${item.description.replace(/"/g, '\\"').substring(0, 160)}"`,
    `date: "${dateStr}"`,
    `author: "TechVeb News"`,
    `category: "${item.category}"`,
    `tags: [${item.tags.map((t) => `"${t}"`).join(", ")}]`,
    image ? `image: "${image}"` : null,
    `imageCredit: "${item.source}"`,
    `source: "${item.source}"`,
    `sourceLink: "${item.link}"`,
    "featured: false",
    `readingTime: "1 min read"`,
    "---",
    "",
    `> **Source:** This article is based on reporting by [${item.source}](${item.link}). Read the [full article on ${item.source}](${item.link}) for complete details.`,
    "",
    item.description,
    "",
    "---",
    "",
    `*Published on ${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} • Originally reported by ${item.source}*`,
  ].filter(Boolean).join("\n");

  return fm;
}

async function main() {
  console.log("=== TechVeb News Scraper ===\n");
  ensureDir(CONTENT_DIR);

  // Load existing articles to avoid duplicates
  const existingFiles = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const existingTitles = new Set(
    existingFiles.map((f) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
      const match = raw.match(/title:\s*"([^"]+)"/);
      return match ? match[1].toLowerCase() : f.replace(".mdx", "");
    })
  );
  console.log(`Found ${existingTitles.size} existing articles\n`);

  const usedImages = new Set();
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const source of RSS_SOURCES) {
    console.log(`Fetching ${source.name}...`);
    const items = await fetchFeed(source);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);

    let created = 0;
    for (const item of items) {
      // Skip old articles
      if (new Date(item.pubDate) < cutoff) continue;

      // Skip duplicates
      const slug = slugify(item.title);
      if (existingTitles.has(item.title.toLowerCase()) || existingTitles.has(slug)) {
        totalSkipped++;
        continue;
      }

      // Get an image
      const image = getImageForTopic(item.topic, usedImages) || item.rssImage;

      // Create MDX file
      const mdx = createMDX(item, image);
      const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
      fs.writeFileSync(filePath, mdx, "utf-8");
      existingTitles.add(item.title.toLowerCase());
      existingTitles.add(slug);
      created++;
      totalCreated++;
    }
    console.log(`  Created ${created} articles (${items.length} total, ${items.length - created} skipped)`);
  }

  console.log(`\n=== Done ===`);
  console.log(`Created: ${totalCreated} new articles`);
  console.log(`Skipped: ${totalSkipped} duplicates`);
  console.log(`Total news articles: ${existingTitles.size}`);
}

main().catch(console.error);
