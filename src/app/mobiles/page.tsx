import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Mobile Phones - Latest Prices & Comparison in Pakistan | TechVeb",
  description:
    "Compare latest mobile phone prices in Pakistan. Samsung, Apple, Xiaomi, OnePlus, and more. Find the best deals.",
  alternates: { canonical: "https://techveb.com/mobiles" },
  openGraph: {
    title: "Mobile Phones - TechVeb",
    description: "Latest mobile phone prices and comparison in Pakistan.",
    url: "https://techveb.com/mobiles",
    type: "website",
  },
};

const brands = [
  { name: "Samsung", icon: "📱", count: 45 },
  { name: "Apple", icon: "🍎", count: 12 },
  { name: "Xiaomi", icon: "📱", count: 30 },
  { name: "OnePlus", icon: "📱", count: 15 },
  { name: "Realme", icon: "📱", count: 20 },
  { name: "Oppo", icon: "📱", count: 18 },
  { name: "Vivo", icon: "📱", count: 16 },
  { name: "Infinix", icon: "📱", count: 22 },
];

const latestPhones = [
  {
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    price: "Rs. 289,999",
    originalPrice: "Rs. 319,999",
    specs: "Snapdragon 8 Elite, 12GB RAM, 256GB",
    rating: 4.8,
    image: "📱",
    badge: "Flagship",
    badgeColor: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    price: "Rs. 349,999",
    originalPrice: "",
    specs: "A19 Pro, 8GB RAM, 256GB",
    rating: 4.9,
    image: "📱",
    badge: "New",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
  },
  {
    name: "Xiaomi 16 Pro",
    brand: "Xiaomi",
    price: "Rs. 129,999",
    originalPrice: "Rs. 139,999",
    specs: "Snapdragon 8 Elite, 12GB RAM, 512GB",
    rating: 4.6,
    image: "📱",
    badge: "Value",
    badgeColor: "bg-amber-500/10 text-amber-400",
  },
  {
    name: "OnePlus 14",
    brand: "OnePlus",
    price: "Rs. 149,999",
    originalPrice: "",
    specs: "Snapdragon 8 Elite, 16GB RAM, 256GB",
    rating: 4.7,
    image: "📱",
    badge: "Popular",
    badgeColor: "bg-purple-500/10 text-purple-400",
  },
  {
    name: "Samsung Galaxy A56",
    brand: "Samsung",
    price: "Rs. 64,999",
    originalPrice: "Rs. 69,999",
    specs: "Exynos 1580, 8GB RAM, 128GB",
    rating: 4.3,
    image: "📱",
    badge: "Mid-range",
    badgeColor: "bg-cyan-500/10 text-cyan-400",
  },
  {
    name: "Realme GT 7 Pro",
    brand: "Realme",
    price: "Rs. 89,999",
    originalPrice: "",
    specs: "Snapdragon 8 Elite, 12GB RAM, 256GB",
    rating: 4.5,
    image: "📱",
    badge: "Performance",
    badgeColor: "bg-red-500/10 text-red-400",
  },
  {
    name: "Infinix Note 50 Pro",
    brand: "Infinix",
    price: "Rs. 45,999",
    originalPrice: "Rs. 49,999",
    specs: "Helio G100, 8GB RAM, 256GB",
    rating: 4.2,
    image: "📱",
    badge: "Budget",
    badgeColor: "bg-orange-500/10 text-orange-400",
  },
  {
    name: "Oppo Reno 13 Pro",
    brand: "Oppo",
    price: "Rs. 99,999",
    originalPrice: "",
    specs: "Dimensity 8300, 12GB RAM, 256GB",
    rating: 4.4,
    image: "📱",
    badge: "Camera",
    badgeColor: "bg-pink-500/10 text-pink-400",
  },
];

const priceRanges = [
  { range: "Under Rs. 20,000", count: 45, href: "#budget" },
  { range: "Rs. 20,000 - 50,000", count: 80, href: "#mid-low" },
  { range: "Rs. 50,000 - 100,000", count: 65, href: "#mid" },
  { range: "Rs. 100,000 - 200,000", count: 40, href: "#premium" },
  { range: "Above Rs. 200,000", count: 15, href: "#flagship" },
];

export default function MobilesPage() {
  const mobilesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mobile Phones - TechVeb",
    description: "Latest mobile phone prices and comparison in Pakistan",
    url: "https://techveb.com/mobiles",
  };

  return (
    <>
      <JsonLd data={mobilesJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl mb-2">Mobile Phones</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Compare latest mobile phone prices in Pakistan • Samsung, Apple, Xiaomi & more
          </p>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Browse by Brand</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="rounded-xl border border-border bg-surface p-3 text-center hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            >
              <span className="text-2xl mb-1 block">{brand.icon}</span>
              <p className="text-xs font-bold text-foreground">{brand.name}</p>
              <p className="text-[10px] text-muted-foreground">{brand.count} models</p>
            </div>
          ))}
        </div>
      </section>

      {/* Price Ranges */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Shop by Price</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {priceRanges.map((range) => (
            <a
              key={range.range}
              href={range.href}
              className="rounded-xl border border-border bg-surface p-4 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <p className="text-sm font-bold text-foreground">{range.range}</p>
              <p className="text-xs text-muted-foreground">{range.count} phones</p>
            </a>
          ))}
        </div>
      </section>

      {/* Latest Phones */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-6">Latest Phones</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latestPhones.map((phone) => (
            <div
              key={phone.name}
              className="rounded-xl border border-border bg-surface overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative bg-gradient-to-br from-muted to-surface p-6 text-center">
                <span className="text-6xl">{phone.image}</span>
                <span className={`absolute right-3 top-3 text-[10px] font-bold px-2 py-0.5 rounded ${phone.badgeColor}`}>
                  {phone.badge}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{phone.brand}</p>
                <h3 className="font-heading font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {phone.name}
                </h3>
                <p className="text-[11px] text-muted-foreground mb-2">{phone.specs}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-primary">{phone.price}</span>
                  {phone.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">{phone.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < Math.floor(phone.rating) ? "text-yellow-400" : "text-gray-600"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{phone.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
