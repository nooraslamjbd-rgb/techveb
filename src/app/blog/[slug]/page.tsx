import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OptimizedImage, { imageSizes } from "@/components/ui/OptimizedImage";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllPosts,
  getPost,
  formatDate,
  getPostsByCategory,
  getPostDescription,
} from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import AuthorBox from "@/components/blog/AuthorBox";
import RelatedArticles from "@/components/blog/RelatedArticles";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ShareButtons from "@/components/ui/ShareButtons";
import Comments from "@/components/ui/Comments";
import NewsletterInline from "@/components/ui/NewsletterInline";
import ArticleFeedback from "@/components/ui/ArticleFeedback";
import TimeAgo from "@/components/ui/TimeAgo";
import FAQ from "@/components/ui/FAQ";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return getAllPosts("blog").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("blog", slug);
  if (!post) return {};

  const description = getPostDescription(post);

  return {
    title: post.title,
    description,
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `${siteConfig.url}/blog/${slug}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      section: post.category,
      authors: [post.author || siteConfig.name],
      tags: post.tags,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("blog", slug);
  if (!post) notFound();

  const related = getPostsByCategory("blog", post.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.category === "tech-news" ? "NewsArticle" : "BlogPosting",
    headline: post.title,
    description: getPostDescription(post),
    author: { "@type": "Person", name: post.author || siteConfig.name },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    image: post.image ? (post.image.startsWith("http") ? post.image : `${siteConfig.url}${post.image.startsWith("/") ? "" : "/"}${post.image}`) : `https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png`,
    url: `${siteConfig.url}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/logo-square.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
    keywords: post.tags?.join(", "),
    articleSection: post.category,
    wordCount: Math.ceil(post.content.split(/\s+/).length),
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
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  const dir = "blog";

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <article className="mx-auto max-w-3xl px-0 sm:px-0">
          {post.image && (
            <div className="relative mb-6 sm:mb-8 aspect-[16/9] overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-border">
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
          {post.imageCredit && (
            <p className="-mt-4 mb-6 text-center text-xs text-muted-foreground">
              {post.imageCreditUrl ? (
                <>Photo: <a href={post.imageCreditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{post.imageCredit}</a></>
              ) : (
                <>Photo: {post.imageCredit}</>
              )}
            </p>
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
              <TimeAgo date={post.date} />
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
              <ShareButtons title={post.title} url={`/blog/${slug}`} description={post.description} />
            </div>
          </header>

          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
                    Key Takeaways
                  </h2>
                  <ul className="space-y-2">
                    {post.keyTakeaways.map((kt, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary font-bold shrink-0">→</span>
                        <span>{kt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

              <div className="mt-10">
                <ArticleFeedback />
              </div>

              {post.faq && post.faq.length > 0 && <FAQ items={post.faq} />}

              <NewsletterInline />

              <AuthorBox />

              <RelatedArticles posts={related} dir={dir} />
              <Comments slug={slug} />
              <div className="lg:hidden">
                <TableOfContents />
              </div>
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
