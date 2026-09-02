import type { Metadata } from "next";
import Link from "next/link";
import recipesData from "@/data/recipes.json";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pakistani Recipes - Delicious Food Recipes | TechVeb",
  description: "Discover authentic Pakistani recipes - Biryani, Karahi, Haleem, Nihari, and more. Easy step-by-step cooking guides.",
  alternates: { canonical: "https://techveb.com/recipes" },
  openGraph: { title: "Pakistani Recipes - TechVeb", description: "Authentic Pakistani food recipes with step-by-step guides.", url: "https://techveb.com/recipes", type: "website", images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "Pakistani Recipes" }] },
  twitter: { card: "summary_large_image", title: "Pakistani Recipes - TechVeb", description: "Authentic Pakistani food recipes with step-by-step guides.", images: ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"] },
};

interface Recipe { name: string; category: string; time: string; servings: string; difficulty: string; rating: number; reviews: number; description: string; ingredients: number; }

const catMeta: Record<string, { icon: string; color: string }> = {
  Biryani: { icon: "rice", color: "bg-amber-500/10 text-amber-600" },
  Karahi: { icon: "pot", color: "bg-red-500/10 text-red-600" },
  BBQ: { icon: "fire", color: "bg-orange-500/10 text-orange-600" },
  "Nihari Haleem": { icon: "soup", color: "bg-yellow-500/10 text-yellow-600" },
  Daal: { icon: "bowl", color: "bg-yellow-500/10 text-yellow-600" },
  Roti: { icon: "bread", color: "bg-stone-500/10 text-stone-600" },
  Desserts: { icon: "cake", color: "bg-pink-500/10 text-pink-600" },
  Snacks: { icon: "cookie", color: "bg-green-500/10 text-green-600" },
  Drinks: { icon: "cup", color: "bg-blue-500/10 text-blue-600" },
  Salads: { icon: "leaf", color: "bg-emerald-500/10 text-emerald-600" },
  Seafood: { icon: "fish", color: "bg-cyan-500/10 text-cyan-600" },
  Kebabs: { icon: "meat", color: "bg-rose-500/10 text-rose-600" },
};

function slugify(n: string) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

export default async function RecipesPage({ searchParams }: { searchParams: Promise<{ cat?: string; difficulty?: string }> }) {
  const sp = await searchParams;
  const recipes = recipesData as Recipe[];
  let filtered = [...recipes];
  if (sp.cat) filtered = filtered.filter(r => r.category === sp.cat);
  if (sp.difficulty) filtered = filtered.filter(r => r.difficulty.toLowerCase() === sp.difficulty);
  if (filtered.length === 0) filtered = [...recipes];
  const categories = [...new Set(recipes.map(r => r.category))].sort();
  const catCounts = categories.reduce((a: Record<string, number>, c) => { a[c] = recipes.filter(r => r.category === c).length; return a; }, {});
  const featured = recipes[0];
  const popular = [...recipes].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 6);
  const linkCls = (active: boolean) => "rounded-xl border p-4 text-center transition-all " + (active ? "border-primary bg-primary/10 shadow-md" : "border-border bg-surface hover:border-primary/30 hover:shadow-md");
  const noFilter = !sp.cat && !sp.difficulty;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pakistani Recipes",
    description: "Authentic Pakistani recipes with step-by-step guides",
    url: "https://techveb.com/recipes",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: recipes.length,
      itemListElement: recipes.slice(0, 10).map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Recipe", name: r.name, recipeCategory: r.category, cookTime: r.time, recipeYield: r.servings, recipeIngredient: r.description },
      })),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">Pakistani Recipes</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">Authentic Pakistani food recipes with step-by-step guides</p>
        <p className="mt-2 text-sm text-muted-foreground">{filtered.length} recipes available</p>
      </div>
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Link href="/recipes" className={linkCls(noFilter)}>
          <span className="mb-2 block text-2xl">all</span>
          <p className="text-sm font-semibold text-foreground">All</p>
          <p className="text-xs text-muted-foreground">{recipes.length} recipes</p>
        </Link>
        {categories.map(cat => {
          const meta = catMeta[cat] || { icon: "dish", color: "bg-gray-500/10 text-gray-600" };
          return (
            <Link key={cat} href={"/recipes?cat=" + encodeURIComponent(cat)} className={linkCls(sp.cat === cat)}>
              <span className="mb-2 block text-2xl">{meta.icon}</span>
              <p className="text-sm font-semibold text-foreground">{cat}</p>
              <p className="text-xs text-muted-foreground">{catCounts[cat]} recipes</p>
            </Link>
          );
        })}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["Easy", "Medium", "Hard"].map(d => (
          <Link key={d} href={"/recipes?difficulty=" + d.toLowerCase()} className={"rounded-full border px-4 py-1.5 text-sm font-medium transition-all " + (sp.difficulty === d.toLowerCase() ? "border-primary bg-primary text-white" : "border-border bg-surface hover:border-primary/30")}>{d}</Link>
        ))}
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-amber-500/5 to-pink-500/5 p-6 sm:p-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Featured Recipe</span>
            <h2 className="mt-4 mb-2 font-heading text-2xl font-bold text-foreground">{featured.name}</h2>
            <p className="mb-3 text-sm text-muted">{featured.description}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-background/50 px-3 py-1 text-muted-foreground">{featured.time}</span>
              <span className="rounded-full bg-background/50 px-3 py-1 text-muted-foreground">{featured.servings} servings</span>
              <span className="rounded-full bg-background/50 px-3 py-1 text-muted-foreground">{featured.difficulty}</span>
              <span className="rounded-full bg-background/50 px-3 py-1 text-amber-600 font-semibold">{featured.rating} ({featured.reviews})</span>
              <span className="rounded-full bg-background/50 px-3 py-1 text-muted-foreground">{featured.ingredients} ingredients</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.slice(0, 16).map((recipe: Recipe, idx: number) => (
              <div key={idx} className="rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <span className={"rounded-full px-2.5 py-0.5 text-xs font-semibold " + (catMeta[recipe.category]?.color || "bg-gray-100 text-gray-600")}>{recipe.category}</span>
                  <span className="text-sm font-semibold text-amber-600">{recipe.rating}</span>
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{recipe.name}</h3>
                <p className="mb-3 text-sm text-muted line-clamp-2">{recipe.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{recipe.time}</span>
                  <span>&middot;</span>
                  <span>{recipe.servings} servings</span>
                  <span>&middot;</span>
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full shrink-0 space-y-6 lg:w-72">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Top Rated</h3>
            <div className="space-y-3">
              {popular.map((r, idx) => (
                <div key={idx} className="rounded-lg p-2 transition-colors hover:bg-background">
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-amber-600 font-semibold">{r.rating}</span>
                    <span className="text-muted-foreground">{r.reviews} reviews</span>
                    <span className="text-muted-foreground">&middot; {r.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Recipes</span><span className="font-semibold">{recipes.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Categories</span><span className="font-semibold">{categories.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Avg Rating</span><span className="font-semibold">{(recipes.reduce((a, r) => a + r.rating, 0) / recipes.length).toFixed(1)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
