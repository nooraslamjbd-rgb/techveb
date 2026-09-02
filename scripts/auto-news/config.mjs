import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AQ.Ab8RN6IUThn_afVbRS0CVp27TzQgc2QHervJZD-JAQbbzoAnQw",
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",

  GROQ_API_KEY: process.env.GROK_API_KEY || "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",
  GROQ_API_URL: "https://api.groq.com/openai/v1/chat/completions",
  GROQ_MODEL: "openai/gpt-oss-20b",

  CONTENT_DIR: path.join(__dirname, "..", "..", "src", "content", "news"),
  NEWS_IMAGE_DIR: path.join(__dirname, "..", "..", "public", "news"),
  LOGO_PATH: path.join(__dirname, "assets", "logo-square.png"),
  WIKIMEDIA_POOL: path.join(__dirname, "..", ".wikimedia-images.json"),

  MAX_ARTICLES: 15,
  ARTICLE_TIMEOUT_MS: 15000,
  RSS_TIMEOUT_MS: 10000,
  FETCH_DELAY_MS: 500,
  AI_DELAY_MS: 200,

  AUTHOR: "TechVeb News",
  SITE_URL: "https://techveb.com",
};

export const RSS_SOURCES = [
  // Urdu sources
  { name: "BOL News Urdu", url: "https://www.bolnewsurdu.com/feed/", language: "ur", defaultCategory: "tech-news" },
  { name: "ARY News Urdu", url: "https://urdu.arynews.tv/feed/", language: "ur", defaultCategory: "tech-news" },
  { name: "Aaj News", url: "https://www.aaj.tv/feed", language: "ur", defaultCategory: "tech-news" },
  { name: "UrduPoint", url: "https://www.urdupoint.com/en/sitemap/news.rss", language: "ur", defaultCategory: "tech-news" },
  { name: "Express News", url: "https://www.express.pk/feed/", language: "ur", defaultCategory: "tech-news" },
  { name: "Geo News Urdu", url: "https://urdu.geo.tv/feed/", language: "ur", defaultCategory: "tech-news" },

  // English sources
  { name: "Dawn News", url: "https://www.dawn.com/feeds/home", language: "en", defaultCategory: "tech-news" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", language: "en", defaultCategory: "tech-news" },
  { name: "CNN", url: "https://rss.cnn.com/rss/edition.rss", language: "en", defaultCategory: "tech-news" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", language: "en", defaultCategory: "tech-news" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/", language: "en", defaultCategory: "cybersecurity" },
  { name: "ESPN Cricinfo", url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml", language: "en", defaultCategory: "sports" },
];

export const TITLE_KEYWORDS = {
  AI: ["ai", "artificial intelligence", "chatgpt", "openai", "machine learning", "deep learning", "neural", "llm", "gpt", "copilot", "gemini", "claude"],
  cybersecurity: ["hack", "breach", "cyber", "security", "malware", "ransomware", "phishing", "encryption", "vulnerability", "zero-day"],
  cloud: ["cloud", "aws", "azure", "google cloud", "saas", "serverless", "kubernetes", "docker"],
  smartphones: ["iphone", "android", "samsung", "pixel", "phone", "mobile", "smartphone", "galaxy"],
  gaming: ["game", "gaming", "playstation", "xbox", "nintendo", "esports", "gamer"],
  blockchain: ["crypto", "bitcoin", "ethereum", "blockchain", "defi", "nft", "web3", "token"],
  hardware: ["chip", "processor", "gpu", "nvidia", "amd", "intel", "semiconductor"],
  robotics: ["robot", "autonomous", "drone", "self-driving", "waymo", "tesla"],
  privacy: ["privacy", "data", "surveillance", "tracking", "gdpr"],
  "space-tech": ["space", "spacex", "nasa", "rocket", "satellite"],
  sports: ["cricket", "football", "soccer", "tennis", "f1", "formula", "olympics", "world cup", "match", "tournament", "player", "team"],
  business: ["startup", "funding", "ipo", "merger", "acquisition", "revenue", "profit", "stock", "market", "economy", "trade"],
  entertainment: ["movie", "film", "netflix", "spotify", "music", "celebrity", "bollywood", "hollywood", "series", "concert"],
  education: ["university", "student", "school", "learning", "course", "degree", "exam"],
  automotive: ["car", "ev", "electric vehicle", "tesla", "toyota", "honda", "bmw", "mercedes", "recall"],
};

export const VALID_CATEGORIES = [
  "tech-news", "cybersecurity", "ai", "cloud", "gaming",
  "sports", "business", "entertainment", "education", "mobiles",
  "emerging-tech", "coding",
];

// Domains that block cross-origin browser loading (CORS/CORP/Cloudflare)
// Strip image references from these domains in article body content
export const BLOCKED_IMAGE_DOMAINS = [
  "photo-cdn.urdupoint.com",
];
