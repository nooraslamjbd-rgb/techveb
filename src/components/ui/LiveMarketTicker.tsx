"use client";

import { useEffect, useState } from "react";

interface TickerItem {
  label: string;
  value: string;
  change?: number;
  icon?: string;
}

export default function LiveMarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/live/all");
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          const tickerItems: TickerItem[] = [];

          // Currency
          if (d.currency) {
            d.currency.slice(0, 4).forEach((c: { currency: string; rate: number; flag: string }) => {
              tickerItems.push({
                label: `${c.flag} ${c.currency}/PKR`,
                value: c.rate.toFixed(2),
              });
            });
          }

          // Gold
          if (d.gold) {
            d.gold.forEach((g: { metal: string; pricePerTola: number }) => {
              tickerItems.push({
                label: `🥇 ${g.metal}`,
                value: `Rs. ${g.pricePerTola.toLocaleString()}`,
              });
            });
          }

          // Crypto
          if (d.crypto) {
            d.crypto.slice(0, 3).forEach((c: { symbol: string; price: number; change24h: number }) => {
              tickerItems.push({
                label: `₿ ${c.symbol}`,
                value: `$${c.price.toLocaleString()}`,
                change: c.change24h,
              });
            });
          }

          // Fuel
          if (d.fuel) {
            d.fuel.slice(0, 2).forEach((f: { type: string; price: number }) => {
              tickerItems.push({
                label: `⛽ ${f.type}`,
                value: `Rs. ${f.price}`,
              });
            });
          }

          setItems(tickerItems);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 overflow-hidden">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <div className="flex items-center gap-1 py-1.5">
          <span className="shrink-0 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded mr-2">
            Live
          </span>
          <div className="relative overflow-hidden flex-1">
            <div className="animate-marquee flex items-center whitespace-nowrap">
              {[...items, ...items].map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-300 mr-6"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}</span>
                  {item.change !== undefined && (
                    <span
                      className={`text-[10px] font-bold ${
                        item.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(1)}%
                    </span>
                  )}
                  <span className="text-gray-600">|</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
