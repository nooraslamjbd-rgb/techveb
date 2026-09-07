import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { CONFIG, RSS_SOURCES, TITLE_KEYWORDS } from "./config.mjs";

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
turndown.addRule("removeJunk", { filter: ["script", "style", "nav", "footer", "aside", "iframe", "form"], replacement: () => "" });

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 80);
}

function cleanHTML(html) {
  let s = html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&hellip;/g, "…");
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  s = s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractTag(xml, tag) {
  const c = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
  if (c) return c[1].trim();
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1].trim() : "";
}

function extractLink(xml) {
  const a = xml.match(/<link[^>]*href="([^"]+)"/i);
  if (a) return a[1];
  const b = xml.match(/<link[^>]*>([^<]+)<\/link>/i);
  return b ? b[1].trim() : "";
}

function extractImage(xml) {
  const m = xml.match(/<media:content[^>]*url="([^"]+)"/i) || xml.match(/<media:thumbnail[^>]*url="([^"]+)"/i) || xml.match(/<enclosure[^>]*url="([^"]+)"/i) || xml.match(/<img[^>]*src="([^"]+)"/i);
  return m ? m[1] : null;
}

function isFuzzyDup(t1, t2) {
  const w1 = new Set(t1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const w2 = new Set(t2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (w1.size === 0 || w2.size === 0) return false;
  let o = 0;
  for (const w of w1) { if (w2.has(w)) o++; }
  return o / Math.min(w1.size, w2.size) > 0.6;
}

function extractTags(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  const found = [];
  for (const [cat, keywords] of Object.entries(TITLE_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) { found.push(cat); break; }
    }
  }
  if (found.length === 0) found.push("tech-news");
  return found.slice(0, 5);
}

function classifyCategory(title, desc, sourceCategory) {
  const text = `${title} ${desc}`.toLowerCase();
  const scores = {};
  for (const [cat, keywords] of Object.entries(TITLE_KEYWORDS)) {
    scores[cat] = 0;
    for (const kw of keywords) { if (text.includes(kw)) scores[cat]++; }
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (best[0][1] > 0) {
    const map = { AI: "ai", cybersecurity: "cybersecurity", cloud: "cloud", smartphones: "mobiles", gaming: "gaming", blockchain: "tech-news", hardware: "tech-news", robotics: "ai", privacy: "cybersecurity", "space-tech": "tech-news", sports: "sports", business: "business", entertainment: "entertainment", education: "education", automotive: "tech-news" };
    return map[best[0][0]] || sourceCategory;
  }
  return sourceCategory;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithTimeout(url, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ur;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    return res;
  } catch (e) { clearTimeout(t); throw e; }
}

function parseItems(xml, source) {
  const items = [];
  const matches = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const item of matches) {
    const title = cleanHTML(extractTag(item, "title"));
    const link = extractTag(item, "link") || extractLink(item);
    const desc = cleanHTML(extractTag(item, "description") || extractTag(item, "summary") || extractTag(item, "content"));
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "published") || extractTag(item, "updated");
    const rssImage = extractImage(item);
    if (!title || !link || title.length < 10) continue;
    let cleanDesc = desc.length > 500 ? desc.substring(0, desc.lastIndexOf(".", 500) > 100 ? desc.lastIndexOf(".", 500) + 1 : 497) + "..." : desc;
    items.push({
      title: title.replace(/[\u201c\u201d]/g, '"'),
      link,
      description: cleanDesc,
      pubDate: pubDate || new Date().toISOString(),
      source: source.name,
      language: source.language,
      rssImage,
      tags: extractTags(title, cleanDesc),
    });
  }
  return items;
}

async function fetchFeed(source) {
  try {
    const res = await fetchWithTimeout(source.url, CONFIG.RSS_TIMEOUT_MS);
    if (!res.ok) return [];
    const text = await res.text();
    return parseItems(text, source);
  } catch { return []; }
}

