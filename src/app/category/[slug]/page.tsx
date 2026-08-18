import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsFromAllDirs, getDirFromCategory } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import NewsletterCTA from "@/components/ui/NewsletterCTA";
import { siteConfig } from "@/config/site";

const categoryDescriptions: Record<string, string> = {
  ai: "Artificial intelligence is reshaping every industry. Stay updated on the latest AI models, breakthroughs, tools, and practical applications.",
  "tech-news": "Breaking technology news, product launches, funding rounds, and industry developments from the world of tech.",
  "product-reviews": "In-depth reviews and buying guides for the latest gadgets, software, and technology products.",
  tutorials: "Step-by-step programming tutorials, coding guides, and developer resources to level up your skills.",
  cloud: "Cloud computing news, guides, and reviews covering AWS, Azure, GCP, serverless, and DevOps.",
  cybersecurity: "Cybersecurity news, threat analysis, security best practices, and privacy protection guides.",
  gaming: "Gaming hardware, software, and technology coverage. Reviews, guides, and industry news for gamers.",
  "emerging-tech": "Quantum computing, blockchain, AR/VR, robotics, and other frontier technologies shaping tomorrow.",
  blog: "General technology commentary, opinion pieces, and industry analysis.",
  coding: "Software development tools, frameworks, libraries, and coding best practices.",
};

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
  const description = categoryDescriptions[slug] || `Explore all ${label} articles, guides, and reviews on TechVeb.`;
  return {
    title: `${label} - Technology News & Articles`,
    description,
    alternates: { canonical: `${siteConfig.url}/category/${slug}` },
    openGraph: {
      title: `${label} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/category/${slug}`,
      siteName: siteConfig.name,
      type: "website",
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
  const description = categoryDescriptions[slug] || `Explore all ${label} articles, guides, and reviews on TechVeb.`;

  const allPosts = getAllPostsFromAllDirs();
  const posts = allPosts
    .filter((p) => p.category === slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const dir = getDirFromCategory(slug);
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label} Articles`,
    description,
    url: `${siteConfig.url}/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: label },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
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
          <p className="max-w-2xl text-muted text-lg">{description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} article{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>

        {featuredPost && (
          <div className="mb-8">
            <ArticleCard post={featuredPost} dir={dir} featured />
          </div>
        )}

        {remainingPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} dir={dir} />
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
