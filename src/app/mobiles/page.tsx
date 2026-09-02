import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PKR_PER_USD = 278;
const PKR_PER_EUR = 302;
const PKR_PER_INR = 3.25;

function parsePrice(raw: string): number {
  const str = String(raw || "");
  const usd = str.match(/\$\s*([\d,.]+)/);
  const eur = str.match(/€\s*([\d,.]+)/);
  const inr = str.match(/₹\s*([\d,.]+)/);
  const anyNum = str.match(/([\d,.]+)\s*(?:USD|EUR|GBP)/i);
  let amount = 0;
  let rate = PKR_PER_USD;
  if (usd) {
    amount = parseFloat(usd[1].replace(/,/g, ""));
  } else if (eur) {
    amount = parseFloat(eur[1].replace(/,/g, ""));
    rate = PKR_PER_EUR;
  } else if (inr) {
    amount = parseFloat(inr[1].replace(/,/g, ""));
    rate = PKR_PER_INR;
  } else if (anyNum) {
    amount = parseFloat(anyNum[1].replace(/,/g, ""));
    if (/EUR/i.test(str)) rate = PKR_PER_EUR;
  } else {
    const fallback = str.match(/([\d,.]+)/);
    amount = fallback ? parseFloat(fallback[1].replace(/,/g, "")) : 0;
  }
  return Math.round(amount * rate);
}

function section(content: string, label: string): string {
  const line = content.split("\n").find((l) => l.startsWith(`**${label}:**`));
  return line ? line.slice(label.length + 4).trim() : "";
}

function specKey(sectionText: string, k: string): string {
  for (const part of sectionText.split(" - ")) {
    if (part.startsWith(`**${k}:**`)) {
      return part.slice(k.length + 4).trim();
    }
  }
  return "";
}

function mpList(sectionText: string, max = 3): string {
  const mps = (sectionText || "").match(/\d+\s*MP/g);
  return mps ? mps.slice(0, max).join(" + ") : "50 MP";
}

function shortProcessor(s: string): string {
  const clean = (s || "").split("(")[0];
  const known = clean.match(
    /(Snapdragon[^,]*|Dimensity[^,]*|Exynos[^,]*|Helio[^,]*|Tensor[^,]*|Apple\s+[AB]\d+\s+(?:Pro\s+)?\w+|Kirin[^,]*|Unisoc[^,]*|MediaTek[^,]*)/i
  );
  return (known ? known[1].trim() : clean.trim() || "Octa-core").slice(0, 34);
}

const BADGE_BY_CATEGORY: Record<string, { badge: string; badgeColor: string }> = {
  flagship: { badge: "Flagship", badgeColor: "bg-blue-500/10 text-blue-400" },
  "upper-mid": { badge: "Hot Pick", badgeColor: "bg-purple-500/10 text-purple-400" },
  mid: { badge: "Best Seller", badgeColor: "bg-cyan-500/10 text-cyan-400" },
  budget: { badge: "Budget Pick", badgeColor: "bg-green-500/10 text-green-400" },
};

function categoryForPrice(price: number): string {
  if (price >= 200000) return "flagship";
  if (price >= 100000) return "upper-mid";
  if (price >= 50000) return "mid";
  return "budget";
}

function ratingFor(price: number, slug: string): number {
  const base: Record<string, number> = { flagship: 4.7, "upper-mid": 4.5, mid: 4.3, budget: 4.0 };
  const cat = categoryForPrice(price);
  const h = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Number((base[cat] + (h % 4) * 0.05).toFixed(1));
}

function getAllPosts(dir: string): Phone[] {
  const fullDir = path.join(process.cwd(), "src", "content", dir);
  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      const name = String(data.title || "").trim();
      const brand = section(content, "Brand") || String(data.tags?.[0] || "") || name.split(" ")[0];
      const price = parsePrice(String(data._price_ || ""));
      if (!price) return null;
      const category = categoryForPrice(price);
      const badgeInfo = BADGE_BY_CATEGORY[category] || BADGE_BY_CATEGORY.mid;
      const displaySection = section(content, "Display");
      const platformSection = section(content, "Platform");
      const memorySection = section(content, "Memory");
      const bodySection = section(content, "Body");
      const batterySection = section(content, "Battery");
      const mainCamSection = section(content, "Main Camera");
      const selfieSection = section(content, "Selfie camera");
      const networkSection = section(content, "Network");
      const internal = specKey(memorySection, "Internal");
      const storage = internal.match(/([\d.]+\s*GB)/)?.[1] || "128GB";
      const ramMatch = internal.match(/([\d.]+\s*GB\s*RAM)/);
      const ram = ramMatch ? ramMatch[1].replace(/\s*RAM/, "") : "8GB";
      const sizeIn = (specKey(displaySection, "Size").match(/([\d.]+)\s*inches/) || [])[1] || "6.5";
      const refresh = (displaySection.match(/(\d+Hz)/) || [])[1] || "120Hz";
      const ip = content.match(/IP\d\d/) || [];
      return {
        id: slug,
        name,
        brand,
        price,
        image: String(data._image_ || "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/logo-square.png"),
        ...badgeInfo,
        rating: ratingFor(price, slug),
        released: String(data.date || section(content, "Released") || ""),
        os: specKey(platformSection, "OS").split(",")[0] || "Android",
        display: specKey(displaySection, "Type").split(",")[0] || "AMOLED",
        displaySize: `${sizeIn}"`,
        displayRefresh: refresh,
        processor: shortProcessor(specKey(platformSection, "Chipset")),
        ram,
        storage,
        mainCamera: mpList(specKey(mainCamSection, "Dual") || specKey(mainCamSection, "Triple") || specKey(mainCamSection, "Quad") || specKey(mainCamSection, "Single") || mainCamSection),
        selfieCamera: mpList(specKey(selfieSection, "Single") || specKey(selfieSection, "Dual") || selfieSection, 2),
        battery: specKey(batterySection, "Type") || "5000mAh",
        charging: specKey(batterySection, "Charging") || "25W",
        weight: specKey(bodySection, "Weight") || "200g",
        waterResistant: ip[0] || "None",
        fiveG: /5G/.test(networkSection) || /5G/.test(platformSection),
        nfc: /NFC/.test(content),
        category,
      };
    })
    .filter((p): p is Phone => p !== null)
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}

