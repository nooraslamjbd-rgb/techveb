"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  image?: string;
}

const categoryColors: Record<string, string> = {
  tech: "bg-blue-500/10 text-blue-600",
  ai: "bg-purple-500/10 text-purple-600",
  business: "bg-green-500/10 text-green-600",
  sports: "bg-orange-500/10 text-orange-600",
};

const sourceIcons: Record<string, string> = {
  "TechCrunch": "📱",
  "The Verge": "⚡",
  "Ars Technica": "🔬",
  "MIT Technology Review": "🤖",
  "Wired": "🔌",
  "BBC Technology": "📺",
  "Reuters Business": "💰",
  "ESPN Cricinfo": "🏏",
};

function timeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function LiveNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        } else {
          setError("Failed to load news");
        }
      } catch {
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    const interval = setInterval(fetchNews, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: "all", label: "All", icon: "📰" },
    { id: "tech", label: "Technology", icon: "💻" },
    { id: "ai", label: "AI & ML", icon: "🤖" },
    { id: "business", label: "Business", icon: "💰" },
    { id: "sports", label: "Sports", icon: "🏏" },
  ];

  const filteredNews = activeCategory === "all" 
    ? news 
    : news.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <span className="text-4xl mb-3 block">📰</span>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground mt-1">Pull to refresh or try again later</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-primary text-white"
                : "bg-surface border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
        <span>{filteredNews.length} articles</span>
        <span>{new Set(filteredNews.map(n => n.source)).size} sources</span>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filteredNews.map((item, idx) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-border bg-surface p-4 hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-xs font-bold text-primary">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${categoryColors[item.category] || "bg-gray-500/10 text-gray-600"}`}>
                    {item.category.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>{sourceIcons[item.source] || "📰"}</span>
                    {item.source}
                  </span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(item.pubDate)}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </a>
        ))}

        {filteredNews.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-muted-foreground">No news found for this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
