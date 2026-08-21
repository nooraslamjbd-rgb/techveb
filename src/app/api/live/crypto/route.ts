import { NextResponse } from "next/server";
import { getCryptoPrices } from "@/lib/live-data";

export async function GET() {
  try {
    const prices = await getCryptoPrices();
    return NextResponse.json({ success: true, data: prices });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch crypto prices" },
      { status: 500 }
    );
  }
}
