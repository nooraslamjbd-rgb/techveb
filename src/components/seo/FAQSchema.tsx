import JsonLd from "./JsonLd";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSchema({ items }: { items: FAQItem[] }) {
  const validItems = (items || []).filter(
    (item) =>
      String(item.question || "").trim().length > 0 &&
      String(item.answer || "").trim().length > 0
  );

  if (validItems.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
}
