import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://techveb.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date("2025-01-01"), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date("2025-01-01"), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: new Date("2025-01-01"), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/ai-tools`, lastModified: new Date("2025-01-01"), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date("2025-01-01"), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date("2025-01-01"), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const blogPages = getAllPosts("blog").map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const reviewPages = getAllPosts("reviews").map((post) => ({
    url: `${baseUrl}/reviews/${post.slug}`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const aiToolPages = getAllPosts("ai-tools").map((post) => ({
    url: `${baseUrl}/ai-tools/${post.slug}`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...reviewPages, ...aiToolPages];
}
