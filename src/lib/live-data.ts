// Live Data API Layer - Free APIs only
// Cache data for 5 minutes to avoid rate limits

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// CURRENCY RATES (ExchangeRate-API - Free)
// ============================================
export interface CurrencyRate {
  currency: string;
  name: string;
  rate: number;
  flag: string;
}

export async function getCurrencyRates(): Promise<CurrencyRate[]> {
  const cacheKey = "currency-rates";
  const cached = getCached<CurrencyRate[]>(cacheKey);
  if (cached) return cached;

  try {
    // Free API: https://open.er-api.com/v6/latest/USD
    const res = await fetch("https://open.er-api.com/v6/latest/PKR", {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    
    const rates: CurrencyRate[] = [
      { currency: "USD", name: "US Dollar", rate: 1 / (data.rates?.USD || 1), flag: "🇺🇸" },
      { currency: "EUR", name: "Euro", rate: 1 / (data.rates?.EUR || 1), flag: "🇪🇺" },
      { currency: "GBP", name: "British Pound", rate: 1 / (data.rates?.GBP || 1), flag: "🇬🇧" },
      { currency: "SAR", name: "Saudi Riyal", rate: 1 / (data.rates?.SAR || 1), flag: "🇸🇦" },
      { currency: "AED", name: "UAE Dirham", rate: 1 / (data.rates?.AED || 1), flag: "🇦🇪" },
      { currency: "CAD", name: "Canadian Dollar", rate: 1 / (data.rates?.CAD || 1), flag: "🇨🇦" },
      { currency: "AUD", name: "Australian Dollar", rate: 1 / (data.rates?.AUD || 1), flag: "🇦🇺" },
      { currency: "CNY", name: "Chinese Yuan", rate: 1 / (data.rates?.CNY || 1), flag: "🇨🇳" },
    ];

    setCache(cacheKey, rates);
    return rates;
  } catch {
    // Fallback rates (approximate)
    return [
      { currency: "USD", name: "US Dollar", rate: 278.50, flag: "🇺🇸" },
      { currency: "EUR", name: "Euro", rate: 305.20, flag: "🇪🇺" },
      { currency: "GBP", name: "British Pound", rate: 356.80, flag: "🇬🇧" },
      { currency: "SAR", name: "Saudi Riyal", rate: 74.10, flag: "🇸🇦" },
      { currency: "AED", name: "UAE Dirham", rate: 75.90, flag: "🇦🇪" },
      { currency: "CAD", name: "Canadian Dollar", rate: 202.40, flag: "🇨🇦" },
      { currency: "AUD", name: "Australian Dollar", rate: 180.60, flag: "🇦🇺" },
      { currency: "CNY", name: "Chinese Yuan", rate: 38.40, flag: "🇨🇳" },
    ];
  }
}

// ============================================
// CRYPTO PRICES (CoinGecko - Free)
// ============================================
export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  image: string;
}

export async function getCryptoPrices(): Promise<CryptoPrice[]> {
  const cacheKey = "crypto-prices";
  const cached = getCached<CryptoPrice[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,ripple,solana&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h",
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    
    const prices: CryptoPrice[] = data.map((coin: Record<string, unknown>) => ({
      id: coin.id as string,
      name: coin.name as string,
      symbol: (coin.symbol as string).toUpperCase(),
      price: coin.current_price as number,
      change24h: coin.price_change_percentage_24h as number,
      image: coin.image as string,
    }));

    setCache(cacheKey, prices);
    return prices;
  } catch {
    // Fallback
    return [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 112500, change24h: 2.5, image: "" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 4200, change24h: -1.2, image: "" },
      { id: "tether", name: "Tether", symbol: "USDT", price: 1.0, change24h: 0.01, image: "" },
      { id: "binancecoin", name: "BNB", symbol: "BNB", price: 650, change24h: 1.8, image: "" },
      { id: "ripple", name: "XRP", symbol: "XRP", price: 2.85, change24h: 3.2, image: "" },
      { id: "solana", name: "Solana", symbol: "SOL", price: 185, change24h: -0.5, image: "" },
    ];
  }
}

// ============================================
// WEATHER (OpenWeatherMap - Free tier)
// ============================================
export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  sunrise: number;
  sunset: number;
}