function pickLargestFromSrcset(srcset) {
  if (!srcset) return null;
  const candidates = srcset.split(",").map((part) => {
    const m = part.trim().match(/^(\S+)(?:\s+(\d+)w)?/);
    if (!m) return null;
    return { url: m[1], width: m[2] ? parseInt(m[2], 10) : 0 };
  }).filter(Boolean);
  candidates.sort((a, b) => b.width - a.width);
  return candidates[0] ? candidates[0].url : null;
}

function extractArticleImages(html, baseUrl) {
  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();

  const record = (raw, score) => {
    let src = raw;
    if (!src || seen.has(src)) return;
    if (src.startsWith("data:")) return;
    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) { try { src = new URL(src, baseUrl).href; } catch { return; } }
    else if (!src.startsWith("http")) { try { src = new URL(src, baseUrl).href; } catch { return; } }
    if (/logo|icon|avatar|badge|sprite|pixel|tracking|spacer|blank|placeholder|sprite/i.test(src)) return;
    if (/\.(svg|gif|ico)$/i.test(src)) return;
    if (/\/p\d+x\d+[.\/]|placeholder|preview-default|no-image|no_image|default-thumb|fallback|thumb_placeholder|p\dx\d\.(jpg|jpeg|png|webp)/i.test(src)) return;
    src = src.split("?")[0];
    seen.add(src);
    images.push({ src, score });
  };

  $("img").each((_, el) => {
    const el$ = $(el);
    const srcset = pickLargestFromSrcset(el$.attr("srcset")) || pickLargestFromSrcset(el$.attr("data-srcset"));
    const lazySrc = el$.attr("data-src") || el$.attr("data-lazy-src") || el$.attr("data-original") || el$.attr("data-image") || el$.attr("data-img") || "";
    const src = lazySrc || srcset || el$.attr("src") || "";
    if (!src) return;
    if (lazySrc) {
      // Lazily-loaded images carry the real URL; displayed width/height are just thumbnails.
      record(src, 999999);
      return;
    }
    const w = parseInt(el$.attr("width") || "0", 10);
    const h = parseInt(el$.attr("height") || "0", 10);
    if (w > 0 && w < 200) return;
    if (h > 0 && h < 200) return;
    record(src, w * h || (srcset ? 999999 : 400 * 300));
  });
  $("meta[property='og:image'], meta[property='og:image:secure_url']").each((_, el) => {
    const c = $(el).attr("content");
    if (c) record(c, 999999);
  });
  images.sort((a, b) => b.score - a.score);
  return images;
}

function extractReadableContent(html, url) {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article || !article.textContent) return null;
    let text = article.textContent.replace(/\s+/g, " ").trim();
    if (text.length < 100) return null;
    const md = turndown.turndown(article.content || "");
    return { text, html: article.content || "", markdown: md, length: text.length };
  } catch { return null; }
}

function getExistingSlugs() {
  if (!fs.existsSync(CONFIG.CONTENT_DIR)) return new Set();
  return new Set(fs.readdirSync(CONFIG.CONTENT_DIR).filter(f => f.endsWith(".mdx")).map(f => f.replace(".mdx", "")));
}

