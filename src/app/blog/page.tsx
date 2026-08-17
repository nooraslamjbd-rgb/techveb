import type { Metadata } from "next";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore the latest technology articles, AI insights, product reviews, and expert guides on TechVeb.",
  alternates: { canonical: "https://techveb.com/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts("blog");
  const categories = getAllCategories("blog");
  const tags = getAllTags("blog");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <div className="mb-10">
        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="max-w-2xl text-muted">
          Deep dives into technology, artificial intelligence, and the digital
          trends shaping our future.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.category}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {cat.category} ({cat.count})
            </span>
          ))}
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
          <p className="text-lg text-muted">Articles coming soon!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We are working on bringing you the best content.
          </p>
        </div>
      )}

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
