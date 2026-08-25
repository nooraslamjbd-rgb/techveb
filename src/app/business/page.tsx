import type { Metadata } from "next";
import CurrencyWidget from "@/components/ui/CurrencyWidget";
import GoldWidget from "@/components/ui/GoldWidget";
import CryptoWidget from "@/components/ui/CryptoWidget";
import FuelWidget from "@/components/ui/FuelWidget";
import WeatherWidget from "@/components/ui/WeatherWidget";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Business & Finance - Currency, Gold, Crypto, Stock Market | TechVeb",
  description:
    "Real-time currency rates, gold prices, cryptocurrency, PSX stock market updates, and fuel prices in Pakistan.",
  alternates: { canonical: "https://techveb.com/business" },
  openGraph: {
    title: "Business & Finance - TechVeb",
    description: "Real-time financial data for Pakistan - Currency, Gold, Crypto, Stocks.",
    url: "https://techveb.com/business",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business & Finance - TechVeb",
    description: "Real-time financial data for Pakistan - Currency, Gold, Crypto, Stocks.",
  },
};

export default function BusinessPage() {
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Business & Finance - TechVeb",
    description: "Real-time financial data for Pakistan",
    url: "https://techveb.com/business",
  };

  return (
    <>
      <JsonLd data={businessJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl mb-2">Business & Finance</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Real-time currency rates, gold prices, crypto, and market updates for Pakistan
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left - Main Content */}
          <div>
            {/* Currency Overview */}
            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <span>💱</span> Currency Exchange Rates
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { from: "USD", to: "PKR", rate: "278.50", flag: "🇺🇸", change: "+0.15" },
                  { from: "EUR", to: "PKR", rate: "305.20", flag: "🇪🇺", change: "-0.22" },
                  { from: "GBP", to: "PKR", rate: "356.80", flag: "🇬🇧", change: "+0.08" },
                  { from: "SAR", to: "PKR", rate: "74.10", flag: "🇸🇦", change: "+0.05" },
                ].map((c) => (
                  <div key={c.from} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <span className="text-sm font-bold text-foreground">{c.from}</span>
                        <span className="text-xs text-muted-foreground"> → {c.to}</span>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-foreground">Rs. {c.rate}</p>
                    <p className={`text-xs font-bold mt-1 ${parseFloat(c.change) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {parseFloat(c.change) >= 0 ? "▲" : "▼"} {c.change}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gold & Silver */}
            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <span>🥇</span> Gold & Silver Prices
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Gold (24K)", tola: "Rs. 345,000", gram: "Rs. 30,650", icon: "🥇" },
                  { name: "Gold (22K)", tola: "Rs. 316,000", gram: "Rs. 28,080", icon: "🟡" },
                  { name: "Silver", tola: "Rs. 5,200", gram: "Rs. 4,620", icon: "🥈" },
                ].map((g) => (
                  <div key={g.name} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="font-heading font-bold text-sm">{g.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted px-3 py-2">
                        <p className="text-[10px] text-muted-foreground">Per Tola</p>
                        <p className="text-sm font-bold text-foreground">{g.tola}</p>
                      </div>
                      <div className="rounded-lg bg-muted px-3 py-2">
                        <p className="text-[10px] text-muted-foreground">Per 10g</p>
                        <p className="text-sm font-bold text-foreground">{g.gram}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crypto */}
            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <span>₿</span> Cryptocurrency
              </h2>
              <div className="rounded-xl border border-border bg-surface overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 px-4 py-2.5 border-b border-border text-xs font-medium text-muted-foreground">
                  <span>Coin</span>
                  <span className="text-right">Price (USD)</span>
                  <span className="text-right">Price (PKR)</span>
                  <span className="text-right">24h Change</span>
                </div>
                {[
                  { name: "Bitcoin", symbol: "BTC", price: 112500, pkr: 31331250, change: 2.5 },
                  { name: "Ethereum", symbol: "ETH", price: 4200, pkr: 1169700, change: -1.2 },
                  { name: "Tether", symbol: "USDT", price: 1.0, pkr: 278.5, change: 0.01 },
                  { name: "BNB", symbol: "BNB", price: 650, pkr: 181025, change: 1.8 },
                  { name: "XRP", symbol: "XRP", price: 2.85, pkr: 793.73, change: 3.2 },
                  { name: "Solana", symbol: "SOL", price: 185, pkr: 51522.5, change: -0.5 },
                ].map((coin) => (
                  <div key={coin.symbol} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <div>
                      <span className="text-sm font-bold text-foreground">{coin.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-1">{coin.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground text-right">
                      ${coin.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-foreground text-right">
                      Rs. {coin.pkr.toLocaleString()}
                    </span>
                    <span className={`text-sm font-bold text-right ${coin.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {coin.change >= 0 ? "+" : ""}{coin.change}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fuel Prices */}
            <div>
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <span>⛽</span> Fuel Prices
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { type: "Petrol", price: "252.50", icon: "⛽" },
                  { type: "Diesel", price: "262.50", icon: "🛢️" },
                  { type: "Kerosene", price: "161.00", icon: "🪔" },
                  { type: "LDO", price: "149.50", icon: "🔥" },
                ].map((f) => (
                  <div key={f.type} className="rounded-xl border border-border bg-surface p-4 text-center">
                    <span className="text-2xl mb-2 block">{f.icon}</span>
                    <p className="text-xs text-muted-foreground mb-1">{f.type}</p>
                    <p className="text-lg font-bold text-foreground">Rs. {f.price}</p>
                    <p className="text-[10px] text-muted-foreground">/ Liter</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CurrencyWidget />
            <GoldWidget />
            <CryptoWidget />
            <WeatherWidget />
            <FuelWidget />
          </div>
        </div>
      </section>
    </>
  );
}
