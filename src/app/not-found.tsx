import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <span className="font-heading text-4xl font-bold text-primary">404</span>
      </div>
      <h1 className="mb-3 font-heading text-3xl font-bold">Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted">
        The page you are looking for does not exist or has been moved.
        Try searching for what you need.
      </p>
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
  );
}
