import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English-Urdu Dictionary | TechVeb",
  description: "A practical English to Urdu dictionary with pronunciations, meanings, examples, and synonyms.",
  alternates: { canonical: "https://techveb.com/dictionary" },
  robots: { index: false, follow: true },
};

export default function DictionaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}