import { NextResponse } from "next/server";
import { getAllPostsFromAllDirsAdmin } from "@/lib/mdx";

export const dynamic = "force-dynamic";

interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  status: string;
  dir: string;
}

export async function GET() {
  try {
    const posts = getAllPostsFromAllDirsAdmin();
    const articles: ArticleSummary[] = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      author: p.author,
      category: p.category,
      tags: p.tags,
      image: p.image,
      featured: p.featured,
      status: (p as unknown as Record<string, unknown>).status === "draft" ? "draft" : "published",
      dir: p.category === "ai" ? "ai-tools" : p.category === "product-reviews" ? "reviews" : "blog",
    }));
    return NextResponse.json({ articles, total: articles.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load articles", details: String(error) },
      { status: 500 }
    );
  }
}