export async function getWeather(city: string = "Karachi"): Promise<WeatherData | null> {
  const cacheKey = `weather-${city}`;
  const cached = getCached<WeatherData>(cacheKey);
  if (cached) return cached;

  // Using wttr.in (free, no API key needed)
  try {
    const res = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      { next: { revalidate: 600 } }
    );
    const data = await res.json();
    const current = data.current_condition?.[0];

    if (!current) return null;

    const weather: WeatherData = {
      city,
      temp: parseInt(current.temp_C),
      feelsLike: parseInt(current.FeelsLikeC),
      humidity: parseInt(current.humidity),
      description: current.weatherDesc?.[0]?.value || "N/A",
      icon: current.weatherCode || "113",
      windSpeed: parseInt(current.windspeedKmph),
      sunrise: data.weather?.[0]?.astronomy?.[0]?.sunrise
        ? parseTimeToSeconds(data.weather[0].astronomy[0].sunrise)
        : 0,
      sunset: data.weather?.[0]?.astronomy?.[0]?.sunset
        ? parseTimeToSeconds(data.weather[0].astronomy[0].sunset)
        : 0,
    };

    setCache(cacheKey, weather);
    return weather;
  } catch {
    return null;
  }
}

function parseTimeToSeconds(time: string): number {
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  let h = hours;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 3600 + minutes * 60;
}

// ============================================
// GOLD & SILVER PRICES (Approximation)
// ============================================
export interface GoldPrice {
  metal: string;
  pricePerTola: number;
  pricePer10Gram: number;
  change: number;
  currency: string;
}

export async function getGoldPrices(): Promise<GoldPrice[]> {
  const cacheKey = "gold-prices";
  const cached = getCached<GoldPrice[]>(cacheKey);
  if (cached) return cached;

  try {
    // Using metals-api free approximation
    const res = await fetch(
      "https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const usdToPkr = 278.5; // approximate
    const tozToTola = 0.8886; // 1 toz = 0.8886 tola
    const tozTo10g = 0.3215; // 1 toz = 0.3215 10g

    const goldUsd = data.metals?.gold || 2400;
    const silverUsd = data.metals?.silver || 28;

    const prices: GoldPrice[] = [
      {
        metal: "Gold (24K)",
        pricePerTola: Math.round(goldUsd * tozToTola * usdToPkr),
        pricePer10Gram: Math.round(goldUsd * tozTo10g * usdToPkr),
        change: 0,
        currency: "PKR",
      },
      {
        metal: "Silver",
        pricePerTola: Math.round(silverUsd * tozToTola * usdToPkr),
        pricePer10Gram: Math.round(silverUsd * tozTo10g * usdToPkr),
        change: 0,
        currency: "PKR",
      },
    ];

    setCache(cacheKey, prices);
    return prices;
  } catch {
    // Fallback
    return [
      { metal: "Gold (24K)", pricePerTola: 345000, pricePer10Gram: 30650, change: 0, currency: "PKR" },
      { metal: "Silver", pricePerTola: 5200, pricePer10Gram: 4620, change: 0, currency: "PKR" },
    ];
  }
}

// ============================================
// PETROL / CNG PRICES (Static - updated manually)
// ============================================
export interface FuelPrice {
  type: string;
  price: number;
  unit: string;
}

export function getFuelPrices(): FuelPrice[] {
  return [
    { type: "Petrol", price: 252.50, unit: "PKR/Ltr" },
    { type: "High Speed Diesel", price: 262.50, unit: "PKR/Ltr" },
    { type: "Kerosene Oil", price: 161.00, unit: "PKR/Ltr" },
    { type: "Light Diesel", price: 149.50, unit: "PKR/Ltr" },
  ];
}

// ============================================
// WEATHER CODE TO ICON MAP
// ============================================
export function getWeatherIcon(code: string): string {
  const codeNum = parseInt(code);
  if (codeNum === 113) return "☀️";
  if (codeNum === 116) return "⛅";
  if (codeNum === 119 || codeNum === 122) return "☁️";
  if (codeNum === 176 || codeNum === 263 || codeNum === 266) return "🌦️";
  if (codeNum === 293 || codeNum === 296 || codeNum === 299) return "🌧️";
  if (codeNum === 302 || codeNum === 305 || codeNum === 308) return "🌧️";
  if (codeNum === 356 || codeNum === 359) return "⛈️";
  if (codeNum === 386 || codeNum === 389) return "⛈️";
  if (codeNum === 392 || codeNum === 395) return "🌨️";
  return "🌤️";
}
