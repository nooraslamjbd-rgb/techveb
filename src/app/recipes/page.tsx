import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pakistani Recipes - Delicious Food Recipes | TechVeb",
  description:
    "Discover authentic Pakistani recipes - Biryani, Karahi, Haleem, Nihari, and more. Easy step-by-step cooking guides.",
  alternates: { canonical: "https://techveb.com/recipes" },
  openGraph: {
    title: "Pakistani Recipes - TechVeb",
    description: "Authentic Pakistani food recipes with step-by-step guides.",
    url: "https://techveb.com/recipes",
    type: "website",
  },
};

const categories = [
  { name: "Biryani", icon: "🍚", count: 8, color: "bg-amber-500/10 text-amber-600" },
  { name: "Karahi", icon: "🥘", count: 6, color: "bg-red-500/10 text-red-600" },
  { name: "BBQ", icon: "🍖", count: 5, color: "bg-orange-500/10 text-orange-600" },
  { name: "Daal", icon: "🥣", count: 4, color: "bg-yellow-500/10 text-yellow-600" },
  { name: "Roti", icon: "🫓", count: 4, color: "bg-stone-500/10 text-stone-600" },
  { name: "Desserts", icon: "🍮", count: 6, color: "bg-pink-500/10 text-pink-600" },
  { name: "Snacks", icon: "🤱", count: 5, color: "bg-green-500/10 text-green-600" },
  { name: "Drinks", icon: "🥤", count: 4, color: "bg-cyan-500/10 text-cyan-600" },
];