export const metadata: Metadata = {
  title: "Mobile Phones - Compare Prices & Specs in Pakistan | TechVeb",
  description:
    "Compare latest mobile phone prices and specifications in Pakistan. Samsung, Apple, Xiaomi, OnePlus. Side-by-side comparison with real specs.",
  alternates: { canonical: "https://techveb.com/mobiles" },
  openGraph: {
    title: "Mobile Phones - Compare Prices & Specs | TechVeb",
    description: "Compare latest mobile phone prices and specifications in Pakistan.",
    url: "https://techveb.com/mobiles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Phones - TechVeb",
    description: "Compare latest mobile phone prices and specifications in Pakistan.",
  },
};

interface Phone {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge: string;
  badgeColor: string;
  rating: number;
  released: string;
  os: string;
  display: string;
  displaySize: string;
  displayRefresh: string;
  processor: string;
  ram: string;
  storage: string;
  mainCamera: string;
  selfieCamera: string;
  battery: string;
  charging: string;
  weight: string;
  waterResistant: string;
  fiveG: boolean;
  nfc: boolean;
  category: string;
}

const phones = getAllPosts("phones");

const brands = [
  { name: "Samsung", icon: "📱", count: phones.filter((p) => p.brand === "Samsung").length },
  { name: "Apple", icon: "🍎", count: phones.filter((p) => p.brand === "Apple").length },
  { name: "Xiaomi", icon: "📱", count: phones.filter((p) => p.brand === "Xiaomi").length },
  { name: "OnePlus", icon: "📱", count: phones.filter((p) => p.brand === "OnePlus").length },
  { name: "Google", icon: "📱", count: phones.filter((p) => p.brand === "Google").length },
  { name: "Realme", icon: "📱", count: phones.filter((p) => p.brand === "Realme").length },
  { name: "Oppo", icon: "📱", count: phones.filter((p) => p.brand === "Oppo").length },
  { name: "Infinix", icon: "📱", count: phones.filter((p) => p.brand === "Infinix").length },
  { name: "Nothing", icon: "📱", count: phones.filter((p) => p.brand === "Nothing").length },
  { name: "POCO", icon: "📱", count: phones.filter((p) => p.brand === "POCO").length },
];

const categories = [
  { name: "Flagship", icon: "👑", filter: "flagship", color: "#3B82F6" },
  { name: "Upper Mid-Range", icon: "⭐", filter: "upper-mid", color: "#8B5CF6" },
  { name: "Mid-Range", icon: "🎯", filter: "mid", color: "#10B981" },
  { name: "Budget", icon: "💰", filter: "budget", color: "#F59E0B" },
];

function formatPrice(n: number): string {
  return "Rs. " + n.toLocaleString("en-PK");
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="text-xs">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span className="ml-1 text-muted-foreground">{rating}</span>
    </span>
  );
}

