#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "news");
const IMAGE_POOL_PATH = path.join(__dirname, ".wikimedia-images.json");

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

turndown.addRule("removeScripts", {
  filter: ["script", "style", "nav", "footer", "aside", "iframe", "form"],
  replacement: () => "",
});

const RSS_SOURCES = [
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "tech-news", language: "en", topicMatch: ["tech-news","hardware","laptops","smartphones"] },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "tech-news", language: "en", topicMatch: ["tech-news","hardware","smartphones"] },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", category: "tech-news", language: "en", topicMatch: ["tech-news","hardware","data_centers"] },
  { name: "Wired", url: "https://www.wired.com/feed/rss", category: "tech-news", language: "en", topicMatch: ["tech-news","privacy","IoT"] },
  { name: "BBC Technology", url: "https://feeds.bbci.co.uk/news/technology/rss.xml", category: "tech-news", language: "en", topicMatch: ["tech-news"] },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", category: "ai", language: "en", topicMatch: ["AI","deep_learning","robotics"] },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "ai", language: "en", topicMatch: ["AI","deep_learning"] },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/", category: "cybersecurity", language: "en", topicMatch: ["cybersecurity","privacy"] },
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", category: "cybersecurity", language: "en", topicMatch: ["cybersecurity","privacy"] },
  { name: "SDxCentral", url: "https://sdxcentral.com/feed/", category: "cloud", language: "en", topicMatch: ["cloud","data_centers","DevOps"] },
  { name: "IGN Games", url: "https://feeds.feedburner.com/ign/all", category: "gaming", language: "en", topicMatch: ["gaming","hardware"] },
  { name: "GSMArena", url: "https://www.gsmarena.com/rss-news-reviews.php3", category: "mobiles", language: "en", topicMatch: ["smartphones","hardware"] },
  { name: "PhoneArena", url: "https://www.phonearena.com/rss/news", category: "mobiles", language: "en", topicMatch: ["smartphones"] },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "business", language: "en", topicMatch: ["blockchain"] },
  { name: "TechCrunch Business", url: "https://techcrunch.com/category/venture/feed/", category: "business", language: "en", topicMatch: ["tech-news"] },
  { name: "ESPN Cricinfo", url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml", category: "sports", language: "en", topicMatch: ["tech-news"] },
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml", category: "sports", language: "en", topicMatch: ["tech-news"] },
  { name: "EdTech Magazine", url: "https://edtechmagazine.com/rss.xml", category: "education", language: "en", topicMatch: ["tech-news","laptops"] },
  { name: "Express News Urdu", url: "https://www.express.pk/feed/", category: "tech-news", language: "ur", topicMatch: ["tech-news","business","sports"] },
  { name: "ARY News Urdu", url: "https://urdu.arynews.tv/feed/", category: "tech-news", language: "ur", topicMatch: ["tech-news","business","sports"] },
  { name: "Dawn News", url: "https://www.dawn.com/feeds/home", category: "tech-news", language: "en", topicMatch: ["tech-news","business"] },
  { name: "BOL News Urdu", url: "https://www.bolnewsurdu.com/feed/", category: "tech-news", language: "ur", topicMatch: ["tech-news","business","sports"] },
];

const MAX_PER_SOURCE = 12;
const MAX_AGE_DAYS = 14;
const FETCH_DELAY_MS = 800;
const ARTICLE_TIMEOUT_MS = 12000;

const TITLE_KEYWORDS = {
  AI: ["ai","artificial intelligence","chatgpt","openai","machine learning","deep learning","neural","llm","gpt","copilot","gemini","claude"],
  cybersecurity: ["hack","breach","cyber","security","malware","ransomware","phishing","encryption","vulnerability","zero-day"],
  cloud: ["cloud","aws","azure","google cloud","saas","serverless","kubernetes","docker"],
  smartphones: ["iphone","android","samsung","pixel","phone","mobile","smartphone","galaxy"],
  gaming: ["game","gaming","playstation","xbox","nintendo","esports","gamer"],
  blockchain: ["crypto","bitcoin","ethereum","blockchain","defi","nft","web3","token"],
  hardware: ["chip","processor","gpu","nvidia","amd","intel","semiconductor"],
  robotics: ["robot","autonomous","drone","self-driving","waymo","tesla"],
  privacy: ["privacy","data","surveillance","tracking","gdpr"],
  "space-tech": ["space","spacex","nasa","rocket","satellite"],
  programming: ["code","developer","programming","python","javascript","api"],
  IoT: ["iot","sensor","smart home","connected"],
};

