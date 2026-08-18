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

function ImageFallback({ title, category }: { title: string; category: string }) {
  const color = getCategoryColor(category);
  return (
    <div
      className="flex h-full w-full items-center justify-center p-6"
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}
    >
      <span className="text-center font-heading text-lg font-bold leading-snug opacity-60" style={{ color }}>
        {title}
      </span>
    </div>
  );
}

export default function ArticleCard({
  post,
  dir,
  featured = false,
  compact = false,
}: {
  post: Post;
  dir: string;
  featured?: boolean;
  compact?: boolean;
}) {
  const href = `/${dir}/${post.slug}`;

  if (featured) {
    return (
      <Link
        href={href}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all card-hover gradient-border"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          ) : (
            <ImageFallback title={post.title} category={post.category} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg"
              style={{ backgroundColor: getCategoryColor(post.category) }}
            >
              {getCategoryLabel(post.category)}
            </span>
            <span className="text-xs text-white/80">{post.readingTime}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="mb-2 font-heading text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="mb-4 flex-1 text-muted line-clamp-3">{post.description}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </div>
      </Link>
    );
  }

  if (compact) {
    return (
      <Link
        href={href}
        className="group flex gap-3 rounded-xl border border-border bg-surface p-3 transition-all card-hover"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="64px"
            />
          ) : (
            <ImageFallback title={post.title} category={post.category} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {post.readingTime} · {formatDate(post.date)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all card-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <ImageFallback title={post.title} category={post.category} />
        )}
      </div>
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
          <span className="font-medium text-foreground">{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </Link>
  );
}
