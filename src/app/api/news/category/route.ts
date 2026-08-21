import { NextResponse } from "next/server";
import { getNewsByCategory } from "@/lib/news";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("cat") || "tech";
    const news = await getNewsByCategory(category);
    return NextResponse.json({ success: true, category, count: news.length, data: news });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export const revalidate = 600;
