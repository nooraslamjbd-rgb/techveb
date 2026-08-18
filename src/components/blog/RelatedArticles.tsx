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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Continue Reading</h2>
        <Link
          href={`/${dir}`}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          View all &rarr;
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <ArticleCard key={post.slug} post={post} dir={dir} />
        ))}
      </div>
    </section>
  );
}
