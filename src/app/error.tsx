"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">⚠️</div>
      <h1 className="mb-3 font-heading text-3xl font-bold">Something went wrong</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
