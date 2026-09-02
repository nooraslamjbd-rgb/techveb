import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English-Urdu Dictionary - TechVeb",
  description: "Search English to Urdu dictionary with pronunciation, meanings, examples, and synonyms. 160+ words with easy-to-understand translations.",
  alternates: { canonical: "https://techveb.com/dictionary" },
  openGraph: {
    title: "English-Urdu Dictionary - TechVeb",
    description: "Search English to Urdu dictionary with pronunciation, meanings, examples, and synonyms.",
    url: "https://techveb.com/dictionary",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "English-Urdu Dictionary" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "English-Urdu Dictionary - TechVeb",
    description: "Search English to Urdu dictionary with pronunciation, meanings, examples, and synonyms.",
    images: ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"],
  },
};

export default function DictionaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
