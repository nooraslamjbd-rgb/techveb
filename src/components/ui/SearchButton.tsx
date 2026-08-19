"use client";

import { useState } from "react";
import SearchModal from "@/components/ui/SearchModal";

export default function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
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
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