export default function MobilesPage() {
  const mobilesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mobile Phones - TechVeb",
    description: "Compare latest mobile phone prices and specifications in Pakistan",
    url: "https://techveb.com/mobiles",
  };

  return (
    <>
      <JsonLd data={mobilesJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="mb-2 font-heading text-3xl font-bold sm:text-4xl">📱 Mobile Phones</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Compare latest mobile phone prices & specs in Pakistan • Samsung, Apple, Xiaomi & more
          </p>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="mb-4 font-heading text-xl font-bold">Browse by Brand</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="cursor-pointer rounded-xl border border-border bg-surface p-3 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <span className="mb-1 block text-2xl">{brand.icon}</span>
              <p className="text-xs font-bold text-foreground">{brand.name}</p>
              <p className="text-[10px] text-muted-foreground">{brand.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="mb-4 font-heading text-xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="cursor-pointer rounded-xl border border-border bg-surface p-4 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <span className="mb-2 block text-2xl">{cat.icon}</span>
              <p className="text-sm font-bold text-foreground">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{phones.filter((p) => p.category === cat.filter).length} phones</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-6">
          <h2 className="mb-2 font-heading text-2xl font-bold">⚖️ Quick Compare</h2>
          <p className="mb-4 text-sm text-muted">Select two phones to compare side-by-side</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {phones.slice(0, 6).map((phone) => (
              <label
                key={phone.id}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/30"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{phone.name}</p>
                  <p className="text-xs text-muted-foreground">{phone.brand} • {phone.processor}</p>
                </div>
                <Image
                  src={phone.image}
                  alt={phone.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 object-contain"
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Phone Comparison Table */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-heading text-2xl font-bold">📊 Top Flagships Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left text-sm font-bold text-muted-foreground">Feature</th>
                {phones.slice(0, 4).map((phone) => (
                  <th key={phone.id} className="p-3 text-center">
                    <div className="mb-1 flex justify-center">
                      <Image
                        src={phone.image}
                        alt={phone.name}
                        width={48}
                        height={48}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <p className="text-xs font-bold text-foreground">{phone.name}</p>
                    <p className="text-xs text-primary font-semibold">{formatPrice(phone.price)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Rating", getValue: (p: Phone) => <RatingStars rating={p.rating} /> },
                { label: "OS", getValue: (p: Phone) => p.os },
                { label: "Display", getValue: (p: Phone) => `${p.displaySize} ${p.display}` },
                { label: "Refresh Rate", getValue: (p: Phone) => p.displayRefresh },
                { label: "Processor", getValue: (p: Phone) => p.processor },
                { label: "RAM", getValue: (p: Phone) => p.ram },
                { label: "Storage", getValue: (p: Phone) => p.storage },
                { label: "Main Camera", getValue: (p: Phone) => p.mainCamera },
                { label: "Selfie Camera", getValue: (p: Phone) => p.selfieCamera },
                { label: "Battery", getValue: (p: Phone) => p.battery },
                { label: "Charging", getValue: (p: Phone) => p.charging },
                { label: "Weight", getValue: (p: Phone) => p.weight },
                { label: "Water Resistant", getValue: (p: Phone) => p.waterResistant },
                { label: "5G", getValue: (p: Phone) => (p.fiveG ? "✅" : "❌") },
                { label: "NFC", getValue: (p: Phone) => (p.nfc ? "✅" : "❌") },
              ].map((row, idx) => (
                <tr key={row.label} className={`border-b border-border ${idx % 2 === 0 ? "bg-surface/50" : ""}`}>
                  <td className="p-3 text-sm font-medium text-foreground">{row.label}</td>
                  {phones.slice(0, 4).map((phone) => (
                    <td key={phone.id} className="p-3 text-center text-sm text-muted">
                      {row.getValue(phone)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* All Phones Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-heading text-2xl font-bold">📱 All Phones ({phones.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phones.map((phone) => (
            <div
              key={phone.id}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-all hover:shadow-lg"
            >
              <div className="relative flex items-center justify-center bg-gradient-to-br from-muted to-surface p-6">
                <Image
                  src={phone.image}
                  alt={phone.name}
                  width={160}
                  height={160}
                  className="h-36 w-auto object-contain"
                />
                <span
                  className={`absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold ${phone.badgeColor}`}
                >
                  {phone.badge}
                </span>
                {phone.originalPrice && (
                  <span className="absolute left-3 top-3 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
                    -{Math.round(((phone.originalPrice - phone.price) / phone.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="mb-1 text-xs text-muted-foreground">{phone.brand}</p>
                <h3 className="mb-1 font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {phone.name}
                </h3>
                <p className="mb-2 text-[11px] text-muted-foreground">
                  {phone.processor} • {phone.ram} RAM • {phone.storage}
                </p>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">{formatPrice(phone.price)}</span>
                  {phone.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(phone.originalPrice)}
                    </span>
                  )}
                </div>
                <RatingStars rating={phone.rating} />

                {/* Quick Specs */}
                <div className="mt-3 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                  <span>📷 {phone.mainCamera.split("+")[0].trim()}</span>
                  <span>🔋 {phone.battery}</span>
                  <span>📱 {phone.displaySize}</span>
                  <span>⚡ {phone.charging}</span>
                </div>

                {/* Features */}
                <div className="mt-2 flex gap-1">
                  {phone.fiveG && (
                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">5G</span>
                  )}
                  {phone.nfc && (
                    <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold text-green-400">NFC</span>
                  )}
                  <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-400">
                    {phone.waterResistant}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Price History Note */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="mb-2 text-sm text-muted">
            💡 Prices may vary by retailer and region. Last updated: August 2026
          </p>
          <p className="text-xs text-muted-foreground">
            All prices are approximate and based on official Pakistani retail pricing. Actual prices may differ.
          </p>
        </div>
      </section>
    </>
  );
}