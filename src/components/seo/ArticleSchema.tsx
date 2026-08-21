import JsonLd from "./JsonLd";

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  category?: string;
  tags?: string[];
  readingTime?: string;
}

export default function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = "TechVeb Team",
  publisher = "TechVeb",
  category,
  tags = [],
  readingTime,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: image || "https://techveb.com/og-default.png",
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://techveb.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
      logo: {
        "@type": "ImageObject",
        url: "https://techveb.com/logo-square.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(category && { articleSection: category }),
    ...(tags.length > 0 && { keywords: tags.join(", ") }),
    ...(readingTime && { timeRequired: readingTime }),
  };

  return <JsonLd data={schema} />;
}
