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
};

function getCategoryLabel(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.label || cat;
}

function getCategoryColor(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.color || "#0060E0";
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.cat || null;

  const allPosts = getAllPosts("reviews");
  const categories = getAllCategories("reviews");

  const posts = activeCategory
    ? getPostsByCategory("reviews", activeCategory)
    : allPosts;

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

  const itemListJsonLd = posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Product Reviews",
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 20).map((post, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${siteConfig.url}/reviews/${post.slug}`,
      name: post.title,
    })),
  } : null;

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

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
    </>
  );
}
