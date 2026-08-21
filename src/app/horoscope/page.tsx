import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Daily Horoscope - Zodiac Signs & Predictions | TechVeb",
  description:
    "Read your daily horoscope for all 12 zodiac signs. Love, career, health predictions and lucky numbers.",
  alternates: { canonical: "https://techveb.com/horoscope" },
  openGraph: {
    title: "Daily Horoscope - TechVeb",
    description: "Daily horoscope predictions for all zodiac signs.",
    url: "https://techveb.com/horoscope",
    type: "website",
  },
};

const zodiacSigns = [
  {
    name: "Aries",
    symbol: "♈",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    luckyNumber: 9,
    luckyColor: "Red",
    love: 4,
    career: 5,
    health: 4,
    prediction: "Today brings exciting opportunities for career growth. A chance meeting could lead to something special. Stay focused on your goals.",
    compatibility: "Leo",
  },
  {
    name: "Taurus",
    symbol: "♉",
    dates: "Apr 20 - May 20",
    element: "Earth",
    luckyNumber: 6,
    luckyColor: "Green",
    love: 5,
    career: 4,
    health: 3,
    prediction: "Financial matters look favorable today. Trust your instincts in business decisions. Romance is in the air this evening.",
    compatibility: "Virgo",
  },
  {
    name: "Gemini",
    symbol: "♊",
    dates: "May 21 - Jun 20",
    element: "Air",
    luckyNumber: 5,
    luckyColor: "Yellow",
    love: 3,
    career: 4,
    health: 5,
    prediction: "Communication skills are at their peak. Use this to resolve any pending issues. A creative project may gain momentum.",
    compatibility: "Libra",
  },
  {
    name: "Cancer",
    symbol: "♋",
    dates: "Jun 21 - Jul 22",
    element: "Water",
    luckyNumber: 2,
    luckyColor: "Silver",
    love: 5,
    career: 3,
    health: 4,
    prediction: "Family matters take priority today. Your nurturing nature will help someone close. Take time for self-care.",
    compatibility: "Scorpio",
  },
  {
    name: "Leo",
    symbol: "♌",
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    luckyNumber: 1,
    luckyColor: "Gold",
    love: 4,
    career: 5,
    health: 4,
    prediction: "Leadership opportunities abound. Your natural charisma attracts positive attention. A bold move in career pays off.",
    compatibility: "Sagittarius",
  },
  {
    name: "Virgo",
    symbol: "♍",
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    luckyNumber: 7,
    luckyColor: "Navy",
    love: 3,
    career: 5,
    health: 5,
    prediction: "Detail-oriented work pays dividends today. Health routines are showing results. A practical solution to an old problem emerges.",
    compatibility: "Taurus",
  },
  {
    name: "Libra",
    symbol: "♎",
    dates: "Sep 23 - Oct 22",
    element: "Air",
    luckyNumber: 3,
    luckyColor: "Pink",
    love: 5,
    career: 4,
    health: 4,
    prediction: "Balance is key today. Social connections bring joy and opportunities. A creative idea deserves your full attention.",
    compatibility: "Gemini",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    luckyNumber: 8,
    luckyColor: "Black",
    love: 4,
    career: 4,
    health: 3,
    prediction: "Intuition guides you to the right decisions. A mystery unfolds in your favor. Transformative energy surrounds you.",
    compatibility: "Cancer",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    luckyNumber: 3,
    luckyColor: "Purple",
    love: 3,
    career: 4,
    health: 5,
    prediction: "Adventure calls! Travel plans may materialize. An educational opportunity expands your horizons. Stay optimistic.",
    compatibility: "Leo",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    luckyNumber: 4,
    luckyColor: "Brown",
    love: 4,
    career: 5,
    health: 4,
    prediction: "Hard work pays off with a promotion or recognition. Financial planning yields positive results. Patience is your strength.",
    compatibility: "Taurus",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    dates: "Jan 20 - Feb 18",
    element: "Air",
    luckyNumber: 11,
    luckyColor: "Blue",
    love: 3,
    career: 4,
    health: 4,
    prediction: "Innovation drives your success today. A humanitarian project gains support. Friendship brings unexpected blessings.",
    compatibility: "Gemini",
  },
  {
    name: "Pisces",
    symbol: "♓",
    dates: "Feb 19 - Mar 20",
    element: "Water",
    luckyNumber: 7,
    luckyColor: "Sea Green",
    love: 5,
    career: 3,
    health: 4,
    prediction: "Creative inspiration flows freely. Spiritual insights bring peace. A dream may hold an important message.",
    compatibility: "Cancer",
  },
];

const elementColors: Record<string, string> = {
  Fire: "bg-red-500/10 text-red-600",
  Earth: "bg-green-500/10 text-green-600",
  Air: "bg-blue-500/10 text-blue-600",
  Water: "bg-cyan-500/10 text-cyan-600",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "opacity-100" : "opacity-30"}>★</span>
      ))}
    </span>
  );
}

export default function HoroscopePage() {
  const horoscopeJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Daily Horoscope - TechVeb",
    description: "Daily horoscope predictions for all zodiac signs",
    url: "https://techveb.com/horoscope",
  };

  return (
    <>
      <JsonLd data={horoscopeJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔮</span>
            <div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">Daily Horoscope</h1>
              <p className="text-muted-foreground text-sm">Your daily predictions for love, career, and health</p>
            </div>
          </div>
        </div>
      </section>

      {/* Zodiac Signs Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {zodiacSigns.map((sign) => (
            <div
              key={sign.name}
              className="rounded-xl border border-border bg-surface overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600/5 to-pink-600/5 px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{sign.symbol}</span>
                  <div>
                    <h2 className="font-heading font-bold text-lg text-foreground">{sign.name}</h2>
                    <p className="text-xs text-muted-foreground">{sign.dates}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${elementColors[sign.element]}`}>
                      {sign.element}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sign.prediction}</p>

                {/* Ratings */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Love</p>
                    <StarRating rating={sign.love} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Career</p>
                    <StarRating rating={sign.career} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Health</p>
                    <StarRating rating={sign.health} />
                  </div>
                </div>

                {/* Lucky Details */}
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span>🔢 Lucky: {sign.luckyNumber}</span>
                  <span>🎨 {sign.luckyColor}</span>
                  <span>💕 {sign.compatibility}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Tips */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
          <h2 className="font-heading text-xl font-bold mb-4">✨ Today&apos;s Astrological Highlights</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Best Day For", value: "Business meetings", icon: "💼" },
              { title: "Lucky Time", value: "10 AM - 2 PM", icon: "⏰" },
              { title: "Moon Phase", value: "Waxing Crescent", icon: "🌙" },
              { title: "Ruling Planet", value: "Mercury", icon: "☿️" },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg bg-surface border border-border p-3 text-center">
                <span className="text-2xl mb-1 block">{tip.icon}</span>
                <p className="text-[10px] text-muted-foreground">{tip.title}</p>
                <p className="text-xs font-bold text-foreground">{tip.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
