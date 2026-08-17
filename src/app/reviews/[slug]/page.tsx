import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllPosts,
  getPost,
  formatDate,
  getPostsByCategory,
} from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import AuthorBox from "@/components/blog/AuthorBox";
import RelatedArticles from "@/components/blog/RelatedArticles";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/ui/ReadingProgress";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return getAllPosts("reviews").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("reviews", slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${siteConfig.name} Reviews`,
    description: post.description,
    alternates: { canonical: `${siteConfig.url}/reviews/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/reviews/${slug}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
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

export default async function ReviewPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("reviews", slug);
  if (!post) notFound();

  const related = getPostsByCategory("reviews", post.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    image: post.image || "/og-default.png",
    url: `${siteConfig.url}/reviews/${slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/reviews/${slug}`,
    },
    reviewBody: post.description,
    itemReviewed: {
      "@type": "Thing",
      name: post.title,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Reviews", item: `${siteConfig.url}/reviews` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Reviews", href: "/reviews" },
            { label: post.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          {post.image && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
              {post.imageCredit && (
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] text-muted-foreground">
                  {post.imageCreditUrl ? (
                    <a href={post.imageCreditUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      {post.imageCredit}
                    </a>
                  ) : (
                    post.imageCredit
                  )}
                </div>
              )}
            </div>
          )}

          <header className="mb-8">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {post.category}
            </span>
            <h1 className="mb-4 font-heading text-3xl font-bold leading-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mb-4 text-lg text-muted">{post.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updated && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Updated {formatDate(post.updated)}</span>
                </>
              )}
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{post.readingTime}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted-foreground border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
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

              <AuthorBox />
              <RelatedArticles posts={related} dir="reviews" />
            </div>
            <div className="hidden w-64 shrink-0 lg:block">
              <TableOfContents />
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
