"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  category: string;
}

export default function LiveNewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=20");
        const json = await res.json();
        if (json.success) {
          setNews(json.data.slice(0, 15));
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    const interval = setInterval(fetchNews, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-600/10 border-b border-border overflow-hidden">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <div className="flex items-center gap-1 py-1.5">
          <span className="shrink-0 bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded mr-2">
            Breaking
          </span>
          <div className="relative overflow-hidden flex-1">
            <div className="animate-marquee flex items-center whitespace-nowrap">
              {[...news, ...news].map((item, idx) => (
                <a
                  key={`${item.id}-${idx}`}
                  href={item.link}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mr-6"
                >
                  <span className="shrink-0 text-[10px] font-bold text-blue-500">{item.source}</span>
                  <span className="font-medium text-foreground">{item.title}</span>
                  <span className="text-gray-400">•</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
