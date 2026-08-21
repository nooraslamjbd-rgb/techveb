import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OptimizedImage, { imageSizes } from "@/components/ui/OptimizedImage";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllNewsPosts,
  getNewsPost,
  formatDate,
} from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import AuthorBox from "@/components/blog/AuthorBox";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ShareButtons from "@/components/ui/ShareButtons";
import NewsletterInline from "@/components/ui/NewsletterInline";
import TimeAgo from "@/components/ui/TimeAgo";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return getAllNewsPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | TechVeb News`,
    description: post.description,
    alternates: { canonical: `${siteConfig.url}/news/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/news/${slug}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [{ url: "/og-default.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : ["/og-default.png"],
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: post.source || "TechVeb News" },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    image: post.image
      ? (post.image.startsWith("http") ? post.image : `${siteConfig.url}${post.image.startsWith("/") ? "" : "/"}${post.image}`)
      : `${siteConfig.url}/og-default.png`,
    url: `${siteConfig.url}/news/${slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo-square.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/news/${slug}`,
    },
    keywords: post.tags?.join(", "),
    isBasedOn: post.sourceLink,
    citation: post.sourceLink,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".prose", "h1"],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "News", item: `${siteConfig.url}/news` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  const relatedPosts = getAllNewsPosts()
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "News", href: "/news" },
            { label: post.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          {post.image && (
            <div className="relative mb-6 sm:mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
              <OptimizedImage
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes={imageSizes.hero}
                quality={85}
                category={post.category}
                loading="eager"
              />
            </div>
          )}

          <header className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 uppercase">
                News
              </span>
              {post.source && (
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                  via {post.source}
                </span>
              )}
            </div>
            <h1 className="mb-4 font-heading text-3xl font-bold leading-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mb-4 text-lg text-muted">{post.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <TimeAgo date={post.date} />
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{post.readingTime}</span>
            </div>

            {post.sourceLink && (
              <div className="mt-4 rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Originally reported by</span>
                  <a
                    href={post.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {post.source || "Source"} ↗
                  </a>
                </div>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted-foreground border border-border hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4">
              <ShareButtons title={post.title} url={`/news/${slug}`} description={post.description} />
            </div>
          </header>

          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <div className="prose max-w-none">
                <MDXRemote
                  source={post.content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                />
              </div>

              {post.sourceLink && (
                <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Want the complete story? Read the full article at the original source.
                  </p>
                  <a
                    href={post.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    Read Full Article on {post.source} ↗
                  </a>
                </div>
              )}

              <NewsletterInline />
              <AuthorBox />
              <div className="xl:hidden">
                <TableOfContents />
              </div>
            </div>
            <div className="hidden w-64 shrink-0 lg:block">
              <TableOfContents />
            </div>
          </div>

          {/* Related News */}
          {relatedPosts.length > 0 && (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="font-heading text-xl font-bold mb-6">More {post.category} News</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/news/${rp.slug}`}
                    className="group rounded-xl border border-border bg-surface p-4 hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <h3 className="font-heading text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{rp.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{rp.source}</span>
                      <span>·</span>
                      <TimeAgo date={rp.date} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
