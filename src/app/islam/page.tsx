import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Islam - Prayer Times, Quran, Islamic Content | TechVeb",
  description:
    "Prayer times, Quran recitation, Islamic calendar, Hadith, and daily Islamic reminders.",
  alternates: { canonical: "https://techveb.com/islam" },
  openGraph: {
    title: "Islam - TechVeb",
    description: "Prayer times, Quran, Islamic calendar, and Hadith.",
    url: "https://techveb.com/islam",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "TechVeb" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Islam - TechVeb",
    description: "Prayer times, Quran, Islamic calendar, and Hadith.",
  },
};

const prayerTimes = [
  { name: "Fajr", time: "4:49 AM", icon: "🌅" },
  { name: "Sunrise", time: "6:08 AM", icon: "☀️" },
  { name: "Dhuhr", time: "12:35 PM", icon: "🌤️" },
  { name: "Asr", time: "5:10 PM", icon: "⛅" },
  { name: "Maghrib", time: "7:01 PM", icon: "🌅" },
  { name: "Isha", time: "8:21 PM", icon: "🌙" },
];

const islamicLinks = [
  { title: "Quran Kareem", desc: "Read & listen to the Holy Quran", icon: "📖", href: "#quran" },
  { title: "Hadith", desc: "Sahih Bukhari, Muslim & more", icon: "📜", href: "#hadith" },
  { title: "Islamic Calendar", desc: "Hijri dates & events", icon: "📅", href: "#calendar" },
  { title: "Masnoon Duain", desc: "Daily supplications & prayers", icon: "🤲", href: "#duain" },
  { title: "Islamic Names", desc: "Baby names with meanings", icon: "👶", href: "#names" },
  { title: "Daily Reminders", desc: "Ayat & Hadith of the day", icon: "💡", href: "#reminders" },
];

