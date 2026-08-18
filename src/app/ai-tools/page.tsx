import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories, getPostsByCategory } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "AI Tools",
  description:
    "Discover the best AI tools and software for productivity, creativity, and automation. Expert comparisons and guides.",
  alternates: { canonical: "https://techveb.com/ai-tools" },
};

function getCategoryLabel(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.label || cat;
}

function getCategoryColor(cat: string): string {
  const found = siteConfig.categories.find((c) => c.slug === cat);
  return found?.color || "#0060E0";
}

export default async function AiToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.cat || null;

  const allPosts = getAllPosts("ai-tools");
  const categories = getAllCategories("ai-tools");

  const posts = activeCategory
    ? getPostsByCategory("ai-tools", activeCategory)
    : allPosts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Breadcrumbs
        items={
          activeCategory
            ? [
                { label: "AI Tools", href: "/ai-tools" },
                { label: getCategoryLabel(activeCategory) },
              ]
            : [{ label: "AI Tools" }]
        }
      />

      <div className="mb-8">
        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">
          {activeCategory
            ? `${getCategoryLabel(activeCategory)} AI Tools`
            : "AI Tools & Guides"}
        </h1>
        <p className="max-w-2xl text-muted">
          {activeCategory
            ? `Showing all ${getCategoryLabel(activeCategory)} AI tool guides.`
            : "Your comprehensive guide to the best AI tools available today. From ChatGPT to image generators, we cover them all."}
        </p>
      </div>

      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/ai-tools"
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
              href={`/ai-tools?cat=${cat.category}`}
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
            <ArticleCard key={post.slug} post={post} dir="ai-tools" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-lg text-muted">No AI tool guides found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCategory
              ? "Try a different category or browse all guides."
              : "We are researching the best AI tools to bring you comprehensive guides."}
          </p>
          {activeCategory && (
            <Link
              href="/ai-tools"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Browse All AI Tools
            </Link>
          )}
        </div>
      )}

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
