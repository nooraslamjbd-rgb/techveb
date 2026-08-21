import { NextResponse } from "next/server";
import { getTrendingTopics } from "@/lib/news";

export async function GET() {
  try {
    const topics = await getTrendingTopics();
    return NextResponse.json({ success: true, data: topics });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch trending topics" },
      { status: 500 }
    );
  }
}

export const revalidate = 600;
