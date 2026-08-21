import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poetry - Ghazals, Nazms & Shayari | TechVeb",
  description: "Read the finest Urdu and English poetry - Ghazals, Nazms, Shayari, and couplets from legendary and contemporary poets.",
  openGraph: {
    title: "Poetry - Ghazals, Nazms & Shayari | TechVeb",
    description: "Read the finest Urdu and English poetry - Ghazals, Nazms, Shayari, and couplets from legendary and contemporary poets.",
    url: "https://techveb.com/poetry",
  },
};

interface Poet {
  name: string;
  era: string;
  famous: string[];
  avatar: string;
}

interface Poem {
  title: string;
  poet: string;
  type: "ghazal" | "nazm" | "couplet" | "sher";
  language: "urdu" | "english" | "both";
  lines: string[];
  meaning?: string;
  tags: string[];
  likes: number;
}

const poets: Poet[] = [
  { name: "Mirza Ghalib", era: "1797-1869", famous: ["Hazaar Khwahishein Aisi", "Dil-e-Nadan Tujhe Hua Kya Hai"], avatar: "🖋️" },
  { name: "Allama Iqbal", era: "1877-1938", famous: ["Lab Pe Aati Hai Dua", "Shikwa / Jawab-e-Shikwa"], avatar: "📚" },
  { name: "Faiz Ahmed Faiz", era: "1911-1984", famous: ["Mujh Se Pehli Si Mohabbat", "raqeeb se"], avatar: "✍️" },
  { name: "Mir Taqi Mir", era: "1723-1810", famous: ["Hawaon Mein Sarahe Sarahe", "Bhatke Rehte Hain"], avatar: "📜" },
  { name: "Ahmad Faraz", era: "1931-2008", famous: ["Ranjish Hi Sahi", "Ab Ke Hum Bichde"], avatar: "💫" },
  { name: "Parveen Shakir", era: "1952-1994", famous: ["Khushbu", "Kuch To Majbooriyan"], avatar: "🌸" },
  { name: "Wali Dakhani", era: "1667-1731", famous: ["Sabab-e-Muhabbat Kya Bataoon"], avatar: "📖" },
  { name: "John Elia", era: "1931-2002", famous: ["Shayad Woh Jaanti Hai", "Koi Baat Chale"], avatar: "🎭" },
];

