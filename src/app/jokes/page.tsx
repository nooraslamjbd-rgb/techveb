import type { Metadata } from "next";
import Link from "next/link";
import jokesData from "@/data/jokes.json";

export const metadata: Metadata = {
  title: "Jokes & Humor - Funny Jokes, Memes & Puns | TechVeb",
  description: "Enjoy the best collection of jokes, puns, and humor. Tech jokes, dad jokes, programming jokes, and more.",
  alternates: { canonical: "https://techveb.com/jokes" },
  openGraph: { title: "Jokes & Humor - TechVeb", description: "Enjoy the best collection of jokes, puns, and humor.", url: "https://techveb.com/jokes", type: "website" },
  twitter: { card: "summary_large_image", title: "Jokes & Humor - TechVeb", description: "Enjoy the best collection of jokes, puns, and humor." },
};

interface Joke { setup: string; punchline: string; category: string; rating: number; likes: number; }

function fmt(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n); }

const catMeta: Record<string, { label: string; icon: string; color: string }> = {
  tech: { label: "Tech", icon: "laptop", color: "bg-blue-500/10 text-blue-600" },
  dad: { label: "Dad Jokes", icon: "laugh", color: "bg-amber-500/10 text-amber-600" },
  science: { label: "Science", icon: "atom", color: "bg-purple-500/10 text-purple-600" },
  oneliner: { label: "One-Liner", icon: "zap", color: "bg-green-500/10 text-green-600" },
  animal: { label: "Animal", icon: "paw", color: "bg-orange-500/10 text-orange-600" },
  programming: { label: "Programming", icon: "code", color: "bg-cyan-500/10 text-cyan-600" },
};

export default async function JokesPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const sp = await searchParams;
  const jokes = jokesData as Joke[];
  let filtered = sp.cat ? jokes.filter(j => j.category === sp.cat) : [...jokes];
  if (filtered.length === 0) filtered = [...jokes];
  const categories = [...new Set(jokes.map(j => j.category))].sort();
  const catCounts = categories.reduce((a: Record<string, number>, c) => { a[c] = jokes.filter(j => j.category === c).length; return a; }, {});
  const featured = jokes[0];
  const popular = [...jokes].sort((a, b) => b.likes - a.likes).slice(0, 6);
  const linkCls = (active: boolean) => "rounded-xl border p-4 text-center transition-all " + (active ? "border-primary bg-primary/10 shadow-md" : "border-border bg-surface hover:border-primary/30 hover:shadow-md");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">Jokes & Humor</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">The best collection of jokes to brighten your day</p>
        <p className="mt-2 text-sm text-muted-foreground">{filtered.length} jokes available</p>
      </div>
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Link href="/jokes" className={linkCls(!sp.cat)}>
          <span className="mb-2 block text-2xl">all</span>
          <p className="text-sm font-semibold text-foreground">All</p>
          <p className="text-xs text-muted-foreground">{jokes.length} jokes</p>
        </Link>
        {categories.map(cat => {
          const meta = catMeta[cat] || { label: cat, icon: "smile", color: "bg-gray-500/10 text-gray-600" };
          return (
            <Link key={cat} href={"/jokes?cat=" + cat} className={linkCls(sp.cat === cat)}>
              <span className={"mb-2 block text-2xl"}>{meta.icon}</span>
              <p className="text-sm font-semibold text-foreground">{meta.label}</p>
              <p className="text-xs text-muted-foreground">{catCounts[cat]} jokes</p>
            </Link>
          );
        })}
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-amber-500/5 to-purple-500/5 p-6 sm:p-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Joke of the Day</span>
            <p className="mt-4 text-2xl font-bold text-foreground">{featured.setup}</p>
            <p className="mt-3 text-lg font-medium text-primary">{featured.punchline}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={"rounded-full px-2.5 py-0.5 text-xs font-semibold " + (catMeta[featured.category]?.color || "bg-gray-100 text-gray-600")}>{featured.category}</span>
              <span className="text-sm text-muted-foreground">{fmt(featured.likes)} likes</span>
            </div>
          </div>
          <div className="space-y-4">
            {filtered.slice(0, 20).map((joke: Joke, idx: number) => (
              <div key={idx} className="rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={"rounded-full px-2.5 py-0.5 text-xs font-semibold " + (catMeta[joke.category]?.color || "bg-gray-100 text-gray-600")}>{joke.category}</span>
                  <span className="text-xs text-muted-foreground">{fmt(joke.likes)} likes</span>
                </div>
                <p className="text-lg font-bold text-foreground">{joke.setup}</p>
                <p className="mt-2 text-base font-medium text-primary">{joke.punchline}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full shrink-0 space-y-6 lg:w-72">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Most Popular</h3>
            <div className="space-y-3">
              {popular.map((joke, idx) => (
                <div key={idx} className="rounded-lg p-2 transition-colors hover:bg-background">
                  <p className="text-sm font-medium text-foreground">{joke.setup}</p>
                  <p className="mt-1 text-sm text-primary">{joke.punchline}</p>
                  <p className="text-xs text-muted-foreground">{fmt(joke.likes)} likes</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Jokes</span><span className="font-semibold">{jokes.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Categories</span><span className="font-semibold">{categories.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Likes</span><span className="font-semibold">{fmt(jokes.reduce((a, j) => a + j.likes, 0))}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