let imagePool = [];
function loadImagePool() {
  try {
    const raw = JSON.parse(fs.readFileSync(IMAGE_POOL_PATH, "utf-8"));
    imagePool = raw.images || [];
    console.log(`  Loaded ${imagePool.length} pool images`);
  } catch { imagePool = []; }
}

function getBestPoolImage(title, desc, usedUrls) {
  const text = `${title} ${desc}`.toLowerCase();
  let bestTopic = "tech-news";
  let bestScore = 0;
  for (const [topic, keywords] of Object.entries(TITLE_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) { if (text.includes(kw)) score += 2; }
    if (score > bestScore) { bestScore = score; bestTopic = topic; }
  }
  let imgs = imagePool.filter(i => i.topic === bestTopic && !usedUrls.has(i.url));
  if (imgs.length === 0) imgs = imagePool.filter(i => !usedUrls.has(i.url));
  if (imgs.length === 0) return null;
  const img = imgs[Math.floor(Math.random() * imgs.length)];
  usedUrls.add(img.url);
  return { url: img.url.replace(/[?&]utm_[^&]*/g, "").replace(/\?$/, ""), credit: img.credit || "", creditUrl: img.creditUrl || "", source: "wikimedia" };
}

function decodeEntities(s) {
  const named = { "&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&apos;":"'","&nbsp;":" ","&mdash;":"—","&ndash;":"–","&hellip;":"…","&lsquo;":"'","&rsquo;":"'","&ldquo;":'\u201C',"&rdquo;":'\u201D' };
  let r = s;
  for (const [e, c] of Object.entries(named)) r = r.replaceAll(e, c);
  r = r.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  r = r.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  return r;
}

function cleanHTML(html) {
  return decodeEntities(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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
  const m = xml.match(/<media:content[^>]*url="([^"]+)"/i)
    || xml.match(/<media:thumbnail[^>]*url="([^"]+)"/i)
    || xml.match(/<enclosure[^>]*url="([^"]+)"/i)
    || xml.match(/<img[^>]*src="([^"]+)"/i);
  return m ? m[1] : undefined;
}

function slugify(t) {
  return t.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function isFuzzyDup(t1, t2) {
  const w1 = new Set(t1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const w2 = new Set(t2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (w1.size === 0 || w2.size === 0) return false;
  let o = 0;
  for (const w of w1) { if (w2.has(w)) o++; }
  return o / Math.min(w1.size, w2.size) > 0.7;
}

function extractTags(title, desc, cat) {
  const text = `${title} ${desc}`.toLowerCase();
  const kw = ["ai","cloud","cybersecurity","hack","startup","funding","apple","google","microsoft","openai","nvidia","quantum","blockchain","crypto","robot","spacex","iphone","android","gaming","security","malware","data","privacy","climate","energy","automotive","ev"];
  const found = kw.filter(k => {
    const re = new RegExp(`\\b${k}\\b`, "i");
    return re.test(text);
  }).slice(0, 5);
  if (found.length === 0) found.push(cat);
  return found;
}

function parseItems(xml, source) {
  const items = [];
  const matches = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const item of matches.slice(0, MAX_PER_SOURCE)) {
    const title = cleanHTML(extractTag(item, "title"));
    const link = extractTag(item, "link") || extractLink(item);
    const desc = cleanHTML(extractTag(item, "description") || extractTag(item, "summary") || extractTag(item, "content"));
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "published") || extractTag(item, "updated");
    const rssImage = extractImage(item);
    if (!title || !link || title.length < 10) continue;
    let cleanDesc = desc;
    if (cleanDesc.length > 500) {
      const dot = cleanDesc.substring(0, 500).lastIndexOf(".");
      cleanDesc = dot > 100 ? cleanDesc.substring(0, dot + 1) : cleanDesc.substring(0, 497) + "...";
    }
    items.push({
      title: title.replace(/[\u201c\u201d]/g, '"'),
      link,
      description: cleanDesc,
      pubDate: pubDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
      language: source.language || "en",
      rssImage,
      tags: extractTags(title, cleanDesc, source.category),
    });
  }
  return items;
}

async function fetchWithTimeout(url, timeoutMs = ARTICLE_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ur;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    return res;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
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
    return {
      text,
      html: article.content || "",
      markdown: md,
      title: article.title || "",
      length: text.length,
    };
  } catch {
    return null;
  }
}

