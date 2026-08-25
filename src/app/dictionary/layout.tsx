import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English-Urdu Dictionary - Learn Words | TechVeb",
  description: "Search English to Urdu dictionary with pronunciation, meanings, examples, and synonyms. Learn common English words used in daily conversation.",
  alternates: { canonical: "https://techveb.com/dictionary" },
  openGraph: {
    title: "English-Urdu Dictionary - Learn Words | TechVeb",
    description: "Search English to Urdu dictionary with pronunciation, meanings, examples, and synonyms.",
    url: "https://techveb.com/dictionary",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "English-Urdu Dictionary - Learn Words | TechVeb",
    description: "Search English to Urdu dictionary with pronunciation, meanings, examples, and synonyms.",
  },
};

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
