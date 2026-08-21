import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/news";

export async function GET() {
  try {
    const news = await fetchAllNews();
    return NextResponse.json({ success: true, count: news.length, data: news });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export const revalidate = 600; // Revalidate every 10 minutes