function extractArticleImages(html, baseUrl) {
  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();

  $("img").each((_, el) => {
    let src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src") || "";
    if (!src || seen.has(src)) return;

    const width = parseInt($(el).attr("width") || "0", 10);
    const height = parseInt($(el).attr("height") || "0", 10);

    if (width > 0 && width < 100) return;
    if (height > 0 && height < 100) return;

    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) {
      try { src = new URL(src, baseUrl).href; } catch { return; }
    } else if (!src.startsWith("http")) {
      try { src = new URL(src, baseUrl).href; } catch { return; }
    }

    if (/logo|icon|avatar|badge|sprite|pixel|tracking|spacer|blank/i.test(src)) return;
    if (/\.(svg|gif)$/i.test(src)) return;

    src = src.split("?")[0];

    const srcset = $(el).attr("srcset") || $(el).attr("data-srcset") || "";
    let bestSrc = src;
    if (srcset) {
      const candidates = srcset.split(",").map(s => {
        const parts = s.trim().split(/\s+/);
        const url = parts[0];
        const w = parseInt(parts[1] || "0", 10);
        return { url, w };
      }).filter(c => c.url && c.w > 0);
      if (candidates.length > 0) {
        candidates.sort((a, b) => b.w - a.w);
        bestSrc = candidates[0].url.split("?")[0];
      }
    }

    seen.add(src);
    images.push({
      src: bestSrc,
      width,
      height,
      alt: $(el).attr("alt") || "",
      score: width * height || 400 * 300,
    });
  });

  $("meta[property='og:image']").each((_, el) => {
    const content = $(el).attr("content");
    if (content && !seen.has(content)) {
      seen.add(content);
      images.unshift({ src: content.split("?")[0], width: 1200, height: 630, alt: "", score: 999999 });
    }
  });

  images.sort((a, b) => b.score - a.score);
  return images;
}

function scoreImageForArticle(imgUrl, title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  const urlLower = imgUrl.toLowerCase();
  let score = 0;

  for (const [topic, keywords] of Object.entries(TITLE_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw) && urlLower.includes(kw)) score += 10;
    }
  }

  if (/wp-content|uploads|images\/\d{4}|cdn\.|media\./i.test(urlLower)) score += 3;
  if (/featured|hero|banner|og-image|social/i.test(urlLower)) score += 5;
  if (/\d{3,4}x\d{3,4}|\/s\d{3,4}\//.test(urlLower)) score += 2;
  if (/gravatar|avatar|profile|author|byline/i.test(urlLower)) score -= 20;
  if (/logo|icon|badge/i.test(urlLower)) score -= 15;
  if (/ad[-_]?banner|sponsor|promo/i.test(urlLower)) score -= 25;

  return score;
}

function selectBestImage(articleImages, rssImage, title, desc, usedUrls) {
  let bestImg = null;
  let bestScore = -1;

  for (const img of articleImages) {
    if (usedUrls.has(img.src)) continue;
    const score = scoreImageForArticle(img.src, title, desc);
    const totalScore = score + (img.score > 100000 ? 500 : img.score > 10000 ? 100 : 0);
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestImg = img;
    }
  }

  if (bestImg && bestScore > 0) {
    usedUrls.add(bestImg.src);
    return {
      url: bestImg.src,
      credit: "",
      creditUrl: "",
      alt: bestImg.alt || title,
      source: "article",
    };
  }

  if (rssImage && !usedUrls.has(rssImage)) {
    usedUrls.add(rssImage);
    return { url: rssImage, credit: "", creditUrl: "", alt: title, source: "rss" };
  }

  return getBestPoolImage(title, desc, usedUrls);
}

function splitSentences(text) {
  return text.match(/[^.!?]+(?:\.[0-9]+|.!?)+/g) || [];
}

