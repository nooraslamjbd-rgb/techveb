"use client";

import { useState } from "react";
import Link from "next/link";
import SearchModal from "@/components/ui/SearchModal";

export default function NotFound() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <span className="font-heading text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="mb-3 font-heading text-3xl font-bold">Page Not Found</h1>
        <p className="mb-8 max-w-md text-muted">
          The page you are looking for does not exist or has been moved.
          Try searching for what you need.
        </p>
        <div className="mb-6 w-full max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:border-primary/30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search articles...
            <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[10px]">Ctrl+K</kbd>
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
          >
            Go to Homepage
          </Link>
          <Link
            href="/blog"
            className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-hover"
          >
            Browse Articles
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link href="/blog?cat=ai" className="rounded-lg border border-border bg-surface p-3 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
            AI & ML
          </Link>
          <Link href="/blog?cat=tech-news" className="rounded-lg border border-border bg-surface p-3 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
            Tech News
          </Link>
          <Link href="/reviews" className="rounded-lg border border-border bg-surface p-3 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
            Reviews
          </Link>
          <Link href="/ai-tools" className="rounded-lg border border-border bg-surface p-3 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
            AI Tools
          </Link>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
