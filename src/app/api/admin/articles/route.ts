import { NextResponse } from "next/server";
import { getAllPostsFromAllDirsAdmin } from "@/lib/mdx";
import { isAdminAuthenticated } from "@/lib/admin-auth";

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
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
  } catch {
    return NextResponse.json(
      { error: "Failed to load articles" },
      { status: 500 }
    );
  }
}
