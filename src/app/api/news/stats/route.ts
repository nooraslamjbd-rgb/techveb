import { NextResponse } from "next/server";
import { getNewsStats } from "@/lib/news";

export async function GET() {
  try {
    const stats = await getNewsStats();
    return NextResponse.json({ success: true, data: stats });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export const revalidate = 600;
