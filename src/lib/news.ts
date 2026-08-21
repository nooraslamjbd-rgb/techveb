// RSS Feed Parser for Live News
// Uses free RSS feeds from tech news sources

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  image?: string;
}

// RSS Feed Sources (all free, no API key needed)
const RSS_SOURCES = [
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "tech",
    icon: "📱",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "tech",
    icon: "⚡",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "tech",
    icon: "🔬",
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "ai",
    icon: "🤖",
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "tech",
    icon: "🔌",
  },
  {
    name: "BBC Technology",
    url: "http://feeds.bbci.co.uk/news/technology/rss.xml",
    category: "tech",
    icon: "📺",
  },
  {
    name: "Reuters Business",
    url: "https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best",
    category: "business",
    icon: "💰",
  },
  {
    name: "ESPN Cricinfo",
    url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
    category: "sports",
    icon: "🏏",
  },
];

// Simple XML parser (no external dependencies)
function parseXML(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  
  // Extract items from RSS/Atom feed
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || 
                       xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  
  for (const item of itemMatches.slice(0, 10)) {
    const title = extractTag(item, "title");
    const link = extractTag(item, "link") || extractLink(item);
    const description = extractTag(item, "description") || extractTag(item, "summary") || extractTag(item, "content");
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "published") || extractTag(item, "updated");
    const image = extractImage(item);
    
    if (title && link) {
      items.push({
        id: generateId(title),
        title: cleanHTML(title),
        description: cleanHTML(description).substring(0, 200),
        link,
        pubDate: pubDate || new Date().toISOString(),
        source: "",
        category: "",
        image,
      });
    }
  }
  
  return items;
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  
  // Handle regular tags
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractLink(xml: string): string {
  // Atom feeds use <link href="..." />
  const atomLink = xml.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (atomLink) return atomLink[1];
  
  const regularLink = xml.match(/<link[^>]*>([^<]+)<\/link>/i);
  return regularLink ? regularLink[1].trim() : "";
}

function extractImage(xml: string): string | undefined {
  // Try media:content
  const mediaMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  
  // Try enclosure
  const encMatch = xml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (encMatch) return encMatch[1];
  
  // Try img tag in content
  const imgMatch = xml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  
  return undefined;
}

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

function cleanHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

// Fetch and parse a single RSS feed
async function fetchFeed(source: typeof RSS_SOURCES[0]): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "TechVeb News Aggregator/1.0",
      },
    });
    clearTimeout(timeout);
    
    if (!res.ok) return [];
    
    const xml = await res.text();
    const items = parseXML(xml);
    
    return items.map((item) => ({
      ...item,
      source: source.name,
      category: source.category,
    }));
  } catch {
    return [];
  }
}

// Fetch all news from all sources
export async function fetchAllNews(): Promise<NewsItem[]> {
  const cacheKey = "all-news";
  const cached = getCached<NewsItem[]>(cacheKey);
  if (cached) return cached;
  
  // Fetch all feeds in parallel
  const feedPromises = RSS_SOURCES.map((source) => fetchFeed(source));
  const feedResults = await Promise.allSettled(feedPromises);
  
  // Combine all results
  let allNews: NewsItem[] = [];
  for (const result of feedResults) {
    if (result.status === "fulfilled") {
      allNews = [...allNews, ...result.value];
    }
  }
  
  // Sort by date (newest first)
  allNews.sort((a, b) => {
    try {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    } catch {
      return 0;
    }
  });
  
  // Remove duplicates by title similarity
  const seen = new Set<string>();
  allNews = allNews.filter((item) => {
    const key = item.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  setCache(cacheKey, allNews);
  return allNews;
}

// Get news by category
export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
  const allNews = await fetchAllNews();
  return allNews.filter((item) => item.category === category);
}

// Get breaking news (most recent 5)
export async function getBreakingNews(): Promise<NewsItem[]> {
  const allNews = await fetchAllNews();
  return allNews.slice(0, 5);
}

// Get trending topics
export async function getTrendingTopics(): Promise<string[]> {
  const allNews = await fetchAllNews();
  const words = new Map<string, number>();
  
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "shall", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "out", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "and", "but", "or", "if", "while", "this", "that", "these", "those", "it", "its", "new", "says", "said", "also", "about", "up", "one", "two", "three", "four", "five"]);
  
  for (const item of allNews) {
    const wordsList = item.title.toLowerCase().split(/\s+/);
    for (const word of wordsList) {
      const clean = word.replace(/[^a-z0-9]/g, "");
      if (clean.length > 3 && !stopWords.has(clean)) {
        words.set(clean, (words.get(clean) || 0) + 1);
      }
    }
  }
  
  return Array.from(words.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Get source statistics
export async function getNewsStats(): Promise<{ total: number; sources: number; latest: string }> {
  const allNews = await fetchAllNews();
  const sources = new Set(allNews.map((n) => n.source));
  
  return {
    total: allNews.length,
    sources: sources.size,
    latest: allNews[0]?.pubDate || new Date().toISOString(),
  };
}
