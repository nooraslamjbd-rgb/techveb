import { NextResponse } from "next/server";
import { getCurrencyRates, getCryptoPrices, getGoldPrices, getWeather, getFuelPrices } from "@/lib/live-data";

export async function GET() {
  try {
    const [currency, crypto, gold, weather, fuel] = await Promise.allSettled([
      getCurrencyRates(),
      getCryptoPrices(),
      getGoldPrices(),
      getWeather("Karachi"),
      Promise.resolve(getFuelPrices()),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        currency: currency.status === "fulfilled" ? currency.value : [],
        crypto: crypto.status === "fulfilled" ? crypto.value : [],
        gold: gold.status === "fulfilled" ? gold.value : [],
        weather: weather.status === "fulfilled" ? weather.value : null,
        fuel: fuel.status === "fulfilled" ? fuel.value : [],
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch live data" },
      { status: 500 }
    );
  }
}