export default function IslamPage() {
  const islamJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Islam - TechVeb",
    description: "Prayer times, Quran, Islamic calendar, and Hadith",
    url: "https://techveb.com/islam",
  };

  const today = new Date();
  const hijriDate = "7 Rabi-ul-Awwal 1448";

  return (
    <>
      <JsonLd data={islamJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">☪️</span>
            <div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">Islam</h1>
              <p className="text-muted-foreground text-sm">{hijriDate} • {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Times */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
            <h2 className="text-white font-heading font-bold text-lg flex items-center gap-2">
              <span>🕌</span> Prayer Times - Karachi
            </h2>
            <p className="text-white/70 text-xs">Times may vary slightly</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-0">
            {prayerTimes.map((prayer, idx) => (
              <div key={prayer.name} className={`p-4 text-center ${idx < prayerTimes.length - 1 ? "border-r border-emerald-500/10" : ""}`}>
                <span className="text-xl mb-1 block">{prayer.icon}</span>
                <p className="text-xs font-medium text-foreground mb-1">{prayer.name}</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{prayer.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ayat & Hadith of the Day */}
      <section id="quran" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Ayat */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📖</span>
              <h3 className="font-heading font-bold">Ayat of the Day</h3>
            </div>
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 mb-3">
              <p className="text-lg leading-relaxed text-foreground font-arabic text-center" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic mb-2">
              &quot;In the name of Allah, the Most Gracious, the Most Merciful&quot;
            </p>
            <p className="text-xs text-muted-foreground">— Surah Al-Fatiha (1:1)</p>
          </div>

          {/* Hadith */}
          <div id="hadith" className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📜</span>
              <h3 className="font-heading font-bold">Hadith of the Day</h3>
            </div>
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 mb-3">
              <p className="text-sm leading-relaxed text-foreground italic">
                &quot;The best of people are those that bring most benefit to the rest of mankind.&quot;
              </p>
            </div>
            <p className="text-xs text-muted-foreground">— Prophet Muhammad ﷺ (Tabarani)</p>
          </div>
        </div>
      </section>

      {/* Islamic Links Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Explore Islamic Content</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {islamicLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group rounded-xl border border-border bg-surface p-5 hover:shadow-md hover:border-emerald-500/30 transition-all"
            >
              <span className="text-3xl mb-3 block">{link.icon}</span>
              <h3 className="font-heading font-bold text-foreground group-hover:text-emerald-600 transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Masnoon Duain */}
      <section id="duain" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Masnoon Duain</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Before Sleeping", arabic: "\u0627\u0644\u0644\u0647\u0648\u0645 \u0628\u0643\u064E \u0623\u064E\u0636\u064E\u0639\u0650\u062A\u064F \u0633\u064E\u0644\u064E\u0633\u064E \u0642\u064E\u0644\u0628\u0650\u064A", translation: "O Allah, I entrust my soul to You" },
            { title: "Waking Up", arabic: "\u0627\u0644\u064D\u062D\u064E\u0645\u062F\u064F \u0644\u0650\u0644\u0651\u064E\u0644\u0650\u0647\u0650 \u0631\u064E\u0628\u0651\u064E \u0627\u0644\u0639\u064E\u0627\u0644\u064E\u0645\u0650\u064A\u0646\u064E", translation: "All praise is for Allah who gave us life" },
            { title: "Before Eating", arabic: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650", translation: "In the name of Allah, the Most Gracious, the Most Merciful" },
          ].map((dua, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <p className="font-bold text-sm text-foreground mb-2">{dua.title}</p>
              <p className="text-lg text-foreground font-arabic text-center mb-2" dir="rtl">{dua.arabic}</p>
              <p className="text-xs text-muted-foreground italic">{dua.translation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Islamic Names */}
      <section id="names" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Islamic Baby Names</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Muhammad", meaning: "Praised", gender: "M" },
            { name: "Fatima", meaning: "Captivating", gender: "F" },
            { name: "Ali", meaning: "Elevated", gender: "M" },
            { name: "Ayesha", meaning: "Alive, thriving", gender: "F" },
            { name: "Omar", meaning: "Long-lived", gender: "M" },
            { name: "Zainab", meaning: "Fragrant flower", gender: "F" },
            { name: "Hasan", meaning: "Handsome", gender: "M" },
            { name: "Maryam", meaning: "Pious", gender: "F" },
          ].map((n, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-3 text-center">
              <p className="font-bold text-foreground">{n.name}</p>
              <p className="text-xs text-muted-foreground">{n.meaning}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${n.gender === "M" ? "text-blue-600 bg-blue-500/10" : "text-pink-600 bg-pink-500/10"}`}>
                {n.gender === "M" ? "Boy" : "Girl"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Reminders */}
      <section id="reminders" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Daily Reminders</h2>
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 mb-3">
            <p className="text-sm leading-relaxed text-foreground italic">
              &quot;Whoever puts his trust in Allah, He will be sufficient for him.&quot;
            </p>
          </div>
          <p className="text-xs text-muted-foreground">— Prophet Muhammad &#xFDFB; (At-Tirmidhi 2389)</p>
        </div>
      </section>

      {/* Islamic Events */}
      <section id="calendar" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Upcoming Islamic Events</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { event: "Eid Milad-un-Nabi", date: "5 Sep 2026", days: "15 days", icon: "🌙" },
            { event: "Shab-e-Meraj", date: "26 Jan 2027", icon: "✨", days: "158 days" },
            { event: "Shab-e-Barat", date: "14 Feb 2027", icon: "🤲", days: "177 days" },
            { event: "Ramadan Start", date: "18 Feb 2027", icon: "🌙", days: "181 days" },
          ].map((event, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-surface p-4 text-center">
              <span className="text-3xl mb-2 block">{event.icon}</span>
              <h3 className="font-heading font-bold text-sm text-foreground mb-1">{event.event}</h3>
              <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                {event.days}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
