import { NextResponse } from "next/server";
import { getCurrencyRates } from "@/lib/live-data";

export async function GET() {
  try {
    const rates = await getCurrencyRates();
    return NextResponse.json({ success: true, data: rates });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch currency rates" },
      { status: 500 }
    );
  }
}
