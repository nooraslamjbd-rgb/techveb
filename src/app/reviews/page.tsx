import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories, getPostsByCategory } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Product Reviews",
  description:
    "In-depth, honest product reviews on the latest tech gadgets, smartphones, laptops, and software. Make informed buying decisions.",
  alternates: { canonical: "https://techveb.com/reviews" },
  openGraph: {
    title: "Product Reviews | TechVeb",
    description: "In-depth, honest product reviews on the latest tech gadgets, smartphones, laptops, and software.",
    url: "https://techveb.com/reviews",
    siteName: "TechVeb",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "TechVeb" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Reviews | TechVeb",
    description: "In-depth, honest product reviews on the latest tech gadgets, smartphones, laptops, and software.",
  },
};

const PAGE_SIZE = 25;

function getCategoryLabel(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.label || cat;
}

function getCategoryColor(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.color || "#0060E0";
}

function buildHref(base: string, params: Record<string, string | null>) {
  const entries = Object.entries(params).filter(([, v]) => v);
  const qs = entries.length ? "?" + new URLSearchParams(entries as [string, string][]).toString() : "";
  return base + qs;
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.cat || null;
  const sort = params.sort === "oldest" ? "oldest" : params.sort === "title" ? "title" : "newest";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const allPosts = getAllPosts("reviews");
  const categories = getAllCategories("reviews");

  let posts = activeCategory
    ? getPostsByCategory("reviews", activeCategory)
    : allPosts;

  if (sort === "oldest") posts = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  else if (sort === "title") posts = [...posts].sort((a, b) => a.title.localeCompare(b.title));

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = posts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: activeCategory ? `${getCategoryLabel(activeCategory)} Reviews` : "Product Reviews",
    description: activeCategory
      ? `All ${getCategoryLabel(activeCategory)} reviews on TechVeb.`
      : "In-depth, honest product reviews on the latest tech gadgets, smartphones, laptops, and software.",
    url: `${siteConfig.url}/reviews${activeCategory ? `?cat=${activeCategory}` : ""}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const itemListJsonLd = paginatedPosts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Product Reviews",
    numberOfItems: paginatedPosts.length,
    itemListElement: paginatedPosts.map((post, idx) => ({
      "@type": "ListItem",
      position: (safePage - 1) * PAGE_SIZE + idx + 1,
      url: `${siteConfig.url}/reviews/${post.slug}`,
      name: post.title,
    })),
  } : null;

  const sortParams: Record<string, string | null> = { cat: activeCategory, sort: sort !== "newest" ? sort : null };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Breadcrumbs
        items={
          activeCategory
            ? [
                { label: "Reviews", href: "/reviews" },
                { label: getCategoryLabel(activeCategory) },
              ]
            : [{ label: "Reviews" }]
        }
      />

      <div className="mb-8">
        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">
          {activeCategory
            ? `${getCategoryLabel(activeCategory)} Reviews`
            : "Product Reviews"}
        </h1>
        <p className="max-w-2xl text-muted">
          {activeCategory
            ? `Showing all ${getCategoryLabel(activeCategory)} reviews.`
            : "Honest, in-depth reviews of the latest technology products. We test them so you can make the right choice."}
        </p>
      </div>

      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/reviews"
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            All ({allPosts.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/reviews?cat=${cat.category}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat.category
                  ? "text-white"
                  : "hover:opacity-80"
              }`}
              style={{
                backgroundColor:
                  activeCategory === cat.category
                    ? getCategoryColor(cat.category)
                    : `${getCategoryColor(cat.category)}15`,
                color:
                  activeCategory === cat.category
                    ? "#fff"
                    : getCategoryColor(cat.category),
              }}
            >
              {getCategoryLabel(cat.category)} ({cat.count})
            </Link>
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {posts.length} review{posts.length !== 1 ? "s" : ""}
          {safePage > 1 && ` — page ${safePage} of ${totalPages}`}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">Sort:</span>
          {(["newest", "oldest", "title"] as const).map((s) => (
            <Link
              key={s}
              href={buildHref("/reviews", { ...sortParams, page: null, sort: s === "newest" ? null : s })}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${sort === s ? "bg-primary text-white" : "bg-surface text-muted-foreground hover:text-foreground"}`}
            >
              {s === "newest" ? "Newest" : s === "oldest" ? "Oldest" : "A\u2013Z"}
            </Link>
          ))}
        </div>
      </div>

      {paginatedPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} dir="reviews" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-lg text-muted">No reviews found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCategory
              ? "Try a different category or browse all reviews."
              : "We are testing products and preparing detailed reviews for you."}
          </p>
          {activeCategory && (
            <Link
              href="/reviews"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Browse All Reviews
            </Link>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
          {safePage > 1 && (
            <Link href={buildHref("/reviews", { ...sortParams, page: String(safePage - 1) })} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              &larr; Prev
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2).map((p, i, arr) => (
            <span key={p} className="flex items-center">
              {i > 0 && p - arr[i - 1] > 1 && <span className="px-1 text-muted-foreground">...</span>}
              <Link href={buildHref("/reviews", { ...sortParams, page: p === 1 ? null : String(p) })} className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${p === safePage ? "bg-primary text-white" : "bg-surface text-muted-foreground hover:text-foreground"}`}>
                {p}
              </Link>
            </span>
          ))}
          {safePage < totalPages && (
            <Link href={buildHref("/reviews", { ...sortParams, page: String(safePage + 1) })} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Next &rarr;
            </Link>
          )}
        </nav>
      )}

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
    </>
  );
}
