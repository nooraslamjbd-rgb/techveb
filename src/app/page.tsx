import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";

export default function Home() {
  const blogPosts = getAllPosts("blog");
  const reviews = getAllPosts("reviews");
  const aiTools = getAllPosts("ai-tools");
  const allPosts = [...blogPosts, ...reviews, ...aiTools].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featured = allPosts.find((p) => p.featured) || allPosts[0];
  const latestPosts = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
            <div className="flex flex-wrap gap-3">
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
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Featured</h2>
            <Link href="/blog" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              View all &rarr;
            </Link>
          </div>
          <ArticleCard
            post={featured}
            dir={featured.category === "product-reviews" ? "reviews" : featured.category === "ai" ? "ai-tools" : "blog"}
            featured
          />
        </section>
      )}

      {/* Latest Articles */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-heading text-2xl font-bold">Latest Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => {
              const dir =
                post.category === "product-reviews"
                  ? "reviews"
                  : post.category === "ai"
                  ? "ai-tools"
                  : "blog";
              return <ArticleCard key={post.slug} post={post} dir={dir} />;
            })}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-heading text-2xl font-bold">Explore Topics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={
                cat.slug === "product-reviews"
                  ? "/reviews"
                  : cat.slug === "ai"
                  ? "/ai-tools"
                  : "/blog"
              }
              className="group rounded-xl border border-border bg-surface p-6 card-hover"
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
                </svg>
              </div>
              <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                {cat.label}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NewsletterCTA />
      </div>
    </>
  );
}
