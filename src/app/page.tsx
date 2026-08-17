import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getDirFromCategory } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import HomeSearchBar from "@/components/ui/HomeSearchBar";

export default function Home() {
  const blogPosts = getAllPosts("blog");
  const reviews = getAllPosts("reviews");
  const aiTools = getAllPosts("ai-tools");
  const allPosts = [...blogPosts, ...reviews, ...aiTools].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = allPosts.find((p) => p.featured) || allPosts[0];
  const topNews = allPosts
    .filter((p) => p.category === "tech-news" && p.slug !== featured?.slug)
    .slice(0, 4);
  const latestPosts = allPosts
    .filter((p) => p.slug !== featured?.slug)
    .slice(0, 9);

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,96,224,0.15),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Technology &amp; AI Insights
            </div>
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Gateway to the{" "}
              <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                Future of Tech
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/70">
              Stay informed with the latest in artificial intelligence, technology
              trends, in-depth product reviews, and expert guides. Making technology
              accessible for everyone.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap mb-8">
              <Link
                href="/blog"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25"
              >
                Explore Articles
              </Link>
              <Link
                href="/ai-tools"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
              >
                AI Tools Guide
              </Link>
            </div>
          </div>
          <HomeSearchBar />
        </div>
      </section>

      {/* Featured Hero Card */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold sm:text-2xl">Featured</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <Link
            href={`/${getDirFromCategory(featured.category)}/${featured.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-border"
          >
            <div className="relative h-[220px] sm:h-[300px] lg:h-[400px] w-full">
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase text-white"
                    style={{
                      backgroundColor:
                        siteConfig.categories.find(
                          (c) => c.slug === featured.category
                        )?.color || "#0060E0",
                    }}
                  >
                    {siteConfig.categories.find((c) => c.slug === featured.category)?.label || featured.category}
                  </span>
                  <span className="text-sm text-white/60">{featured.readingTime}</span>
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold text-white sm:text-3xl group-hover:text-primary-light transition-colors">
                  {featured.title}
                </h3>
                <p className="max-w-2xl text-sm text-white/70 line-clamp-2 sm:text-base">
                  {featured.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Top News / Trending */}
      {topNews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-red-500/10">
              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <h2 className="font-heading text-xl font-bold sm:text-2xl">Trending Now</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topNews.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/${getDirFromCategory(post.category)}/${post.slug}`}
                className="group flex gap-3 sm:gap-4 rounded-xl border border-border bg-surface p-3 sm:p-4 card-hover"
              >
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-base sm:text-lg font-bold text-primary">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {post.readingTime} ·{" "}
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold sm:text-2xl">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                dir={getDirFromCategory(post.category)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <h2 className="mb-6 sm:mb-8 font-heading text-xl font-bold sm:text-2xl">Explore Topics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.categories.map((cat) => {
            const href =
              cat.slug === "product-reviews"
                ? "/reviews"
                : cat.slug === "ai"
                ? "/ai-tools"
                : "/blog";
            return (
              <Link
                key={cat.slug}
                href={href}
                className="group rounded-xl border border-border bg-surface p-4 sm:p-6 card-hover"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {cat.slug === "ai" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    {cat.slug === "tech-news" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
                    {cat.slug === "product-reviews" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                    {cat.slug === "tutorials" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                    {cat.slug === "cloud" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />}
                    {cat.slug === "cybersecurity" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                    {cat.slug === "gaming" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />}
                    {cat.slug === "emerging-tech" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                  </svg>
                </div>
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        <NewsletterCTA />
      </div>
    </>
  );
}
