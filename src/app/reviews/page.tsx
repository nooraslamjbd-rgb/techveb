import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Product Reviews",
  description:
    "In-depth, honest product reviews on the latest tech gadgets, smartphones, laptops, and software. Make informed buying decisions.",
  alternates: { canonical: "https://techveb.com/reviews" },
};

export default function ReviewsPage() {
  const posts = getAllPosts("reviews");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Reviews" }]} />

      <div className="mb-10">
        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">Product Reviews</h1>
        <p className="max-w-2xl text-muted">
          Honest, in-depth reviews of the latest technology products. We test them
          so you can make the right choice.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} dir="reviews" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-lg text-muted">Reviews coming soon!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We are testing products and preparing detailed reviews for you.
          </p>
        </div>
      )}

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
