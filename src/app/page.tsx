import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import JsonLd from "@/components/seo/JsonLd";

export default function Home() {
  const blogPosts = getAllPosts("blog");
  const reviews = getAllPosts("reviews");
  const aiTools = getAllPosts("ai-tools");
  const allPosts = [...blogPosts, ...reviews, ...aiTools].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featured = allPosts.find((p) => p.featured) || allPosts[0];
  const latestPosts = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 6);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      contactType: "customer service",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={websiteJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,96,224,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Technology &amp; AI Insights
            </div>
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Gateway to the{" "}
              <span className="text-primary">Future of Tech</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted">
              Stay informed with the latest in artificial intelligence, technology
              trends, in-depth product reviews, and expert guides. Making technology
              accessible for everyone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Explore Articles
              </Link>
              <Link
                href="/ai-tools"
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-hover"
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
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
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
              className="group rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              style={
                {
                  "--cat-color": cat.color,
                } as React.CSSProperties
              }
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-sm"
                style={{ backgroundColor: cat.color }}
              >
                {cat.label.charAt(0)}
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