const recipes = [
  // Biryani
  { name: "Chicken Biryani", category: "Biryani", time: "45 min", servings: "4-6", difficulty: "Medium", image: "🍚", rating: 4.9, reviews: 342, description: "Authentic Hyderabadi style chicken biryani with aromatic basmati rice", ingredients: 15 },
  { name: "Mutton Biryani", category: "Biryani", time: "1 hour", servings: "6-8", difficulty: "Medium", image: "🍚", rating: 4.8, reviews: 289, description: "Rich mutton biryani with tender meat and saffron rice", ingredients: 18 },
  { name: "Beef Biryani", category: "Biryani", time: "1.5 hours", servings: "6-8", difficulty: "Hard", image: "🍚", rating: 4.7, reviews: 198, description: "Hearty beef biryani slow-cooked with spices", ingredients: 16 },
  { name: "Tehari", category: "Biryani", time: "40 min", servings: "4", difficulty: "Easy", image: "🍚", rating: 4.6, reviews: 156, description: "Quick one-pot rice dish with potatoes and meat", ingredients: 10 },
  { name: "Vegetable Biryani", category: "Biryani", time: "35 min", servings: "4", difficulty: "Easy", image: "🍚", rating: 4.5, reviews: 134, description: "Fragrant rice with mixed vegetables and spices", ingredients: 12 },
  { name: "Yakhni Pulao", category: "Biryani", time: "50 min", servings: "6", difficulty: "Medium", image: "🍚", rating: 4.7, reviews: 178, description: "Mild and flavorful rice cooked in meat broth", ingredients: 14 },
  { name: "Keema Biryani", category: "Biryani", time: "40 min", servings: "4", difficulty: "Medium", image: "🍚", rating: 4.6, reviews: 167, description: "Minced meat biryani with aromatic spices", ingredients: 13 },
  { name: "Bombay Biryani", category: "Biryani", time: "50 min", servings: "6", difficulty: "Medium", image: "🍚", rating: 4.8, reviews: 245, description: "Sweet and spicy Bombay style biryani", ingredients: 17 },

  // Karahi
  { name: "Mutton Karahi", category: "Karahi", time: "40 min", servings: "4", difficulty: "Easy", image: "🥘", rating: 4.8, reviews: 287, description: "Spicy mutton karahi with fresh tomatoes and green chilies", ingredients: 10 },
  { name: "Chicken Karahi", category: "Karahi", time: "35 min", servings: "4", difficulty: "Easy", image: "🥘", rating: 4.7, reviews: 312, description: "Classic chicken karahi with ginger and garlic", ingredients: 9 },
  { name: "Peshawari Karahi", category: "Karahi", time: "45 min", servings: "4", difficulty: "Medium", image: "🥘", rating: 4.9, reviews: 356, description: "Authentic Peshawari karahi with minimal spices", ingredients: 7 },
  { name: "Kadai Paneer", category: "Karahi", time: "30 min", servings: "4", difficulty: "Easy", image: "🥘", rating: 4.5, reviews: 145, description: "Creamy paneer in spiced tomato gravy", ingredients: 11 },
  { name: "Fish Karahi", category: "Karahi", time: "25 min", servings: "4", difficulty: "Easy", image: "🥘", rating: 4.4, reviews: 123, description: "Fresh fish cooked in karahi with tomatoes", ingredients: 8 },
  { name: "Keema Karahi", category: "Karahi", time: "30 min", servings: "4", difficulty: "Easy", image: "🥘", rating: 4.6, reviews: 178, description: "Minced meat cooked in karahi with peas", ingredients: 10 },

  // BBQ
  { name: "Seekh Kebab", category: "BBQ", time: "30 min", servings: "6", difficulty: "Medium", image: "🍖", rating: 4.7, reviews: 198, description: "Juicy seekh kebabs with aromatic spices", ingredients: 12 },
  { name: "Chicken Tikka", category: "BBQ", time: "35 min", servings: "4", difficulty: "Easy", image: "🍖", rating: 4.8, reviews: 312, description: "Tender chicken tikka marinated in yogurt and spices", ingredients: 9 },
  { name: "Reshmi Kebab", category: "BBQ", time: "40 min", servings: "6", difficulty: "Medium", image: "🍖", rating: 4.6, reviews: 167, description: "Silky smooth minced chicken kebabs", ingredients: 11 },
  { name: "Tandoori Chicken", category: "BBQ", time: "45 min", servings: "4", difficulty: "Medium", image: "🍖", rating: 4.8, reviews: 289, description: "Classic tandoori chicken with red spice coating", ingredients: 10 },
  { name: "Shami Kebab", category: "BBQ", time: "50 min", servings: "8", difficulty: "Hard", image: "🍖", rating: 4.7, reviews: 234, description: "Crispy fried kebabs with lentils and meat", ingredients: 14 },

  // Daal
  { name: "Daal Makhni", category: "Daal", time: "35 min", servings: "4", difficulty: "Easy", image: "🥣", rating: 4.6, reviews: 156, description: "Creamy black lentil daal cooked with butter and cream", ingredients: 8 },
  { name: "Daal Chawal", category: "Daal", time: "25 min", servings: "4", difficulty: "Easy", image: "🥣", rating: 4.5, reviews: 234, description: "Simple yellow lentils served with rice", ingredients: 6 },
  { name: "Masoor Daal", category: "Daal", time: "20 min", servings: "4", difficulty: "Easy", image: "🥣", rating: 4.4, reviews: 145, description: "Quick red lentil curry with onions", ingredients: 7 },
  { name: "Daal Fry", category: "Daal", time: "30 min", servings: "4", difficulty: "Easy", image: "🥣", rating: 4.5, reviews: 178, description: "Tempered lentils with cumin and garlic", ingredients: 8 },

  // Roti & Naan
  { name: "Paratha", category: "Roti", time: "15 min", servings: "4", difficulty: "Easy", image: "🫓", rating: 4.5, reviews: 189, description: "Flaky layered paratha served with butter", ingredients: 3 },
  { name: "Naan", category: "Roti", time: "20 min", servings: "6", difficulty: "Medium", image: "🫓", rating: 4.6, reviews: 198, description: "Soft and fluffy naan from tandoor", ingredients: 5 },
  { name: "Roghni Naan", category: "Roti", time: "25 min", servings: "6", difficulty: "Medium", image: "🫓", rating: 4.7, reviews: 167, description: "Sesame-topped soft naan bread", ingredients: 6 },
  { name: "Roti", category: "Roti", time: "10 min", servings: "4", difficulty: "Easy", image: "🫓", rating: 4.4, reviews: 234, description: "Whole wheat flatbread", ingredients: 2 },

  // Desserts
  { name: "Gulab Jamun", category: "Desserts", time: "25 min", servings: "8", difficulty: "Medium", image: "🍮", rating: 4.8, reviews: 267, description: "Soft and spongy gulab jamun soaked in sugar syrup", ingredients: 6 },
  { name: "Kheer", category: "Desserts", time: "45 min", servings: "6", difficulty: "Easy", image: "🍮", rating: 4.6, reviews: 178, description: "Creamy rice pudding with cardamom and dry fruits", ingredients: 7 },
  { name: "Jalebi", category: "Desserts", time: "30 min", servings: "10", difficulty: "Hard", image: "🍮", rating: 4.7, reviews: 234, description: "Crispy spiral-shaped sweet soaked in syrup", ingredients: 4 },
  { name: "Ras Malai", category: "Desserts", time: "40 min", servings: "6", difficulty: "Hard", image: "🍮", rating: 4.8, reviews: 289, description: "Soft cheese dumplings in sweetened milk", ingredients: 5 },
  { name: "Halwa", category: "Desserts", time: "20 min", servings: "6", difficulty: "Easy", image: "🍮", rating: 4.5, reviews: 156, description: "Semolina pudding with nuts and saffron", ingredients: 5 },
  { name: "Gajar Ka Halwa", category: "Desserts", time: "50 min", servings: "8", difficulty: "Medium", image: "🍮", rating: 4.9, reviews: 312, description: "Carrot fudge with milk, sugar and nuts", ingredients: 6 },

  // Snacks
  { name: "Samosa", category: "Snacks", time: "40 min", servings: "12", difficulty: "Medium", image: "🤱", rating: 4.7, reviews: 234, description: "Crispy samosas with spiced potato filling", ingredients: 10 },
  { name: "Pakora", category: "Snacks", time: "20 min", servings: "6", difficulty: "Easy", image: "🤱", rating: 4.5, reviews: 198, description: "Crispy vegetable fritters", ingredients: 7 },
  { name: "Chaat", category: "Snacks", time: "15 min", servings: "4", difficulty: "Easy", image: "🤱", rating: 4.6, reviews: 178, description: "Spicy and tangy street food snack", ingredients: 8 },
  { name: "Dahi Bhalla", category: "Snacks", time: "30 min", servings: "6", difficulty: "Medium", image: "🤱", rating: 4.7, reviews: 198, description: "Lentil dumplings in yogurt", ingredients: 9 },
  { name: "Chapli Kebab", category: "Snacks", time: "25 min", servings: "6", difficulty: "Medium", image: "🤱", rating: 4.8, reviews: 267, description: "Peshawari style flat minced meat kebabs", ingredients: 11 },

  // Drinks
  { name: "Lassi", category: "Drinks", time: "5 min", servings: "2", difficulty: "Easy", image: "🥤", rating: 4.5, reviews: 145, description: "Refreshing sweet or salty yogurt lassi", ingredients: 3 },
  { name: "Mango Shake", category: "Drinks", time: "10 min", servings: "4", difficulty: "Easy", image: "🥤", rating: 4.7, reviews: 189, description: "Creamy mango milkshake", ingredients: 3 },
  { name: "Rooh Afza", category: "Drinks", time: "5 min", servings: "4", difficulty: "Easy", image: "🥤", rating: 4.4, reviews: 134, description: "Refreshing rose-flavored summer drink", ingredients: 3 },
  { name: "Chai", category: "Drinks", time: "10 min", servings: "2", difficulty: "Easy", image: "🥤", rating: 4.9, reviews: 456, description: "Traditional Pakistani spiced tea", ingredients: 5 },
];

