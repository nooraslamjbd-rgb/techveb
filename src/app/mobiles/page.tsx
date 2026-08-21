import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

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

const phones: Phone[] = [
  // Flagships
  {
    id: "s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    price: 289999,
    originalPrice: 319999,
    image: "📱",
    badge: "Flagship",
    badgeColor: "bg-blue-500/10 text-blue-400",
    rating: 4.8,
    released: "2026-02",
    os: "Android 16, One UI 8",
    display: "Dynamic AMOLED 2X",
    displaySize: '6.9"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 8 Elite",
    ram: "12GB",
    storage: "256GB",
    mainCamera: "200MP + 50MP + 10MP + 10MP",
    selfieCamera: "12MP",
    battery: "5000mAh",
    charging: "45W",
    weight: "218g",
    waterResistant: "IP68",
    fiveG: true,
    nfc: true,
    category: "flagship",
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    price: 349999,
    image: "📱",
    badge: "New",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
    rating: 4.9,
    released: "2026-03",
    os: "iOS 20",
    display: "Super Retina XDR OLED",
    displaySize: '6.9"',
    displayRefresh: "120Hz ProMotion",
    processor: "Apple A19 Pro",
    ram: "8GB",
    storage: "256GB",
    mainCamera: "48MP + 48MP + 12MP",
    selfieCamera: "24MP",
    battery: "4685mAh",
    charging: "27W",
    weight: "227g",
    waterResistant: "IP68",
    fiveG: true,
    nfc: true,
    category: "flagship",
  },
  {
    id: "pixel-10-pro",
    name: "Google Pixel 10 Pro",
    brand: "Google",
    price: 189999,
    image: "📱",
    badge: "AI Camera",
    badgeColor: "bg-green-500/10 text-green-400",
    rating: 4.7,
    released: "2026-01",
    os: "Android 16, Stock",
    display: "LTPO OLED",
    displaySize: '6.7"',
    displayRefresh: "120Hz",
    processor: "Google Tensor G5",
    ram: "12GB",
    storage: "128GB",
    mainCamera: "50MP + 48MP + 48MP",
    selfieCamera: "42MP",
    battery: "5100mAh",
    charging: "30W",
    weight: "210g",
    waterResistant: "IP68",
    fiveG: true,
    nfc: true,
    category: "flagship",
  },
  {
    id: "samsung-z-fold7",
    name: "Samsung Galaxy Z Fold 7",
    brand: "Samsung",
    price: 449999,
    image: "📱",
    badge: "Foldable",
    badgeColor: "bg-purple-500/10 text-purple-400",
    rating: 4.6,
    released: "2026-07",
    os: "Android 16, One UI 8",
    display: "Dynamic AMOLED 2X",
    displaySize: '7.6" (inner) / 6.3" (outer)',
    displayRefresh: "120Hz",
    processor: "Snapdragon 8 Elite",
    ram: "16GB",
    storage: "512GB",
    mainCamera: "50MP + 12MP + 10MP",
    selfieCamera: "10MP (under-display)",
    battery: "4400mAh",
    charging: "25W",
    weight: "239g",
    waterResistant: "IPX8",
    fiveG: true,
    nfc: true,
    category: "flagship",
  },

  // Upper Mid-Range
  {
    id: "oneplus-14",
    name: "OnePlus 14",
    brand: "OnePlus",
    price: 149999,
    image: "📱",
    badge: "Popular",
    badgeColor: "bg-purple-500/10 text-purple-400",
    rating: 4.7,
    released: "2026-01",
    os: "Android 16, OxygenOS 16",
    display: "LTPO AMOLED",
    displaySize: '6.82"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 8 Elite",
    ram: "16GB",
    storage: "256GB",
    mainCamera: "50MP + 50MP + 50MP",
    selfieCamera: "32MP",
    battery: "6000mAh",
    charging: "100W",
    weight: "213g",
    waterResistant: "IP69",
    fiveG: true,
    nfc: true,
    category: "upper-mid",
  },
  {
    id: "xiaomi-16-pro",
    name: "Xiaomi 16 Pro",
    brand: "Xiaomi",
    price: 129999,
    originalPrice: 139999,
    image: "📱",
    badge: "Value",
    badgeColor: "bg-amber-500/10 text-amber-400",
    rating: 4.6,
    released: "2026-02",
    os: "Android 16, HyperOS 3",
    display: "LTPO AMOLED",
    displaySize: '6.73"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 8 Elite",
    ram: "12GB",
    storage: "512GB",
    mainCamera: "50MP + 50MP + 32MP",
    selfieCamera: "32MP",
    battery: "5500mAh",
    charging: "90W",
    weight: "205g",
    waterResistant: "IP68",
    fiveG: true,
    nfc: true,
    category: "upper-mid",
  },
  {
    id: "realme-gt7-pro",
    name: "Realme GT 7 Pro",
    brand: "Realme",
    price: 89999,
    image: "📱",
    badge: "Performance",
    badgeColor: "bg-red-500/10 text-red-400",
    rating: 4.5,
    released: "2026-01",
    os: "Android 16, Realme UI 6",
    display: "LTPO AMOLED",
    displaySize: '6.78"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 8 Elite",
    ram: "12GB",
    storage: "256GB",
    mainCamera: "50MP + 8MP + 50MP",
    selfieCamera: "32MP",
    battery: "6500mAh",
    charging: "120W",
    weight: "218g",
    waterResistant: "IP69",
    fiveG: true,
    nfc: true,
    category: "upper-mid",
  },
  {
    id: "oppo-reno-13-pro",
    name: "Oppo Reno 13 Pro",
    brand: "Oppo",
    price: 99999,
    image: "📱",
    badge: "Camera",
    badgeColor: "bg-pink-500/10 text-pink-400",
    rating: 4.4,
    released: "2026-03",
    os: "Android 16, ColorOS 16",
    display: "AMOLED",
    displaySize: '6.83"',
    displayRefresh: "120Hz",
    processor: "Dimensity 8300",
    ram: "12GB",
    storage: "256GB",
    mainCamera: "50MP + 8MP + 50MP",
    selfieCamera: "50MP",
    battery: "5800mAh",
    charging: "80W",
    weight: "195g",
    waterResistant: "IP65",
    fiveG: true,
    nfc: true,
    category: "upper-mid",
  },

  // Mid-Range
  {
    id: "samsung-a56",
    name: "Samsung Galaxy A56",
    brand: "Samsung",
    price: 64999,
    originalPrice: 69999,
    image: "📱",
    badge: "Best Seller",
    badgeColor: "bg-cyan-500/10 text-cyan-400",
    rating: 4.3,
    released: "2026-03",
    os: "Android 16, One UI 8",
    display: "Super AMOLED",
    displaySize: '6.7"',
    displayRefresh: "120Hz",
    processor: "Exynos 1580",
    ram: "8GB",
    storage: "128GB",
    mainCamera: "50MP + 12MP + 5MP",
    selfieCamera: "32MP",
    battery: "5000mAh",
    charging: "45W",
    weight: "190g",
    waterResistant: "IP67",
    fiveG: true,
    nfc: true,
    category: "mid",
  },
  {
    id: "pixel-9a",
    name: "Google Pixel 9a",
    brand: "Google",
    price: 74999,
    image: "📱",
    badge: "AI Power",
    badgeColor: "bg-green-500/10 text-green-400",
    rating: 4.5,
    released: "2026-05",
    os: "Android 16, Stock",
    display: "OLED",
    displaySize: '6.3"',
    displayRefresh: "120Hz",
    processor: "Google Tensor G4",
    ram: "8GB",
    storage: "128GB",
    mainCamera: "48MP + 13MP",
    selfieCamera: "13MP",
    battery: "4500mAh",
    charging: "23W",
    weight: "186g",
    waterResistant: "IP67",
    fiveG: true,
    nfc: true,
    category: "mid",
  },
  {
    id: "nothing-phone-3",
    name: "Nothing Phone (3)",
    brand: "Nothing",
    price: 79999,
    image: "📱",
    badge: "Unique Design",
    badgeColor: "bg-gray-500/10 text-gray-400",
    rating: 4.4,
    released: "2026-07",
    os: "Android 16, Nothing OS 3",
    display: "LTPO AMOLED",
    displaySize: '6.7"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 7+ Gen 3",
    ram: "12GB",
    storage: "256GB",
    mainCamera: "50MP + 50MP",
    selfieCamera: "32MP",
    battery: "5000mAh",
    charging: "45W",
    weight: "195g",
    waterResistant: "IP65",
    fiveG: true,
    nfc: true,
    category: "mid",
  },
  {
    id: "poco-f7-pro",
    name: "POCO F7 Pro",
    brand: "Xiaomi",
    price: 59999,
    image: "📱",
    badge: "Budget King",
    badgeColor: "bg-orange-500/10 text-orange-400",
    rating: 4.5,
    released: "2026-03",
    os: "Android 16, HyperOS 3",
    display: "AMOLED",
    displaySize: '6.67"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 8s Gen 4",
    ram: "12GB",
    storage: "256GB",
    mainCamera: "50MP + 8MP",
    selfieCamera: "20MP",
    battery: "6000mAh",
    charging: "67W",
    weight: "208g",
    waterResistant: "IP64",
    fiveG: true,
    nfc: true,
    category: "mid",
  },

  // Budget
  {
    id: "samsung-a16",
    name: "Samsung Galaxy A16",
    brand: "Samsung",
    price: 34999,
    image: "📱",
    badge: "Budget",
    badgeColor: "bg-green-500/10 text-green-400",
    rating: 4.0,
    released: "2026-01",
    os: "Android 16, One UI 8",
    display: "Super AMOLED",
    displaySize: '6.7"',
    displayRefresh: "90Hz",
    processor: "Exynos 1330",
    ram: "4GB",
    storage: "128GB",
    mainCamera: "50MP + 5MP + 2MP",
    selfieCamera: "13MP",
    battery: "5000mAh",
    charging: "25W",
    weight: "192g",
    waterResistant: "IP54",
    fiveG: false,
    nfc: false,
    category: "budget",
  },
  {
    id: "infinix-note-50-pro",
    name: "Infinix Note 50 Pro",
    brand: "Infinix",
    price: 45999,
    originalPrice: 49999,
    image: "📱",
    badge: "Large Battery",
    badgeColor: "bg-amber-500/10 text-amber-400",
    rating: 4.2,
    released: "2026-04",
    os: "Android 15, XOS 15",
    display: "AMOLED",
    displaySize: '6.78"',
    displayRefresh: "120Hz",
    processor: "Helio G100",
    ram: "8GB",
    storage: "256GB",
    mainCamera: "108MP + 2MP",
    selfieCamera: "32MP",
    battery: "5500mAh",
    charging: "45W",
    weight: "198g",
    waterResistant: "IP54",
    fiveG: false,
    nfc: true,
    category: "budget",
  },
  {
    id: "realme-c75",
    name: "Realme C75",
    brand: "Realme",
    price: 29999,
    image: "📱",
    badge: "Entry",
    badgeColor: "bg-teal-500/10 text-teal-400",
    rating: 3.9,
    released: "2026-02",
    os: "Android 15, Realme UI 5",
    display: "IPS LCD",
    displaySize: '6.72"',
    displayRefresh: "90Hz",
    processor: "Helio G85",
    ram: "6GB",
    storage: "128GB",
    mainCamera: "50MP + 0.3MP",
    selfieCamera: "8MP",
    battery: "6000mAh",
    charging: "33W",
    weight: "204g",
    waterResistant: "IP64",
    fiveG: false,
    nfc: false,
    category: "budget",
  },
  {
    id: "redmi-note-15-pro",
    name: "Redmi Note 15 Pro",
    brand: "Xiaomi",
    price: 42999,
    image: "📱",
    badge: "Popular",
    badgeColor: "bg-red-500/10 text-red-400",
    rating: 4.3,
    released: "2026-01",
    os: "Android 16, HyperOS 3",
    display: "AMOLED",
    displaySize: '6.67"',
    displayRefresh: "120Hz",
    processor: "Snapdragon 7s Gen 3",
    ram: "8GB",
    storage: "256GB",
    mainCamera: "200MP + 8MP + 2MP",
    selfieCamera: "16MP",
    battery: "5500mAh",
    charging: "67W",
    weight: "189g",
    waterResistant: "IP64",
    fiveG: true,
    nfc: true,
    category: "budget",
  },
];

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
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-5 lg:grid-cols-10">
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
                <span className="text-lg">{phone.image}</span>
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
                    <div className="text-2xl mb-1">{phone.image}</div>
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
              <div className="relative bg-gradient-to-br from-muted to-surface p-6 text-center">
                <span className="text-6xl">{phone.image}</span>
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
