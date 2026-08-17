"use client";

import { useState } from "react";
import Link from "next/link";
import { getDirFromCategory } from "@/lib/category-utils";

interface SearchArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  dir: string;
}

const categoryColors: Record<string, string> = {
  ai: "#0060E0",
  "tech-news": "#10B981",
  "product-reviews": "#F59E0B",
  tutorials: "#8B5CF6",
  cloud: "#EC4899",
  cybersecurity: "#EF4444",
  gaming: "#F97316",
  "emerging-tech": "#06B6D4",
};

export default function HomeSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchArticle[]>([]);
  const [focused, setFocused] = useState(false);

  const handleChange = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch("/search-index.json");
      const all: SearchArticle[] = await res.json();
      const q = value.toLowerCase();
      const filtered = all
        .filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setResults(filtered);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative max-w-xl">
      <div className="flex items-center rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm focus-within:border-white/30 focus-within:bg-white/10 transition-all">
        <svg className="ml-4 h-5 w-5 shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search 500+ articles..."
          className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/40 outline-none"
        />
        <kbd className="mr-3 hidden sm:inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/40">
          ⌘K
        </kbd>
      </div>

      {focused && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-background p-2 shadow-xl animate-slide-down">
          {results.map((article) => (
            <Link
              key={article.slug}
              href={`/${getDirFromCategory(article.category)}/${article.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-surface transition-colors"
            >
              <span
                className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ backgroundColor: categoryColors[article.category] || "#0060E0" }}
              >
                {article.category.replace("-", " ")}
              </span>
              <span className="truncate text-sm text-foreground">{article.title}</span>
            </Link>
          ))}
          <Link
            href={`/blog?q=${encodeURIComponent(query)}`}
            className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-primary hover:bg-surface transition-colors"
          >
            View all results &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