export async function fetchAllNews() {
  console.log("[FETCH] Fetching RSS feeds from all sources...");
  const existingSlugs = getExistingSlugs();
  const existingTitles = [];
  for (const f of fs.readdirSync(CONFIG.CONTENT_DIR).filter(f => f.endsWith(".mdx"))) {
    try {
      const raw = fs.readFileSync(path.join(CONFIG.CONTENT_DIR, f), "utf-8");
      const m = raw.match(/title:\s*"([^"]+)"/);
      if (m) existingTitles.push(m[1].toLowerCase());
    } catch {}
  }
  console.log(`  Existing articles: ${existingSlugs.size}`);

  const allItems = [];
  let totalFetched = 0;

  for (const source of RSS_SOURCES) {
    process.stdout.write(`  [${source.language.toUpperCase()}] ${source.name}...`);
    const items = await fetchFeed(source);
    console.log(` ${items.length} items`);

    for (const item of items) {
      if (existingTitles.some(t => isFuzzyDup(item.title, t))) continue;
      const slug = slugify(item.title);
      if (!slug || existingSlugs.has(slug)) continue;

      // Fetch full content
      let readableContent = null;
      let articleImages = [];
      try {
        const articleRes = await fetchWithTimeout(item.link, CONFIG.ARTICLE_TIMEOUT_MS);
        if (articleRes.ok) {
          const html = await articleRes.text();
          readableContent = extractReadableContent(html, item.link);
          articleImages = extractArticleImages(html, item.link);
          totalFetched++;
        }
      } catch {}

      const category = classifyCategory(item.title, item.description, source.defaultCategory);
      let imageUrl = null;
      if (articleImages.length > 0) imageUrl = articleImages[0].src;
      else if (item.rssImage) imageUrl = item.rssImage;

      allItems.push({
        ...item,
        slug,
        category,
        imageUrl,
        readableContent,
        articleImages,
      });

      existingSlugs.add(slug);
      existingTitles.push(item.title.toLowerCase());
      await sleep(CONFIG.FETCH_DELAY_MS);
    }
  }

  console.log(`\n[FETCH] Total new articles found: ${allItems.length}`);
  return allItems;
}

export async function fetchTrendingTopics() {
  console.log("[TRENDING] Checking Google Trends RSS...");
  try {
    const res = await fetchWithTimeout("https://trends.google.com/trending/rss?geo=PK", CONFIG.RSS_TIMEOUT_MS);
    if (!res.ok) { console.log("  Google Trends unavailable"); return []; }
    const xml = await res.text();
    const topics = [];
    const matches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    for (const item of matches.slice(0, 20)) {
      const title = cleanHTML(extractTag(item, "title"));
      if (title) topics.push(title.toLowerCase());
    }
    console.log(`  Found ${topics.length} trending topics`);
    return topics;
  } catch { console.log("  Trending check failed"); return []; }
}

export function selectTopArticles(allItems, trendingTopics, maxArticles = CONFIG.MAX_ARTICLES) {
  // Score each article
  for (const item of allItems) {
    let score = 0;
    const text = `${item.title} ${item.description}`.toLowerCase();

    // Trending match bonus
    for (const topic of trendingTopics) {
      const topicWords = topic.split(/\s+/).filter(w => w.length > 3);
      for (const word of topicWords) {
        if (text.includes(word)) score += 10;
      }
    }

    // Recency bonus (newer = higher)
    const age = Date.now() - new Date(item.pubDate).getTime();
    const hoursOld = age / (1000 * 60 * 60);
    if (hoursOld < 1) score += 20;
    else if (hoursOld < 6) score += 15;
    else if (hoursOld < 24) score += 10;
    else if (hoursOld < 48) score += 5;

    // Content quality bonus
    if (item.readableContent && item.readableContent.length > 200) score += 5;
    if (item.imageUrl) score += 3;

    item._score = score;
  }

  allItems.sort((a, b) => b._score - a._score);
  const selected = allItems.slice(0, maxArticles);

  // Balance languages: try to get at least 5 of each if available
  const urdu = selected.filter(i => i.language === "ur");
  const eng = selected.filter(i => i.language === "en");

  if (urdu.length > 8) {
    const excess = urdu.slice(8);
    const remaining = allItems.filter(i => i.language === "en" && !selected.includes(i));
    for (let i = 0; i < Math.min(excess.length, remaining.length) && selected.length < maxArticles; i++) {
      const idx = selected.indexOf(excess[i]);
      if (idx >= 0) selected.splice(idx, 1, remaining[i]);
    }
  }

  console.log(`[SELECT] Selected ${selected.length} articles (${selected.filter(i => i.language === "en").length} EN, ${selected.filter(i => i.language === "ur").length} UR)`);
  return selected;
}
