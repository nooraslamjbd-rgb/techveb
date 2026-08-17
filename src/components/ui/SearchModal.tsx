"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface SearchArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
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

const categoryLabels: Record<string, string> = {
  ai: "AI",
  "tech-news": "Tech News",
  "product-reviews": "Reviews",
  tutorials: "Programming",
  cloud: "Cloud",
  cybersecurity: "Security",
  gaming: "Gaming",
  "emerging-tech": "Emerging",
};

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchArticle[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const allArticles = useRef<SearchArticle[]>([]);

  useEffect(() => {
    if (open && allArticles.current.length === 0) {
      setLoading(true);
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((data: SearchArticle[]) => {
          allArticles.current = data;
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allArticles.current.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
    setResults(filtered.slice(0, 20));
    setActiveIndex(-1);
  }, [query]);

  const navigateResult = useCallback(
    (idx: number) => {
      if (results[idx]) {
        window.location.href = `/${results[idx].dir}/${results[idx].slug}`;
        onClose();
      }
    },
    [results, onClose]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        navigateResult(activeIndex);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, activeIndex, results.length, navigateResult]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[10vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl animate-slide-down rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <svg className="h-5 w-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 500+ articles..."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading articles...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Start typing to search articles, tutorials, and reviews...
            </div>
          )}

          {results.map((article, idx) => {
            const color = categoryColors[article.category] || "#0060E0";
            const label = categoryLabels[article.category] || article.category;
            return (
              <Link
                key={article.slug}
                href={`/${article.dir}/${article.slug}`}
                onClick={onClose}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 transition-colors ${
                  idx === activeIndex
                    ? "bg-primary/10"
                    : "hover:bg-surface"
                }`}
              >
                <span
                  className="mt-0.5 inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                  style={{ backgroundColor: color }}
                >
                  {label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {article.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {article.description}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {new Date(article.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-5 py-2.5 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[9px]">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[9px]">↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[9px]">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
