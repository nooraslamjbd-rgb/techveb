import JsonLd from "./JsonLd";

interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export default function WebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  author = "TechVeb Team",
}: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "TechVeb",
      url: "https://techveb.com",
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: author,
    },
  };

  return <JsonLd data={schema} />;
}
