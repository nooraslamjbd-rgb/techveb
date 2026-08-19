import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsFromAllDirs, getAllTags, getDirFromCategory } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  const allTags = getAllTags("blog")
    .concat(getAllTags("reviews"))
    .concat(getAllTags("ai-tools"));
  const uniqueTags = [...new Map(allTags.map((t) => [t.tag, t])).values()];
  return uniqueTags.map((t) => ({ tag: t.tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} Articles`,
    description: `All articles tagged with "${decoded}" on TechVeb.`,
    alternates: { canonical: `${siteConfig.url}/tags/${tag}` },
    openGraph: {
      title: `#${decoded} Articles | TechVeb`,
      description: `All articles tagged with "${decoded}" on TechVeb.`,
      url: `${siteConfig.url}/tags/${tag}`,
      siteName: "TechVeb",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `#${decoded} Articles | TechVeb`,
      description: `All articles tagged with "${decoded}" on TechVeb.`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const allPosts = getAllPostsFromAllDirs();
  const posts = allPosts
    .filter((p) => p.tags.some((t) => t.toLowerCase() === decoded.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${decoded}`,
    description: `All articles tagged with "${decoded}" on TechVeb.`,
    url: `${siteConfig.url}/tags/${tag}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: `#${decoded}` },
          ]}
        />

        <div className="mb-8">
          <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">
            #{decoded}
          </h1>
          <p className="max-w-2xl text-muted">
            {posts.length} article{posts.length !== 1 ? "s" : ""} tagged with &ldquo;{decoded}&rdquo;
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                dir={getDirFromCategory(post.category)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface py-16 text-center">
            <p className="text-lg text-muted">No articles with this tag yet.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
