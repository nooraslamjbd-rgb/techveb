"use client";

import { useEffect, useState } from "react";

interface GoldPrice {
  metal: string;
  pricePerTola: number;
  pricePer10Gram: number;
  change: number;
  currency: string;
}

export default function GoldWidget() {
  const [prices, setPrices] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/live/gold");
        const json = await res.json();
        if (json.success) setPrices(json.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden animate-pulse">
        <div className="px-4 py-3 border-b border-border">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="min-h-[188px] rounded-xl border border-border bg-surface overflow-hidden" />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-lg">🥇</span>
        <h3 className="font-heading text-sm font-bold">Gold & Silver</h3>
      </div>
      <div className="divide-y divide-border">
        {prices.map((item) => (
          <div key={item.metal} className="px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{item.metal}</span>
              {item.change !== 0 && (
                <span
                  className={`text-[10px] font-bold ${
                    item.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-muted px-2 py-1">
                <span className="text-[10px] text-muted-foreground block">Per Tola</span>
                <span className="text-xs font-bold text-foreground">
                  Rs. {item.pricePerTola.toLocaleString()}
                </span>
              </div>
              <div className="rounded bg-muted px-2 py-1">
                <span className="text-[10px] text-muted-foreground block">Per 10g</span>
                <span className="text-xs font-bold text-foreground">
                  Rs. {item.pricePer10Gram.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