const topRecipes = [
  { name: "Chicken Biryani", emoji: "🍚", rating: 4.9, time: "45 min" },
  { name: "Peshawari Karahi", emoji: "🥘", rating: 4.9, time: "45 min" },
  { name: "Chai", emoji: "🥤", rating: 4.9, time: "10 min" },
  { name: "Nihari", emoji: "🥘", rating: 4.9, time: "3 hours" },
  { name: "Haleem", emoji: "🥣", rating: 4.9, time: "4 hours" },
  { name: "Gajar Ka Halwa", emoji: "🍮", rating: 4.9, time: "50 min" },
];

export default function RecipesPage() {
  const recipesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pakistani Recipes - TechVeb",
    description: "Authentic Pakistani food recipes",
    url: "https://techveb.com/recipes",
  };

  const totalRecipes = recipes.length;
  const avgRating = (recipes.reduce((acc, r) => acc + r.rating, 0) / recipes.length).toFixed(1);

  return (
    <>
      <JsonLd data={recipesJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🍛</span>
            <div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">Pakistani Recipes</h1>
              <p className="text-muted-foreground text-sm">{totalRecipes}+ authentic Desi food recipes with step-by-step guides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalRecipes}+</p>
            <p className="text-xs text-muted-foreground">Recipes</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-bold text-primary">{categories.length}</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-bold text-primary">⭐ {avgRating}</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-border bg-surface p-3 text-center hover:shadow-md hover:border-orange-500/30 transition-all cursor-pointer"
            >
              <span className="text-2xl mb-1 block">{cat.icon}</span>
              <p className="text-xs font-bold text-foreground">{cat.name}</p>
              <p className="text-[10px] text-muted-foreground">{cat.count} recipes</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">🔥 Top Rated Recipes</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {topRecipes.map((r) => (
            <div key={r.name} className="shrink-0 rounded-xl border border-border bg-surface p-4 text-center min-w-[140px] hover:shadow-md transition-all cursor-pointer">
              <span className="text-3xl mb-2 block">{r.emoji}</span>
              <p className="text-xs font-bold text-foreground mb-1">{r.name}</p>
              <p className="text-[10px] text-yellow-500 mb-1">⭐ {r.rating}</p>
              <p className="text-[10px] text-muted-foreground">⏱️ {r.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Recipes */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="font-heading text-xl font-bold mb-6">All Recipes ({totalRecipes})</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div key={recipe.name} className="rounded-xl border border-border bg-surface overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                  <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 p-6 text-center">
                    <span className="text-5xl">{recipe.image}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-600">
                        {recipe.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        recipe.difficulty === "Easy" ? "bg-green-500/10 text-green-600" :
                        recipe.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                      {recipe.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>⏱️ {recipe.time}</span>
                      <span>🍽️ {recipe.servings}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                      <span className="text-[10px] text-yellow-500">⭐ {recipe.rating} ({recipe.reviews})</span>
                      <span className="text-[10px] text-muted-foreground">{recipe.ingredients} ingredients</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Quick Links</h3>
              <div className="space-y-2">
                {["Ramadan Recipes", "Eid Special", "Winter Special", "Summer Drinks", "Lunch Box Ideas", "Party Food", "Budget Meals"].map((link) => (
                  <Link key={link} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Popular Cuisines</h3>
              <div className="space-y-2">
                {["Punjabi", "Sindhi", "Balochi", "Peshawari", "Mughlai", "Kashmiri"].map((cuisine) => (
                  <Link key={cuisine} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → {cuisine}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Low-Carb", "High-Protein"].map((diet) => (
                  <span key={diet} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-all">
                    {diet}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="font-heading text-sm font-bold mb-3">Cooking Time</h3>
              <div className="space-y-2">
                {["Under 15 min", "15-30 min", "30-60 min", "Over 1 hour"].map((time) => (
                  <Link key={time} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → {time}
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
