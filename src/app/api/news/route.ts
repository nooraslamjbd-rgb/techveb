import { NextResponse } from "next/server";
import { getAllNewsPosts } from "@/lib/mdx";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(`news:${ip}`, 30, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429, headers: getRateLimitHeaders(rl) }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const posts = getAllNewsPosts().slice(0, safeLimit);
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
