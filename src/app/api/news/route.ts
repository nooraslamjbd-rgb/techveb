import { NextResponse } from "next/server";
import { getAllNewsPosts } from "@/lib/mdx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const posts = getAllNewsPosts().slice(0, limit);
    const data = posts.map((p) => ({
      id: p.slug,
      title: p.title,
      description: p.description,
      link: `/news/${p.slug}`,
      pubDate: p.date,
      source: p.source || "TechVeb News",
      category: p.category,
      image: p.image,
    }));

    return NextResponse.json({ success: true, count: data.length, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export const revalidate = 300; // Revalidate every 5 minutes
