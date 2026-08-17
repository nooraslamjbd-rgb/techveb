import Link from "next/link";
import Image from "next/image";
import { formatDate, type Post } from "@/lib/mdx";
import { siteConfig } from "@/config/site";

function getCategoryColor(category: string): string {
  const cat = siteConfig.categories.find(
    (c) => c.slug === category || c.label === category
  );
  return cat?.color || "#0060E0";
}

function getCategoryLabel(category: string): string {
  const cat = siteConfig.categories.find(
    (c) => c.slug === category || c.label === category
  );
  return cat?.label || category;
}

export default function ArticleCard({
  post,
  dir,
  featured = false,
}: {
  post: Post;
  dir: string;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={`/${dir}/${post.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      >
        {post.image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: getCategoryColor(post.category) }}
              >
                {getCategoryLabel(post.category)}
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          {!post.image && (
            <span
              className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: getCategoryColor(post.category) }}
            >
              {getCategoryLabel(post.category)}
            </span>
          )}
          <h2 className="mb-2 font-heading text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="mb-4 flex-1 text-muted line-clamp-3">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${dir}/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {post.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: getCategoryColor(post.category) }}
          >
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-xs text-muted-foreground">{post.readingTime}</span>
        </div>
        <h3 className="mb-2 font-heading text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-muted line-clamp-2">{post.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </Link>
  );
}
