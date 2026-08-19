import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/search-index.json"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
      },
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
    ],
    sitemap: "https://techveb.com/sitemap.xml",
  };
}
