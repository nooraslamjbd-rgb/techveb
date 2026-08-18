import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/ai-tools`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
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

  const categoryPages = siteConfig.categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const allTags = getAllTags("blog")
    .concat(getAllTags("reviews"))
    .concat(getAllTags("ai-tools"));
  const uniqueTags = [...new Map(allTags.map((t) => [t.tag, t])).values()];
  const tagPages = uniqueTags.map((t) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(t.tag)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const authorPages = [
    { url: `${baseUrl}/author/techveb-team`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...blogPages,
    ...reviewPages,
    ...aiToolPages,
    ...categoryPages,
    ...tagPages,
    ...authorPages,
  ];
}
