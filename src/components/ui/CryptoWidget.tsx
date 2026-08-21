"use client";

import { useEffect, useState } from "react";

interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  image: string;
}

export default function CryptoWidget() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/live/crypto");
        const json = await res.json();
        if (json.success) setPrices(json.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        ))}
      </div>
    );
  }

  if (prices.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-lg">₿</span>
        <h3 className="font-heading text-sm font-bold">Crypto</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">USD</span>
      </div>
      <div className="divide-y divide-border">
        {prices.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              {coin.image ? (
                <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[8px] text-white font-bold">
                  {coin.symbol[0]}
                </span>
              )}
              <div>
                <span className="text-xs font-medium text-foreground">{coin.symbol}</span>
                <span className="text-[10px] text-muted-foreground ml-1">{coin.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-foreground block">
                ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.change24h >= 0 ? "+" : ""}
                {coin.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
