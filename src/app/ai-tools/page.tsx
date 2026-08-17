import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "AI Tools",
  description:
    "Discover the best AI tools and software for productivity, creativity, and automation. Expert comparisons and guides.",
  alternates: { canonical: "https://techveb.com/ai-tools" },
};

export default function AiToolsPage() {
  const posts = getAllPosts("ai-tools");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "AI Tools" }]} />

      <div className="mb-10">
        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">AI Tools &amp; Guides</h1>
        <p className="max-w-2xl text-muted">
          Your comprehensive guide to the best AI tools available today. From
          ChatGPT to image generators, we cover them all.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} dir="ai-tools" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-lg text-muted">AI Tool guides coming soon!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We are researching the best AI tools to bring you comprehensive guides.
          </p>
        </div>
      )}

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
