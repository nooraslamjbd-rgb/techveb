import { NextResponse } from "next/server";
import { getGoldPrices } from "@/lib/live-data";

export async function GET() {
  try {
    const prices = await getGoldPrices();
    return NextResponse.json({ success: true, data: prices });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gold prices" },
      { status: 500 }
    );
  }
}