function extractKeyPoints(text, maxPoints = 5) {
  const sentences = splitSentences(text);
  const scored = sentences.map(s => {
    let score = 0;
    const lower = s.toLowerCase().trim();
    if (/^\d/.test(lower)) score += 3;
    if (/\$[\d,.]+|million|billion|percent|%/i.test(s)) score += 4;
    if (/"[^"]+"/.test(s)) score += 3;
    if (/(announced|launched|released|unveiled|confirmed|reported|according|said|stated)/i.test(s)) score += 2;
    if (lower.length > 50 && lower.length < 250) score += 1;
    if (/first|new|big|major|largest|fastest|biggest/i.test(s)) score += 2;
    return { text: s.trim(), score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxPoints).map(s => s.text);
}

function cleanArticleContent(text) {
  const junkPatterns = [
    /\bThese are the best offers from our affiliate partners.*$/i,
    /\bWe may get a commission.*$/i,
    /\bWhen you purchase through links in our articles.*$/i,
    /\bThis doesn'?t affect our editorial independence.*$/i,
    /\bFollow us on (Google News|Twitter|LinkedIn|Facebook).*$/i,
    /\bSubscribe to our (newsletter|RSS|feed).*$/i,
    /\bSign up for our .* newsletter.*$/i,
    /\btag=gsm-[a-z0-9]+/gi,
    /\baffiliate[=\s].*$/i,
    /\bRead more on .*/i,
    /\bCatch all the (Latest|Tech|Technology) .* at .*/i,
    /\bStay tuned for .*/i,
    /\bWant more news\?.*$/i,
    /\bDisclosure:.*$/i,
    /\bEditor.?s? note:.*$/i,
    /\b(Updated|Published|Correction)[\s:]*/i,
    /\b[A-Z][a-z]+ [A-Z][a-z]+(Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul) \d{1,2},? \d{4}/,
  ];
  let cleaned = text;
  for (const pat of junkPatterns) {
    cleaned = cleaned.replace(pat, "");
  }
  return cleaned.replace(/\s{2,}/g, " ").trim();
}

function generateRichMDX(item, readableContent) {
  const d = new Date(item.pubDate);
  const ds = d.toISOString().split("T")[0];

  const paragraphs = [];
  if (readableContent) {
    const cleanedText = cleanArticleContent(readableContent.text);
    const sents = splitSentences(cleanedText);
    let wordCount = 0;
    for (const s of sents) {
      const words = s.split(/\s+/).length;
      if (wordCount + words > 400) break;
      paragraphs.push(s.trim());
      wordCount += words;
    }
  }

  if (paragraphs.length < 2 && item.description) {
    paragraphs.unshift(item.description);
  }

  const keyPoints = readableContent
    ? extractKeyPoints(readableContent.text, 5)
    : [];

  let bodyMd = "";

  if (keyPoints.length >= 2) {
    bodyMd += "## Key Highlights\n\n";
    for (const point of keyPoints) {
      bodyMd += `- ${point}\n`;
    }
    bodyMd += "\n";
  }

  const mainParagraphs = paragraphs.slice(0, Math.max(6, paragraphs.length));
  for (const p of mainParagraphs) {
    bodyMd += `${p}\n\n`;
  }

  if (readableContent && readableContent.markdown) {
    const cleanedMd = cleanArticleContent(readableContent.markdown);
    const mdParagraphs = cleanedMd.split(/\n\n+/).filter(p => {
      const trimmed = p.trim();
      if (!trimmed) return false;
      if (trimmed.startsWith("#")) return false;
      if (trimmed.startsWith(">")) return false;
      if (trimmed.startsWith("-") && trimmed.split("\n").length < 2) return false;
      if (trimmed.length < 40) return false;
      const alreadyIncluded = paragraphs.some(ex => {
        const exWords = new Set(ex.split(/\s+/).filter(w => w.length > 4));
        const mdWords = new Set(trimmed.split(/\s+/).filter(w => w.length > 4));
        let overlap = 0;
        for (const w of exWords) { if (mdWords.has(w)) overlap++; }
        return overlap / Math.min(exWords.size || 1, mdWords.size || 1) > 0.6;
      });
      return !alreadyIncluded;
    });

    const existingWordCount = mainParagraphs.join(" ").split(/\s+/).length;
    let extraCount = 0;
    for (const p of mdParagraphs) {
      if (existingWordCount + extraCount > 450) break;
      const words = p.split(/\s+/).length;
      bodyMd += `${p}\n\n`;
      extraCount += words;
    }
  }

  const wordCount = bodyMd.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return { bodyMd: bodyMd.trim(), wordCount, readTime };
}

function createMDX(item, content, heroImage) {
  const d = new Date(item.pubDate);
  const ds = d.toISOString().split("T")[0];

  const lines = [
    "---",
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `description: "${item.description.replace(/"/g, '\\"').substring(0, 160)}"`,
    `date: "${ds}"`,
    `author: "TechVeb News"`,
    `category: "${item.category}"`,
    `tags: [${item.tags.map(t => `"${t}"`).join(", ")}]`,
  ];

  if (heroImage) {
    lines.push(`image: "${heroImage.url}"`);
    if (heroImage.credit) lines.push(`imageCredit: "${heroImage.credit.replace(/"/g, '\\"')}"`);
    if (heroImage.creditUrl) lines.push(`imageCreditUrl: "${heroImage.creditUrl}"`);
  }

  lines.push(
    `language: "${item.language || "en"}"`,
    `source: "${item.source}"`,
    `sourceLink: "${item.link}"`,
    "featured: false",
    `readingTime: "${content.readTime} min read"`,
    "---",
    "",
  );

  if (content.bodyMd) {
    lines.push(content.bodyMd, "");
  } else {
    lines.push(
      item.description,
      "",
    );
  }

  lines.push("---", "");
  lines.push(`*Originally reported by [${item.source}](${item.link}). TechVeb news desk.*`);

  return lines.filter(Boolean).join("\n");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchFeed(source) {
  try {
    const res = await fetchWithTimeout(source.url, 15000);
    if (!res.ok) { console.warn(`  ${source.name}: HTTP ${res.status}`); return []; }
    const text = await res.text();
    return parseItems(text, source);
  } catch (e) { console.warn(`  ${source.name}: ${e.message}`); return []; }
}

async function main() {
  console.log("=== TechVeb News Scraper v3 (Full Content) ===\n");
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  loadImagePool();

  const existing = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));
  const existingTitles = [];
  const existingSlugs = new Set();
  for (const f of existing) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
    const m = raw.match(/title:\s*"([^"]+)"/);
    if (m) existingTitles.push(m[1].toLowerCase());
    existingSlugs.add(f.replace(".mdx", ""));
  }
  console.log(`Found ${existingTitles.length} existing articles\n`);

  const usedUrls = new Set();
  let created = 0, skipped = 0, fetched = 0, fetchFailed = 0;

  for (const source of RSS_SOURCES) {
    console.log(`\n[FETCHING] ${source.name} (${source.category})...`);
    const items = await fetchFeed(source);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);
    let srcCreated = 0;

    for (const item of items) {
      if (new Date(item.pubDate) < cutoff) continue;
      if (existingTitles.some(t => isFuzzyDup(item.title, t))) { skipped++; continue; }

      const slug = slugify(item.title);
      if (!slug || existingSlugs.has(slug)) continue;

      process.stdout.write(`  [SCRAPING] ${item.title.substring(0, 60)}...`);

      let readableContent = null;
      let articleImages = [];

      try {
        const articleRes = await fetchWithTimeout(item.link, ARTICLE_TIMEOUT_MS);
        if (articleRes.ok) {
          const html = await articleRes.text();
          readableContent = extractReadableContent(html, item.link);
          articleImages = extractArticleImages(html, item.link);
          fetched++;
        } else {
          fetchFailed++;
        }
      } catch {
        fetchFailed++;
      }

      await sleep(FETCH_DELAY_MS);

      const heroImage = selectBestImage(articleImages, item.rssImage, item.title, item.description, usedUrls);

      const content = generateRichMDX(item, readableContent);

      const mdx = createMDX(item, content, heroImage);
      fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), mdx, "utf-8");
      existingTitles.push(item.title.toLowerCase());
      existingSlugs.add(slug);
      srcCreated++;
      created++;

      const contentLen = content.bodyMd.length;
      const imgSource = heroImage ? heroImage.source : "none";
      console.log(` [${contentLen} chars, ${content.readTime}min, img:${imgSource}]`);
    }
    console.log(`  => +${srcCreated} new from ${source.name}`);
  }

  console.log(`\n=== DONE ===`);
  console.log(`Created: ${created} | Skipped (dupes): ${skipped}`);
  console.log(`Article fetches: ${fetched} success, ${fetchFailed} failed`);
  console.log(`Total articles: ${created + existingTitles.length - created}`);
}

main().catch(console.error);
