import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import ArticleCard from "@/components/blog/ArticleCard";
import LiveNewsFeed from "@/components/ui/LiveNewsFeed";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Breaking News - Live Tech & World News | TechVeb",
  description:
    "Stay updated with live breaking news in technology, AI, business, and world events. Real-time RSS feeds from top sources.",
  alternates: { canonical: "https://techveb.com/news" },
  openGraph: {
    title: "Breaking News - TechVeb",
    description: "Live breaking news in technology, AI, business, and world events.",
    url: "https://techveb.com/news",
    type: "website",
  },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.cat || null;
  const allPosts = getAllPosts("blog");
  let newsPosts = allPosts
    .filter((p) => p.category === "tech-news")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (activeCategory) {
    newsPosts = allPosts
      .filter((p) => p.category === activeCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const breakingNews = newsPosts.slice(0, 1);
  const latestPosts = newsPosts.slice(1, 13);

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Breaking News - TechVeb",
    description: "Live breaking news in technology, AI, and business.",
    url: "https://techveb.com/news",
  };

  return (
    <>
      <JsonLd data={newsJsonLd} />

      {/* Hero Breaking News */}
      <section className="bg-gradient-to-b from-red-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-3 w-3 items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-ping absolute" />
              <span className="h-3 w-3 rounded-full bg-red-500 relative" />
            </span>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">Breaking News</h1>
          </div>

          {/* Breaking News Banner */}
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
            <div className="flex items-center gap-2">
              <span className="shrink-0 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded animate-pulse">
                LIVE
              </span>
              <p className="text-sm text-foreground">
                Real-time news from TechCrunch, The Verge, Ars Technica, Wired, BBC, and more
              </p>
            </div>
          </div>

          {breakingNews.length > 0 && (
            <Link
              href={`/blog/${breakingNews[0].slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="relative h-[300px] lg:h-[400px]">
                  {breakingNews[0].image && (
                    <img
                      src={breakingNews[0].image}
                      alt={breakingNews[0].title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-4 top-4 bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: siteConfig.categories.find((c) => c.slug === breakingNews[0].category)?.color || "#0060E0" }}
                    >
                      {siteConfig.categories.find((c) => c.slug === breakingNews[0].category)?.label || breakingNews[0].category}
                    </span>
                    <span className="text-xs text-muted-foreground">{breakingNews[0].readingTime}</span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold sm:text-3xl group-hover:text-primary transition-colors mb-3">
                    {breakingNews[0].title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {breakingNews[0].description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium">{breakingNews[0].author}</span>
                    <span>·</span>
                    <time dateTime={breakingNews[0].date}>
                      {new Date(breakingNews[0].date).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Live News Feed */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-heading text-xl font-bold sm:text-2xl">Live News Feed</h2>
          <span className="text-xs text-muted-foreground">(from RSS feeds)</span>
        </div>
        <LiveNewsFeed />
      </section>

      {/* TechVeb Articles */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-border">
        <h2 className="font-heading text-xl font-bold mb-6">TechVeb Articles</h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} dir="blog" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">News Sources</h3>
              <div className="space-y-2">
                {[
                  { name: "TechCrunch", url: "https://techcrunch.com", icon: "📱" },
                  { name: "The Verge", url: "https://theverge.com", icon: "⚡" },
                  { name: "Ars Technica", url: "https://arstechnica.com", icon: "🔬" },
                  { name: "Wired", url: "https://wired.com", icon: "🔌" },
                  { name: "BBC Tech", url: "https://bbc.com/technology", icon: "📺" },
                ].map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>{source.icon}</span>
                    {source.name} ↗
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Categories</h3>
              <div className="space-y-2">
                {[
                  { label: "Tech News", slug: "tech-news" },
                  { label: "Artificial Intelligence", slug: "ai" },
                  { label: "Cloud Computing", slug: "cloud" },
                  { label: "Cybersecurity", slug: "cybersecurity" },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/news?cat=${cat.slug}`}
                    className={`block text-sm transition-colors ${
                      activeCategory === cat.slug
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    → {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