const poems: Poem[] = [
  {
    title: "Hazaar Khwahishein Aisi",
    poet: "Mirza Ghalib",
    type: "ghazal",
    language: "urdu",
    lines: [
      "Hazaar khwahishein aisi ke har khwahish pe dam nikle",
      "Bahut nikle mere armaan lekin phir bhi kam nikle",
      "",
      "Na main jaanaa jun-ko na woh jaane mast-e-daraa",
      "Ke kis ka kaun hai tu, tera kaun hai tera",
      "",
      "Mohsin se dil ne wa'ista kiya hai jo har roz",
      "Bakhshish ke badle dard-e-dil ka sauda karte hain",
    ],
    meaning: "A thousand desires, each worth dying for. Many of my wishes were fulfilled, yet still they feel too few.",
    tags: ["love", "longing", "classic"],
    likes: 12450,
  },
  {
    title: "Lab Pe Aati Hai Dua",
    poet: "Allama Iqbal",
    type: "nazm",
    language: "urdu",
    lines: [
      "Lab pe aati hai dua ban ke tamanna meri",
      "Zindagi sham'a ki soorat ho Khudaya meri",
      "",
      "Door duniya ka mere dam se andhera ho jaaye",
      "Har jagah mere chamakne se ujala ho jaaye",
      "",
      "Ho meri ummat ke dil mein itna chaah ki har qadam",
      "Mere josh-e-dil se har qadam pe ujaala ho jaaye",
    ],
    meaning: "A prayer comes to my lips as a wish: may my life be like a candle's light. May darkness be removed by my presence, and every step illuminate the world.",
    tags: ["prayer", "patriotic", "inspirational"],
    likes: 15200,
  },
  {
    title: "Mujh Se Pehli Si Mohabbat",
    poet: "Faiz Ahmed Faiz",
    type: "ghazal",
    language: "urdu",
    lines: [
      "Mujh se pehli si mohabbat mere mehboob na maang",
      "",
      "Maine samjha tha ke tu hai to darakhshaan hoga",
      "Meri wafaon ka rang aur tanha main kya hoga",
      "",
      "Woh jo hum mein tum mein qaraar tha tum yaad karo",
      "Woh jo yaun qaraar tha tum yaad karo",
    ],
    meaning: "Don't ask me for the same love again, my beloved. I thought with you everything would shine, but my faithfulness alone means nothing.",
    tags: ["love", "philosophical", "classic"],
    likes: 9800,
  },
  {
    title: "Ranjish Hi Sahi",
    poet: "Ahmad Faraz",
    type: "ghazal",
    language: "urdu",
    lines: [
      "Ranjish hi sahi dil hi dukhaane ke liye aa",
      "Aa phir se mujhe chhod ke jaane ke liye aa",
      "",
      "Ek umr se hoon laal-e-yar mein mrange hue",
      "Na teri shan na tera ilzaam ke liye aa",
    ],
    meaning: "Come, even if it's to resent me, to break my heart. Come once more, even if just to leave me again. For ages I have been burning in your fire.",
    tags: ["love", "heartbreak", "famous"],
    likes: 18500,
  },
  {
    title: "Shayad Woh Jaanti Hai",
    poet: "John Elia",
    type: "ghazal",
    language: "urdu",
    lines: [
      "Shayad woh jaanti hai ki main kya kya sochta hoon",
      "Woh mera waqt badal rahi hai main uska",
      "",
      "Kuch to maqsad hai uska jo woh milti hai",
      "Woh mujh se milti hai to kuch to sochti hai",
    ],
    meaning: "Perhaps she knows what I keep thinking. She is changing my time, and I am losing hers. There must be some purpose when she meets me.",
    tags: ["love", "mystery", "contemporary"],
    likes: 7600,
  },
  {
    title: "Sar-e-Wadi-e-Gul",
    poet: "Mir Taqi Mir",
    type: "nazm",
    language: "urdu",
    lines: [
      "Sar-e-Wadi-e-Gul Bare Sar-e-Chaman Hon Ga",
      "Hamein Aaram Hai Ab Bazaar-e-Jaan Hon Ga",
      "",
      "Ye Jo Dard Ke Haath Se Lipta Hua Hai Dil",
      "Ye Dard Bhi Zamaane Ki Shanakht-e-Jan Hon Ga",
    ],
    meaning: "At the head of the valley of flowers, at the garden's edge, I shall rest. This pain that clings to my heart will become the signature of the age.",
    tags: ["pain", "beauty", "classic"],
    likes: 5400,
  },
  {
    title: "Ae Kuch Abr-e-Khuda Se",
    poet: "Mirza Ghalib",
    type: "couplet",
    language: "urdu",
    lines: [
      "Ae kuchh abr-e-khudā se aaisā barse ke fasl-e-gul",
      "Khilne lage sab shāḳhoñ pe baatīñ badal ke baad",
    ],
    meaning: "May the cloud of God rain in such a way that the season of flowers blooms, and all branches blossom after the storm of words.",
    tags: ["nature", "hope", "classic"],
    likes: 4200,
  },
  {
    title: "Where Words Fail",
    poet: "Rumi (English Translation)",
    type: "nazm",
    language: "english",
    lines: [
      "Where words fail, music speaks.",
      "Where silence breaks, the soul awakens.",
      "",
      "The wound is the place where the Light enters you.",
      "Do not feel lonely, the entire universe is inside you.",
      "",
      "Let yourself be silently drawn",
      "by the strange pull of what you really love.",
    ],
    meaning: "Rumi's timeless wisdom about the power of silence, love, and inner light.",
    tags: ["wisdom", "spiritual", "classic"],
    likes: 22000,
  },
  {
    title: "I Measure Every Grief",
    poet: "Emily Dickinson (English)",
    type: "nazm",
    language: "english",
    lines: [
      "I measure every Grief I meet",
      "With narrow, probing, eyes –",
      "I wonder if It weighs like Mine –",
      "Or has an Easier size.",
      "",
      "I note the timelines – and compare",
      "I contemplate who shall be at rest –",
      "And who among the living – yet –",
      "Shall bear the heaviest test.",
    ],
    meaning: "Dickinson explores how we measure our suffering against others, seeking connection in shared grief.",
    tags: ["philosophy", "grief", "classic"],
    likes: 8900,
  },
  {
    title: "Ishq Mujhko Nahin Sahi",
    poet: "Mirza Ghalib",
    type: "ghazal",
    language: "urdu",
    lines: [
      "Ishq mujhko nahin sahii woh jahaan sahi",
      "Jung-e-ishq sahi, jang-e-jaan sahi",
      "",
      "Woh jo shak ho to khud ko jala de sahi",
      "Ishq pe koi zarf ka imtihaan sahi",
    ],
    meaning: "If love is not for me, then the world is. If it means war of love, war of life, so be it. Let one who doubts burn themselves; let love be tested by elegance.",
    tags: ["love", "defiance", "classic"],
    likes: 6300,
  },
  {
    title: "The Road Not Taken",
    poet: "Robert Frost (English)",
    type: "nazm",
    language: "english",
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;",
      "",
      "I took the one less traveled by,",
      "And that has made all the difference.",
    ],
    meaning: "Frost reflects on the choices we make in life and how they define our journey.",
    tags: ["life", "choices", "classic"],
    likes: 25000,
  },
  {
    title: "Dard Bhi Mera",
    poet: "Parveen Shakir",
    type: "ghazal",
    language: "urdu",
    lines: [
      "Dard bhi mera had se guzar gaya",
      "Gham se ab koi kaam guzar gaya",
      "",
      "Meri rāhoñ mein khushbū ke paīche hain",
      "Mere dil kī dahleez se guzar gaya",
    ],
    meaning: "My pain has crossed all limits, grief has served its purpose. Fragrance has left footprints in my paths as someone crossed my heart's threshold.",
    tags: ["pain", "love", "contemporary"],
    likes: 7100,
  },
];

