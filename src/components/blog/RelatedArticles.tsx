import Link from "next/link";
import type { Post } from "@/lib/mdx";
import ArticleCard from "./ArticleCard";

export default function RelatedArticles({
  posts,
  dir,
}: {
  posts: Post[];
  dir: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-heading text-2xl font-bold">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <ArticleCard key={post.slug} post={post} dir={dir} />
        ))}
      </div>
    </section>
  );
}
