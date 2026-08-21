import type { Metadata } from "next";
import Link from "next/link";
import { getAllNewsPosts, getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import ArticleCard from "@/components/blog/ArticleCard";
import JsonLd from "@/components/seo/JsonLd";
import TimeAgo from "@/components/ui/TimeAgo";
import OptimizedImage from "@/components/ui/OptimizedImage";

export const metadata: Metadata = {
  title: "Breaking News - Live Tech & World News | TechVeb",
  description:
    "Stay updated with breaking news in technology, AI, business, and world events from top sources.",
  alternates: { canonical: "https://techveb.com/news" },
  openGraph: {
    title: "Breaking News - TechVeb",
    description: "Breaking news in technology, AI, and business.",
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

  // Local MDX news articles
  let newsArticles = getAllNewsPosts();

  if (activeCategory) {
    newsArticles = newsArticles.filter((p) => p.category === activeCategory);
  }

  // Blog posts tagged as tech-news
  const blogNews = getAllPosts("blog")
    .filter((p) => p.category === "tech-news")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const heroArticle = newsArticles[0] || blogNews[0];
  const remainingNews = heroArticle ? newsArticles.filter((p) => p.slug !== heroArticle.slug) : newsArticles;
  const latestBlogPosts = blogNews.slice(0, 6);

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Breaking News - TechVeb",
    description: "Breaking news in technology, AI, and business.",
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

          {heroArticle && (
            <Link
              href={`/news/${heroArticle.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                {heroArticle.image && (
                  <div className="relative h-[300px] lg:h-[400px]">
                    <OptimizedImage
                      src={heroArticle.image}
                      alt={heroArticle.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      category={heroArticle.category}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-4 top-4 bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                      Latest
                    </span>
                  </div>
                )}
                <div className="flex flex-col justify-center p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-2">
                    {heroArticle.source && (
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {heroArticle.source}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{heroArticle.readingTime}</span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold sm:text-3xl group-hover:text-primary transition-colors mb-3">
                    {heroArticle.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {heroArticle.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <TimeAgo date={heroArticle.date} />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Local News Articles */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <h2 className="font-heading text-xl font-bold sm:text-2xl">Latest News</h2>
          <span className="text-xs text-muted-foreground">({newsArticles.length} articles)</span>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: "All News", slug: null },
            { label: "Tech News", slug: "tech-news" },
            { label: "AI", slug: "ai" },
          ].map((cat) => (
            <Link
              key={cat.slug || "all"}
              href={cat.slug ? `/news?cat=${cat.slug}` : "/news"}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.slug || (!activeCategory && !cat.slug)
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {remainingNews.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remainingNews.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group block rounded-xl border border-border bg-surface overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
              >
                {article.image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <OptimizedImage
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      category={article.category}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {article.source && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {article.source}
                      </span>
                    )}
                    <TimeAgo date={article.date} />
                  </div>
                  <h3 className="font-heading text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <span className="text-4xl mb-3 block">📰</span>
            <p className="text-muted-foreground mb-2">No news articles yet</p>
            <p className="text-xs text-muted-foreground">Run the news scraper to fetch latest articles: <code className="bg-surface-hover px-1 py-0.5 rounded">npm run scrape-news</code></p>
          </div>
        )}
      </section>

      {/* TechVeb Blog News */}
      {latestBlogPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-border">
          <h2 className="font-heading text-xl font-bold mb-6">TechVeb Tech Coverage</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBlogPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} dir="blog" />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
