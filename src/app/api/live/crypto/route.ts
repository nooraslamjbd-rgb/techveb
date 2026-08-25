import { NextResponse } from "next/server";
import { getCryptoPrices } from "@/lib/live-data";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(`crypto:${ip}`, 20, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429, headers: getRateLimitHeaders(rl) }
      );
    }

    const prices = await getCryptoPrices();
    return NextResponse.json({ success: true, data: prices });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch crypto prices" },
      { status: 500 }
    );
  }
}
