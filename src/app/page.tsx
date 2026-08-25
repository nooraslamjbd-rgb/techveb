import type { Metadata } from "next";
import Link from "next/link";
import OptimizedImage, { imageSizes } from "@/components/ui/OptimizedImage";
import { getAllPosts, getAllNewsPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import HomeSearchBar from "@/components/ui/HomeSearchBar";
import TrendingTicker from "@/components/ui/TrendingTicker";
import LiveMarketTicker from "@/components/ui/LiveMarketTicker";
import LiveNewsTicker from "@/components/ui/LiveNewsTicker";
import CurrencyWidget from "@/components/ui/CurrencyWidget";
import GoldWidget from "@/components/ui/GoldWidget";
import CryptoWidget from "@/components/ui/CryptoWidget";
import WeatherWidget from "@/components/ui/WeatherWidget";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "TechVeb - Technology, AI & Innovation Hub" },
  description:
    "Your go-to source for the latest in technology, artificial intelligence, product reviews, and expert guides. Stay informed with 500+ in-depth articles.",
  alternates: { canonical: "https://techveb.com" },
  openGraph: {
    title: "TechVeb - Technology, AI & Innovation Hub",
    description:
      "Your go-to source for the latest in technology, artificial intelligence, product reviews, and expert guides.",
    url: "https://techveb.com",
    siteName: "TechVeb",
    type: "website",
    images: [{ url: "https://techveb.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechVeb - Technology, AI & Innovation Hub",
    description:
      "Your go-to source for the latest in technology, artificial intelligence, product reviews, and expert guides.",
    images: ["https://techveb.com/og-default.png"],
  },
};

export default function Home() {
  const blogPosts = getAllPosts("blog");
  const reviews = getAllPosts("reviews");
  const aiTools = getAllPosts("ai-tools");
  const newsPosts = getAllPosts("news");
  const allPosts = [...blogPosts, ...reviews, ...aiTools, ...newsPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = allPosts.find((p) => p.featured) || allPosts[0];
  const topNews = allPosts
    .filter((p) => p.category === "tech-news" && p.slug !== featured?.slug)
    .slice(0, 5);
  const latestPosts = allPosts
    .filter((p) => p.slug !== featured?.slug)
    .slice(0, 9);

  const aiPosts = allPosts
    .filter((p) => p.category === "ai" && p.slug !== featured?.slug)
    .slice(0, 4);

  const cyberPosts = allPosts
    .filter((p) => p.category === "cybersecurity")
    .slice(0, 4);

  const startupPosts = allPosts
    .filter((p) => p.category === "tech-news" && !topNews.find((t) => t.slug === p.slug) && p.slug !== featured?.slug)
    .slice(0, 4);

  const latestSidebar = allPosts
    .filter((p) => p.slug !== featured?.slug)
    .slice(0, 5);

  const latestNews = getAllNewsPosts().slice(0, 6);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo-square.png` },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <LiveNewsTicker />
      <LiveMarketTicker />
      <TrendingTicker />

      {/* Quick Links - News, Business, Sports, Education, Islam */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: "News", href: "/news", icon: "📰", color: "bg-red-500/10 hover:bg-red-500/20 text-red-600" },
            { label: "Business", href: "/business", icon: "💰", color: "bg-green-500/10 hover:bg-green-500/20 text-green-600" },
            { label: "Sports", href: "/sports", icon: "🏏", color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600" },
            { label: "Recipes", href: "/recipes", icon: "🍛", color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600" },
            { label: "Horoscope", href: "/horoscope", icon: "🔮", color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600" },
            { label: "Dictionary", href: "/dictionary", icon: "📖", color: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600" },
            { label: "Poetry", href: "/poetry", icon: "🪶", color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600" },
            { label: "Quotes", href: "/quotes", icon: "💬", color: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-600" },
            { label: "Jokes", href: "/jokes", icon: "😂", color: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600" },
            { label: "Education", href: "/education", icon: "🎓", color: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600" },
            { label: "Islam", href: "/islam", icon: "☪️", color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${item.color}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Hero - Story-led */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,96,224,0.15),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-8 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Technology &amp; AI Insights
            </div>
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Gateway to the{" "}
              <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                Future of Tech
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/70">
              Stay informed with the latest in artificial intelligence, technology
              trends, in-depth product reviews, and expert guides.
            </p>
            <HomeSearchBar />
          </div>
        </div>
      </section>

      {/* Main Content: Hero Story + Top Headlines */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Lead Story */}
          <div>
            {featured && (
              <Link
                href={`/${featured.dir}/${featured.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-border"
              >
                {featured.featured && (
                  <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Featured
                  </span>
                )}
                <div className="relative h-[260px] sm:h-[340px] lg:h-[420px] w-full">
                  {featured.image ? (
                    <OptimizedImage
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes={imageSizes.featured}
                      quality={80}
                      category={featured.category}
                      loading="eager"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8">
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
                    <h2 className="mb-2 font-heading text-2xl font-bold text-white sm:text-3xl group-hover:text-primary-light transition-colors">
                      {featured.title}
                    </h2>
                    <p className="max-w-2xl text-sm text-white/70 line-clamp-2 sm:text-base">
                      {featured.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/25 transition-colors">
                        Read Article
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                      <span className="font-medium text-white/70">{featured.author}</span>
                      <span>·</span>
                      <time dateTime={featured.date}>
                        {new Date(featured.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Top Headlines Sidebar */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10">
                <svg className="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </span>
              <h2 className="font-heading text-lg font-bold">Top Headlines</h2>
            </div>
            <div className="flex flex-1 flex-col gap-0 rounded-xl border border-border bg-surface overflow-hidden">
              {topNews.map((post, idx) => (
                <Link
                  key={post.slug}
                  href={`/${post.dir}/${post.slug}`}
                  className={`group flex gap-3 px-4 py-3.5 transition-colors hover:bg-surface-hover ${
                    idx < topNews.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-heading text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.readingTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category: AI & Machine Learning */}
      {aiPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0060E0]/10">
                <svg className="h-4 w-4 text-[#0060E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold sm:text-2xl">AI & Machine Learning</h2>
            </div>
            <Link
              href="/ai-tools"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aiPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                dir={post.dir}
              />
            ))}
          </div>
        </section>
      )}

      {/* Category: Cybersecurity */}
      {cyberPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EF4444]/10">
                <svg className="h-4 w-4 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold sm:text-2xl">Cybersecurity</h2>
            </div>
            <Link
              href="/blog?cat=cybersecurity"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cyberPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                dir={post.dir}
              />
            ))}
          </div>
        </section>
      )}

      {/* Category: Startups & Tech News */}
      {startupPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/10">
                <svg className="h-4 w-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold sm:text-2xl">Startups & Tech News</h2>
            </div>
            <Link
              href="/blog?cat=tech-news"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {startupPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                dir={post.dir}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold sm:text-2xl">Breaking News</h2>
            </div>
            <Link
              href="/news"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="group rounded-xl border border-border bg-surface p-4 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{post.source}</span>
                </div>
                <h3 className="font-heading text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.description}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {" · "}
                  {post.readingTime}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Most Read + Latest Articles side by side */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Latest Articles */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold sm:text-2xl">Latest Articles</h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.slice(0, 6).map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  dir={post.dir}
                />
              ))}
            </div>
          </div>

          {/* Most Read Sidebar */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="font-heading text-lg font-bold">Latest</h2>
            </div>
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              {latestSidebar.map((post, idx) => (
                <Link
                  key={post.slug}
                  href={`/${post.dir}/${post.slug}`}
                  className={`group flex gap-3 px-4 py-3 transition-colors hover:bg-surface-hover ${
                    idx < latestSidebar.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-heading text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.readingTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Preview */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <span className="text-lg">📊</span>
            </div>
            <h2 className="font-heading text-xl font-bold sm:text-2xl">Live Market Data</h2>
          </div>
          <Link
            href="/business"
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CurrencyWidget />
          <GoldWidget />
          <CryptoWidget />
          <WeatherWidget />
        </div>
      </section>

      {/* Explore Topics */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <h2 className="mb-6 sm:mb-8 font-heading text-xl font-bold sm:text-2xl">Explore Topics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {siteConfig.categories.map((cat) => {
            const href =
              cat.slug === "product-reviews"
                ? "/reviews"
                : cat.slug === "ai"
                ? "/ai-tools"
                : cat.slug === "blog"
                ? "/blog"
                : `/blog?cat=${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={href}
                className="group rounded-xl border border-border bg-surface p-4 sm:p-5 card-hover"
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
                    {cat.slug === "blog" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
                    {cat.slug === "coding" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                  </svg>
                </div>
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors text-sm sm:text-base">
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
