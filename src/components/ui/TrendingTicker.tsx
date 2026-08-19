import Link from "next/link";
import { getAllPostsFromAllDirs } from "@/lib/mdx";

function getDirFromPostDir(post: { slug: string; category: string }, allSlugs: Map<string, string>): string {
  const dir = allSlugs.get(post.slug);
  if (dir) return dir;
  if (post.category === "ai") return "ai-tools";
  if (post.category === "product-reviews" || post.category === "reviews") return "reviews";
  return "blog";
}

export default function TrendingTicker() {
  const allPosts = getAllPostsFromAllDirs()
    .filter((p) => p.category === "tech-news" || p.category === "ai")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (allPosts.length === 0) return null;

  const slugToDir = new Map<string, string>();

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
        <div className="flex items-center gap-6 overflow-x-auto px-4 py-1.5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {allPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${getDirFromPostDir(post, slugToDir)}/${post.slug}`}
              className="shrink-0 text-xs font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
