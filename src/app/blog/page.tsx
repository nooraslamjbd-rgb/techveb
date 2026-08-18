import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories, getPostsByCategory } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore the latest technology articles, AI insights, product reviews, and expert guides on TechVeb.",
  alternates: { canonical: "https://techveb.com/blog" },
};

function getCategoryLabel(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.label || cat;
}

function getCategoryColor(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.color || "#0060E0";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.cat || null;
  const query = params.q || "";

  const allPosts = getAllPosts("blog");
  const categories = getAllCategories("blog");

  let posts = activeCategory
    ? getPostsByCategory("blog", activeCategory)
    : allPosts;

  if (query) {
    const q = query.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const pageTitle = activeCategory
    ? `${getCategoryLabel(activeCategory)} Articles`
    : "Blog";

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: activeCategory
      ? `All articles in ${getCategoryLabel(activeCategory)} category on TechVeb.`
      : "Explore the latest technology articles, AI insights, and expert guides on TechVeb.",
    url: `${siteConfig.url}/blog${activeCategory ? `?cat=${activeCategory}` : ""}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const itemListJsonLd = posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 20).map((post, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${siteConfig.url}/blog/${post.slug}`,
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
                { label: "Blog", href: "/blog" },
                { label: getCategoryLabel(activeCategory) },
              ]
            : [{ label: "Blog" }]
        }
      />

      <div className="mb-8">
        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">
          {pageTitle}
        </h1>
        <p className="max-w-2xl text-muted">
          {activeCategory
            ? `Showing all articles in ${getCategoryLabel(activeCategory)}.`
            : "Deep dives into technology, artificial intelligence, and the digital trends shaping our future."}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
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
              href={`/blog?cat=${cat.category}`}
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

      {query && (
        <div className="mb-6 flex items-center gap-2 text-sm text-muted">
          <span>
            {posts.length} result{posts.length !== 1 ? "s" : ""} for &ldquo;
            {query}&rdquo;
          </span>
          <Link href="/blog" className="text-primary hover:underline">
            Clear
          </Link>
        </div>
      )}

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} dir="blog" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-lg text-muted">No articles found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCategory
              ? "Try a different category or browse all articles."
              : "We are working on bringing you the best content."}
          </p>
          {activeCategory && (
            <Link
              href="/blog"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Browse All Articles
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
