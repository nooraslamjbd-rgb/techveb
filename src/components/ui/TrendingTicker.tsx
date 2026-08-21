import Link from "next/link";
import { getAllPostsFromAllDirs } from "@/lib/mdx";

export default function TrendingTicker() {
  const allPosts = getAllPostsFromAllDirs()
    .filter((p) => p.category === "tech-news" || p.category === "ai")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (allPosts.length === 0) return null;

  return (
    <div className="border-b border-border bg-surface/50 overflow-hidden">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="shrink-0 border-r border-border bg-red-600 px-3 py-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Trending
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex items-center gap-6 overflow-x-auto px-4 py-1.5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {allPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.dir}/${post.slug}`}
                className="shrink-0 text-xs font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {post.title}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </div>
  );
}
