import type { Metadata } from "next";
import Link from "next/link";
import poemsData from "@/data/poetry.json";

export const metadata: Metadata = {
  title: "Poetry - Ghazals, Nazms & Shayari | TechVeb",
  description: "Read the finest Urdu and English poetry - Ghazals, Nazms, and Couplets from legendary poets.",
  alternates: { canonical: "https://techveb.com/poetry" },
  openGraph: { title: "Poetry - TechVeb", description: "Read the finest Urdu and English poetry.", url: "https://techveb.com/poetry", type: "website", images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "Urdu & English Poetry" }] },
  twitter: { card: "summary_large_image", title: "Poetry - TechVeb", description: "Read the finest Urdu and English poetry.", images: ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"] },
};

interface Poem { title: string; poet: string; type: string; language: string; lines: string[]; meaning: string; tags: string[]; likes: number; }

function slugify(n: string) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function fmt(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n); }

const poetsMeta = [
  { name: "Mirza Ghalib", era: "1797-1869" }, { name: "Allama Iqbal", era: "1877-1938" },
  { name: "Faiz Ahmed Faiz", era: "1911-1984" }, { name: "Mir Taqi Mir", era: "1723-1810" },
  { name: "Ahmad Faraz", era: "1931-2008" }, { name: "Parveen Shakir", era: "1952-1994" },
  { name: "John Elia", era: "1931-2002" }, { name: "Rumi", era: "1207-1273" },
  { name: "Robert Frost", era: "1874-1963" }, { name: "Emily Dickinson", era: "1830-1886" },
  { name: "Shakespeare", era: "1564-1616" }, { name: "Kabir Das", era: "1398-1518" },
  { name: "Bulleh Shah", era: "1680-1758" }, { name: "William Butler Yeats", era: "1865-1939" },
  { name: "Langston Hughes", era: "1901-1967" }, { name: "Rabindranath Tagore", era: "1861-1941" },
  { name: "Josh Malihabadi", era: "1898-1982" },
];

export default async function PoetryPage({ searchParams }: { searchParams: Promise<{ poet?: string; type?: string; lang?: string; tag?: string }> }) {
  const sp = await searchParams;
  const poems = poemsData as Poem[];
  let f = [...poems];
  if (sp.poet) f = f.filter(p => slugify(p.poet) === sp.poet);
  if (sp.type) f = f.filter(p => p.type === sp.type);
  if (sp.lang) f = f.filter(p => p.language === sp.lang);
  if (sp.tag) f = f.filter(p => p.tags.includes(sp.tag!));
  const types = ["ghazal","nazm","couplet","sher","sonnet"];
  const tc = types.reduce((a: Record<string,number>, t) => { a[t] = poems.filter(p => p.type === t).length; return a; }, {});
  const allTags = [...new Set(poems.flatMap(p => p.tags))].sort();
  const feat = f[0] || poems[0];
  const list = f.length > 0 ? f : poems;
  const linkCls = (active: boolean) => "rounded-full border px-4 py-1.5 text-sm font-medium transition-all " + (active ? "border-primary bg-primary text-white" : "border-border bg-surface hover:border-primary/30");
  const noFilter = !sp.type && !sp.lang && !sp.tag && !sp.poet;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">Poetry & Shayari</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">The finest Urdu and English poetry from legendary and contemporary poets</p>
        <p className="mt-2 text-sm text-muted-foreground">{list.length} poems available</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/poetry" className={linkCls(noFilter)}>All ({poems.length})</Link>
        {types.map(t => (<Link key={t} href={"/poetry?type=" + t} className={linkCls(sp.type === t)}>{t.charAt(0).toUpperCase() + t.slice(1)} ({tc[t]})</Link>))}
        <Link href="/poetry?lang=english" className={linkCls(sp.lang === "english")}>English ({poems.filter(p => p.language === "english").length})</Link>
        <Link href="/poetry?lang=urdu" className={linkCls(sp.lang === "urdu")}>Urdu ({poems.filter(p => p.language === "urdu").length})</Link>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 p-6 sm:p-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Featured</span>
            <h2 className="mt-2 mb-2 font-heading text-2xl font-bold text-foreground">{feat.title}</h2>
            <p className="mb-4 text-sm text-primary">{feat.poet}</p>
            <div className={"space-y-1 leading-relaxed text-foreground/90 " + (feat.language === "urdu" ? "font-urdu text-lg" : "text-base")} dir={feat.language === "urdu" ? "rtl" : "ltr"}>
              {feat.lines.map((line: string, i: number) => line === "" ? <div key={i} className="h-3" /> : <p key={i} className={feat.language === "urdu" ? "font-heading" : ""}>{line}</p>)}
            </div>
            {feat.meaning && <div className="mt-4 rounded-lg bg-background/50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meaning</p><p className="mt-1 text-sm text-muted">{feat.meaning}</p></div>}
            <p className="mt-3 text-sm text-muted-foreground">{fmt(feat.likes)} likes</p>
          </div>
          <div className="space-y-6">
            {list.slice(1).map((poem: Poem, idx: number) => (
              <div key={idx} className="rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-500">{poem.type}</span>
                  {poem.language === "english" && <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">English</span>}
                  {poem.tags.slice(0, 2).map((tag: string) => (<Link key={tag} href={"/poetry?tag=" + tag} className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary">{"#" + tag}</Link>))}
                </div>
                <h3 className="mb-1 font-heading text-xl font-bold text-foreground">{poem.title}</h3>
                <p className="mb-3 text-sm text-primary">{poem.poet}</p>
                <div className={"space-y-1 leading-relaxed text-foreground/90 " + (poem.language === "urdu" ? "font-urdu text-lg" : "text-base")} dir={poem.language === "urdu" ? "rtl" : "ltr"}>
                  {poem.lines.map((line: string, i: number) => line === "" ? <div key={i} className="h-3" /> : <p key={i} className={poem.language === "urdu" ? "font-heading" : ""}>{line}</p>)}
                </div>
                {poem.meaning && <div className="mt-3 rounded-lg bg-background/50 p-3"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meaning</p><p className="mt-1 text-sm text-muted">{poem.meaning}</p></div>}
                <p className="mt-3 text-sm text-muted-foreground">{fmt(poem.likes)} likes</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full shrink-0 space-y-6 lg:w-72">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Famous Poets</h3>
            <div className="space-y-2">
              {poetsMeta.map(pm => {
                const count = poems.filter(p => p.poet === pm.name).length;
                return (
                  <Link key={pm.name} href={"/poetry?poet=" + slugify(pm.name)} className={"flex items-center justify-between rounded-lg p-2 transition-colors " + (sp.poet === slugify(pm.name) ? "bg-primary/10 text-primary" : "hover:bg-background")}>
                    <span className="text-sm font-semibold">{pm.name}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map(tag => (
                <Link key={tag} href={"/poetry?tag=" + tag} className={"rounded-full border px-3 py-1 text-xs transition-all " + (sp.tag === tag ? "border-primary bg-primary text-white" : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary")}>{"#" + tag}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
