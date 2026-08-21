"use client";

import { useEffect, useState } from "react";

interface CurrencyRate {
  currency: string;
  name: string;
  rate: number;
  flag: string;
}

export default function CurrencyWidget() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/live/currency");
        const json = await res.json();
        if (json.success) setRates(json.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
    const interval = setInterval(fetchRates, 300000);
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

  if (rates.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-lg">💱</span>
        <h3 className="font-heading text-sm font-bold">Currency Rates</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">PKR</span>
      </div>
      <div className="divide-y divide-border">
        {rates.map((rate) => (
          <div
            key={rate.currency}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{rate.flag}</span>
              <span className="text-xs font-medium text-foreground">{rate.currency}</span>
            </div>
            <span className="text-xs font-bold text-foreground">
              Rs. {rate.rate.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
