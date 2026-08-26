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
import PageLang from "@/components/seo/PageLang";

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

  // FAQ structured data for AEO
  const faqJsonLd = post.faq && post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <PageLang lang={post.language === "ur" ? "ur" : "en"} dir={post.language === "ur" ? "rtl" : "ltr"} />
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "News", href: "/news" },
            { label: post.title },
          ]}
        />

        <article className="mx-auto max-w-3xl" lang={post.language === "ur" ? "ur" : undefined} dir={post.language === "ur" ? "rtl" : undefined}>
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
              {/* Key Takeaways (GEO optimized) */}
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

              {/* FAQ Section (AEO optimized) */}
              {post.faq && post.faq.length > 0 && (
                <div className="mt-8 rounded-xl border border-border bg-surface p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {post.faq.map((item, i) => (
                      <details key={i} className="group border border-border rounded-lg">
                        <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-sm hover:bg-surface-hover transition-colors">
                          <span>{item.question}</span>
                          <svg className="w-5 h-5 text-muted-foreground shrink-0 ml-2 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </summary>
                        <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <NewsletterInline />
              </div>
              <AuthorBox />
              <div className="lg:hidden">
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
