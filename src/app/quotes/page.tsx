import type { Metadata } from "next";
import Link from "next/link";
import quotesData from "@/data/quotes.json";

export const metadata: Metadata = {
  title: "Quotes - Motivational, Funny & Daily Quotes | TechVeb",
  description: "Browse inspiring quotes from the world greatest minds - motivational, life, love, wisdom, and more.",
  alternates: { canonical: "https://techveb.com/quotes" },
  openGraph: { title: "Quotes - TechVeb", description: "Browse inspiring quotes from famous personalities.", url: "https://techveb.com/quotes", type: "website", images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "Famous Quotes" }] },
  twitter: { card: "summary_large_image", title: "Quotes - TechVeb", description: "Browse inspiring quotes from famous personalities." },
};

interface Quote { text: string; author: string; category: string; likes: number; }
interface QuotesFile { quotes: Quote[]; }

function fmt(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n); }

const cats = [
  { name: "Motivation", icon: "fire", filter: "motivation", color: "#EF4444" },
  { name: "Life", icon: "seedling", filter: "life", color: "#10B981" },
  { name: "Love", icon: "heart", filter: "love", color: "#EC4899" },
  { name: "Wisdom", icon: "brain", filter: "wisdom", color: "#8B5CF6" },
  { name: "Humor", icon: "laugh", filter: "funny", color: "#F59E0B" },
  { name: "Success", icon: "trophy", filter: "success", color: "#3B82F6" },
  { name: "Science", icon: "atom", filter: "science", color: "#6366F1" },
  { name: "Philosophy", icon: "scroll", filter: "philosophy", color: "#8B5CF6" },
  { name: "Technology", icon: "cpu", filter: "technology", color: "#0EA5E9" },
  { name: "Leadership", icon: "crown", filter: "leadership", color: "#F59E0B" },
];

const catMap: Record<string, string> = { motivation: "fire", life: "seedling", love: "heart", wisdom: "brain", funny: "laugh", success: "trophy", science: "atom", philosophy: "scroll", technology: "cpu", leadership: "crown" };

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ cat?: string; author?: string }> }) {
  const sp = await searchParams;
  const { quotes } = quotesData as QuotesFile;
  let filtered = [...quotes];
  if (sp.cat) filtered = filtered.filter(q => q.category === sp.cat);
  if (sp.author) filtered = filtered.filter(q => q.author.toLowerCase().replace(/[^a-z0-9]+/g, "-") === sp.author);
  const list = filtered.length > 0 ? filtered : quotes;
  const trending = [...quotes].sort((a, b) => b.likes - a.likes).slice(0, 6);
  const topAuthors = [...new Set(quotes.map(q => q.author))].slice(0, 8);
  const linkCls = (active: boolean) => "rounded-xl border p-4 text-center transition-all " + (active ? "border-primary bg-primary/10 shadow-md" : "border-border bg-surface hover:border-primary/30 hover:shadow-md");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">Quotes Collection</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">Inspiring quotes from the world greatest minds</p>
        <p className="mt-2 text-sm text-muted-foreground">{list.length} quotes available</p>
      </div>
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Link href="/quotes" className={linkCls(!sp.cat && !sp.author)}>
          <span className="mb-2 block text-2xl">all</span>
          <p className="text-sm font-semibold text-foreground">All</p>
          <p className="text-xs text-muted-foreground">{quotes.length} quotes</p>
        </Link>
        {cats.slice(0, 9).map(cat => (
          <Link key={cat.filter} href={"/quotes?cat=" + cat.filter} className={linkCls(sp.cat === cat.filter)}>
            <span className="mb-2 block text-2xl">{cat.icon}</span>
            <p className="text-sm font-semibold text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{quotes.filter(q => q.category === cat.filter).length} quotes</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 p-6 sm:p-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Quote of the Day</span>
            <blockquote className="mt-4 mb-4 font-heading text-2xl font-bold leading-relaxed text-foreground sm:text-3xl">&ldquo;{quotes[0].text}&rdquo;</blockquote>
            <p className="text-lg text-primary">{"- " + quotes[0].author}</p>
          </div>
          <div className="space-y-4">
            {list.slice(0, 20).map((q: Quote, idx: number) => (
              <div key={idx} className="rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md">
                <blockquote className="mb-2 text-lg font-medium text-foreground">&ldquo;{q.text}&rdquo;</blockquote>
                <p className="text-sm text-primary">{"- " + q.author}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted-foreground border border-border">{catMap[q.category] || "quote"} {q.category}</span>
                  <span className="text-xs text-muted-foreground">{fmt(q.likes)} likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full shrink-0 space-y-6 lg:w-72">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Trending Quotes</h3>
            <div className="space-y-3">
              {trending.map((q, idx) => (
                <div key={idx} className="rounded-lg p-2 transition-colors hover:bg-background">
                  <p className="text-sm font-medium text-foreground line-clamp-2">&ldquo;{q.text}&rdquo;</p>
                  <p className="mt-1 text-xs text-primary">{"- " + q.author}</p>
                  <p className="text-xs text-muted-foreground">{fmt(q.likes)} likes</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Top Authors</h3>
            <div className="space-y-2">
              {topAuthors.map(author => (
                <Link key={author} href={"/quotes?author=" + author.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className={"flex items-center justify-between rounded-lg p-2 transition-colors " + (sp.author === author.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? "bg-primary/10 text-primary" : "hover:bg-background")}>
                  <span className="text-sm font-medium">{author}</span>
                  <span className="text-xs text-muted-foreground">{quotes.filter(q => q.author === author).length}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Quotes</span><span className="font-semibold">{quotes.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Categories</span><span className="font-semibold">{cats.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Likes</span><span className="font-semibold">{fmt(quotes.reduce((a, q) => a + q.likes, 0))}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
