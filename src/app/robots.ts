import type { MetadataRoute } from "next";

const DISALLOW = ["/api/", "/admin/", "/search-index.json"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Diffbot",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: "https://techveb.com/sitemap.xml",
  };
}
