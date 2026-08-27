import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsFromAllDirs } from "@/lib/mdx";
import { getCategoryMeta, getCategoryJsonLd } from "@/lib/category-utils";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return siteConfig.categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = siteConfig.categories.find((c) => c.slug === slug);
  const label = cat?.label || slug;
  const meta = getCategoryMeta(slug);
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `${siteConfig.url}/category/${slug}` },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `${siteConfig.url}/category/${slug}`,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitterTitle,
      description: meta.twitterDescription,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = siteConfig.categories.find((c) => c.slug === slug);
  const label = cat?.label || slug;
  const color = cat?.color || "#0060E0";
  const meta = getCategoryMeta(slug);
  const categoryUrl = `${siteConfig.url}/category/${slug}`;

  const allPosts = getAllPostsFromAllDirs();
  const posts = allPosts
    .filter((p) => p.category === slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const jsonLd = getCategoryJsonLd(slug, categoryUrl);

  const itemListJsonLd = posts.slice(0, 12).map((post, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${siteConfig.url}/${post.dir}/${post.slug}`,
    name: post.title,
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: meta.schemaName, item: categoryUrl },
    ],
  };

  const postsJsonLd = itemListJsonLd.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${label} articles on ${siteConfig.name}`,
        itemListElement: itemListJsonLd,
      }
    : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      {postsJsonLd && <JsonLd data={postsJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: label },
          ]}
        />

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-sm"
              style={{ backgroundColor: color }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">{label}</h1>
          </div>
          <p className="max-w-2xl text-muted text-lg">{meta.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} article{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>

        {featuredPost && (
          <div className="mb-8">
            <ArticleCard post={featuredPost} dir={featuredPost.dir} featured />
          </div>
        )}

        {remainingPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} dir={post.dir} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface py-16 text-center">
            <p className="text-lg text-muted">No more articles in this category yet.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        )}

        <div className="mt-12">
          <NewsletterCTA />
        </div>
      </div>
    </>
  );
}
