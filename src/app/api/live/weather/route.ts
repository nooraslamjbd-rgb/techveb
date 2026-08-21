import { NextResponse } from "next/server";
import { getWeather } from "@/lib/live-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Karachi";
    const weather = await getWeather(city);
    if (!weather) {
      return NextResponse.json(
        { success: false, error: "Weather data not available" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: weather });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
