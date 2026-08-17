import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 text-[120px] font-bold leading-none text-primary/10 font-heading">
        404
      </div>
      <h1 className="mb-4 font-heading text-3xl font-bold">Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted">
        The page you are looking for might have been moved, removed, or never
        existed. Let us get you back on track.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Back to Home
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-hover"
        >
          Browse Articles
        </Link>
      </div>
    </div>
  );
}