const categories = [
  { name: "Ghazals", icon: "🌙", count: poems.filter((p) => p.type === "ghazal").length, color: "#8B5CF6" },
  { name: "Nazms", icon: "📖", count: poems.filter((p) => p.type === "nazm").length, color: "#EC4899" },
  { name: "Sher / Couplets", icon: "💎", count: poems.filter((p) => p.type === "couplet").length, color: "#F59E0B" },
  { name: "English Poetry", icon: "🌍", count: poems.filter((p) => p.language === "english").length, color: "#10B981" },
  { name: "Classic", icon: "🏛️", count: poems.filter((p) => p.tags.includes("classic")).length, color: "#6366F1" },
  { name: "Love Poetry", icon: "❤️", count: poems.filter((p) => p.tags.includes("love")).length, color: "#EF4444" },
];

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function PoetryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
          🪶 Poetry & Shayari
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Read the finest Urdu and English poetry — Ghazals, Nazms, and Couplets from legendary and contemporary poets
        </p>
      </div>

      {/* Categories */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="group rounded-xl border border-border bg-surface p-4 text-center transition-all hover:border-primary/30 hover:shadow-md"
          >
            <span className="mb-2 block text-2xl">{cat.icon}</span>
            <p className="text-sm font-semibold text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{cat.count} pieces</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          {/* Featured Poem */}
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Featured</span>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-500">Ghazal</span>
            </div>
            <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">{poems[0].title}</h2>
            <p className="mb-4 text-sm text-primary">{poems[0].poet}</p>
            <div className="space-y-1 font-urdu text-lg leading-relaxed text-foreground/90" dir="rtl">
              {poems[0].lines.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-3" />
                ) : (
                  <p key={i} className="font-heading">{line}</p>
                )
              )}
            </div>
            {poems[0].meaning && (
              <div className="mt-4 rounded-lg bg-background/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meaning</p>
                <p className="mt-1 text-sm text-muted">{poems[0].meaning}</p>
              </div>
            )}
            <div className="mt-4 flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                ❤️ {formatLikes(poems[0].likes)}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                📋 Copy
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                📤 Share
              </button>
            </div>
          </div>

          {/* All Poems */}
          <div className="space-y-6">
            {poems.slice(1).map((poem, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                    style={{
                      backgroundColor:
                        poem.type === "ghazal" ? "#8B5CF6" : poem.type === "nazm" ? "#EC4899" : "#F59E0B",
                    }}
                  >
                    {poem.type === "couplet" ? "Sher" : poem.type.charAt(0).toUpperCase() + poem.type.slice(1)}
                  </span>
                  {poem.language === "english" && (
                    <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                      English
                    </span>
                  )}
                  {poem.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted-foreground border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="mb-1 font-heading text-xl font-bold text-foreground">{poem.title}</h3>
                <p className="mb-3 text-sm text-primary">{poem.poet}</p>
                <div className={`space-y-1 leading-relaxed text-foreground/90 ${poem.language === "urdu" ? "font-urdu text-lg" : "text-base"}`} dir={poem.language === "urdu" ? "rtl" : "ltr"}>
                  {poem.lines.map((line, i) =>
                    line === "" ? (
                      <div key={i} className="h-3" />
                    ) : (
                      <p key={i} className={poem.language === "urdu" ? "font-heading" : ""}>{line}</p>
                    )
                  )}
                </div>
                {poem.meaning && (
                  <div className="mt-3 rounded-lg bg-background/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meaning</p>
                    <p className="mt-1 text-sm text-muted">{poem.meaning}</p>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>❤️ {formatLikes(poem.likes)}</span>
                  <button className="hover:text-primary transition-colors">📋 Copy</button>
                  <button className="hover:text-primary transition-colors">📤 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 space-y-6 lg:w-72">
          {/* Poets */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Famous Poets</h3>
            <div className="space-y-3">
              {poets.map((poet) => (
                <div key={poet.name} className="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-background">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{poet.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary">{poet.name}</p>
                      <p className="text-xs text-muted-foreground">{poet.era}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {["love", "life", "pain", "classic", "wisdom", "hope", "nature", "spiritual", "philosophy", "heartbreak"].map((tag) => (
                <span key={tag} className="cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Daily Sher */}
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-5">
            <h3 className="mb-3 font-heading text-lg font-bold text-foreground">✨ Sher of the Day</h3>
            <div className="font-urdu text-base leading-relaxed text-foreground/90" dir="rtl">
              <p className="font-heading"> log to milte hain bazaar mein</p>
              <p className="font-heading">dil wale kahan milte hain</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">— John Elia</p>
          </div>

          {/* Poem of the Day */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-heading text-lg font-bold text-foreground">🌅 Poem of the Day</h3>
            <p className="text-sm font-semibold text-foreground">Where Words Fail</p>
            <p className="text-xs text-primary">Rumi (English Translation)</p>
            <p className="mt-2 text-sm text-muted">The wound is the place where the Light enters you...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
