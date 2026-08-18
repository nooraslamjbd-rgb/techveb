import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsFromAllDirs, getDirFromCategory } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

const authors: Record<string, { name: string; bio: string; avatar?: string }> = {
  "techveb-team": {
    name: "TechVeb Team",
    bio: "The TechVeb team covers the latest in artificial intelligence, technology trends, product reviews, and digital innovation. Our collective expertise spans AI, cybersecurity, cloud computing, and consumer tech.",
  },
};

export async function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authors[slug];
  const name = author?.name || slug;
  return {
    title: `${name} - Author`,
    description: author?.bio || `Articles written by ${name} on TechVeb.`,
    alternates: { canonical: `${siteConfig.url}/author/${slug}` },
    openGraph: {
      title: `${name} - Author | ${siteConfig.name}`,
      description: author?.bio || `Articles written by ${name} on TechVeb.`,
      url: `${siteConfig.url}/author/${slug}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Author | ${siteConfig.name}`,
      description: author?.bio || `Articles written by ${name} on TechVeb.`,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authors[slug];
  const name = author?.name || slug;

  const allPosts = getAllPostsFromAllDirs();
  const posts = allPosts
    .filter((p) => p.author.toLowerCase() === name.toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${name} - Author at ${siteConfig.name}`,
    description: author?.bio || `Articles written by ${name}.`,
    url: `${siteConfig.url}/author/${slug}`,
    mainEntity: {
      "@type": "Person",
      name: name,
      description: author?.bio,
      worksFor: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: name },
          ]}
        />

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
            {name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="mb-2 font-heading text-3xl font-bold sm:text-4xl">{name}</h1>
            {author?.bio && (
              <p className="max-w-2xl text-muted">{author.bio}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {posts.length} article{posts.length !== 1 ? "s" : ""} published
            </p>
          </div>
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
            <p className="text-lg text-muted">No articles by this author yet.</p>
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
