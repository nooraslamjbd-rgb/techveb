import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import ArticleCard from "@/components/blog/ArticleCard";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sports Hub - Cricket Live Scores & Sports News | TechVeb",
  description:
    "Live cricket scores, sports news, match schedules, and in-depth analysis. Stay updated with the latest in sports.",
  alternates: { canonical: "https://techveb.com/sports" },
  openGraph: {
    title: "Sports Hub - TechVeb",
    description: "Live cricket scores and sports news.",
    url: "https://techveb.com/sports",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "TechVeb" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Hub - TechVeb",
    description: "Live cricket scores and sports news.",
  },
};

export default function SportsPage() {
  const allPosts = getAllPosts("blog");
  const sportsPosts = allPosts
    .filter((p) => p.category === "tech-news" && (p.tags || []).some((t: string) => t.toLowerCase().includes("sport") || t.toLowerCase().includes("cricket") || t.toLowerCase().includes("gaming")))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sportsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sports Hub - TechVeb",
    description: "Live cricket scores and sports news",
    url: "https://techveb.com/sports",
  };

  return (
    <>
      <JsonLd data={sportsJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl mb-2">Sports Hub</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Live cricket scores, sports news, and match updates
          </p>
        </div>
      </section>

      {/* Live Match Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-green-600 dark:text-green-400 uppercase">Live Match</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] items-center">
            {/* Team 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-xl">
                PAK
              </div>
              <p className="font-heading font-bold text-lg">Pakistan</p>
              <p className="text-2xl font-bold text-foreground">171/10</p>
              <p className="text-xs text-muted-foreground">(48.1 overs)</p>
            </div>

            {/* VS */}
            <div className="text-center">
              <span className="text-3xl font-bold text-muted-foreground">VS</span>
              <p className="text-xs text-muted-foreground mt-1">England lead by 195 runs</p>
            </div>

            {/* Team 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                ENG
              </div>
              <p className="font-heading font-bold text-lg">England</p>
              <p className="text-2xl font-bold text-foreground">366/8</p>
              <p className="text-xs text-muted-foreground">(82.0 overs)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Upcoming Matches</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { team1: "AUS", team2: "IND", type: "2nd Test", date: "Aug 23, 2026", time: "9:30 PST" },
            { team1: "SL", team2: "BAN", type: "1st Test", date: "Aug 22, 2026", time: "5:30 PST" },
            { team1: "PAK", team2: "IRE", type: "T20I", date: "Aug 28, 2026", time: "7:00 PST" },
          ].map((match, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-surface p-4 hover:shadow-md transition-shadow">
              <p className="text-xs text-muted-foreground mb-2">{match.type}</p>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mb-1">
                    {match.team1}
                  </div>
                </div>
                <span className="text-xs font-bold text-muted-foreground">VS</span>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs mb-1">
                    {match.team2}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-muted-foreground">{match.date}</p>
                <p className="text-xs font-medium text-foreground">{match.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sports News */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="font-heading text-xl font-bold mb-6">Sports News</h2>
            {sportsPosts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sportsPosts.slice(0, 9).map((post) => (
                  <ArticleCard key={post.slug} post={post} dir="blog" />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-muted-foreground">Sports news coming soon! Stay tuned.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Quick Links</h3>
              <div className="space-y-2">
                {["Cricket", "Football", "Gaming", "Formula 1"].map((sport) => (
                  <Link
                    key={sport}
                    href={`/blog?q=${sport.toLowerCase()}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    → {sport}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
