import type { MetadataRoute } from "next";

const DISALLOW = ["/api/", "/admin/", "/search-index.json"];

const ALLOWED_AGENTS: string[] = [
  "*",
  "Googlebot",
  "Googlebot-News",
  "Google-News",
  "Google-Extended",
  "GoogleOther",
  "Bingbot",
  "BingPreview",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "anthropic-ai",
  "cohere-ai",
  "Diffbot",
  "Meta-ExternalAgent",
  "Applebot-Extended",
  "Applebot",
  "Amazonbot",
  "CCBot",
  "DataForSeoBot",
  "ApifyBot",
  "FacebookBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "AdsBot-Google",
        disallow: "/search-index.json",
      },
    ],
    sitemap: [
      "https://techveb.com/sitemap.xml",
      "https://techveb.com/news-sitemap.xml",
    ],
  };
}