const categoryDirMap: Record<string, string> = {
  ai: "ai-tools",
  "product-reviews": "reviews",
  reviews: "reviews",
};

export function getDirFromCategory(category: string): string {
  return categoryDirMap[category] || "blog";
}

interface CategoryMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  keywords: string[];
  schemaName: string;
}

const categoryMetaMap: Record<string, CategoryMeta> = {
  ai: {
    title: "Artificial Intelligence News & Guides | TechVeb",
    description: "Latest AI news, tools, tutorials, and guides. ChatGPT, Claude, Gemini, machine learning, and deep learning coverage.",
    ogTitle: "AI News & Guides - TechVeb",
    ogDescription: "Your source for artificial intelligence news, tools, and tutorials.",
    twitterTitle: "AI News & Guides - TechVeb",
    twitterDescription: "Latest AI news, tools, and tutorials.",
    keywords: ["artificial intelligence", "AI", "ChatGPT", "machine learning", "deep learning", "LLM", "AI tools"],
    schemaName: "Artificial Intelligence",
  },
  "tech-news": {
    title: "Technology News - Breaking Tech Updates | TechVeb",
    description: "Breaking technology news covering AI, smartphones, cloud computing, cybersecurity, and more from trusted sources.",
    ogTitle: "Tech News - TechVeb",
    ogDescription: "Breaking technology news from trusted sources.",
    twitterTitle: "Tech News - TechVeb",
    twitterDescription: "Breaking technology news.",
    keywords: ["technology news", "tech news", "breaking news", "AI news", "startup news"],
    schemaName: "Tech News",
  },
  "product-reviews": {
    title: "Product Reviews - Best Tech Products 2026 | TechVeb",
    description: "In-depth reviews of the best laptops, phones, monitors, headphones, and tech products. Expert buying guides.",
    ogTitle: "Product Reviews - TechVeb",
    ogDescription: "Expert reviews of the best tech products.",
    twitterTitle: "Product Reviews - TechVeb",
    twitterDescription: "Expert reviews of the best tech products.",
    keywords: ["product reviews", "best laptops", "best phones", "tech reviews", "buying guide"],
    schemaName: "Product Reviews",
  },
  tutorials: {
    title: "Tutorials & Guides - Learn Technology | TechVeb",
    description: "Step-by-step tutorials and comprehensive guides for cloud computing, programming, DevOps, and technology.",
    ogTitle: "Tutorials & Guides - TechVeb",
    ogDescription: "Step-by-step tutorials and technology guides.",
    twitterTitle: "Tutorials & Guides - TechVeb",
    twitterDescription: "Step-by-step tutorials and technology guides.",
    keywords: ["tutorials", "guides", "how to", "step by step", "learn programming", "cloud tutorial"],
    schemaName: "Tutorials",
  },
  cloud: {
    title: "Cloud Computing News & Guides | TechVeb",
    description: "AWS, Azure, Google Cloud tutorials, news, and guides. Serverless, Kubernetes, and cloud architecture coverage.",
    ogTitle: "Cloud Computing - TechVeb",
    ogDescription: "Cloud computing news, tutorials, and guides.",
    twitterTitle: "Cloud Computing - TechVeb",
    twitterDescription: "Cloud computing news and tutorials.",
    keywords: ["cloud computing", "AWS", "Azure", "Google Cloud", "serverless", "Kubernetes"],
    schemaName: "Cloud Computing",
  },
  cybersecurity: {
    title: "Cybersecurity News & Guides | TechVeb",
    description: "Latest cybersecurity news, threat alerts, security guides, and privacy tips. Stay safe online.",
    ogTitle: "Cybersecurity - TechVeb",
    ogDescription: "Cybersecurity news, threats, and guides.",
    twitterTitle: "Cybersecurity - TechVeb",
    twitterDescription: "Cybersecurity news and guides.",
    keywords: ["cybersecurity", "security", "hacking", "data breach", "privacy", "encryption"],
    schemaName: "Cybersecurity",
  },
  gaming: {
    title: "Gaming Tech News & Reviews | TechVeb",
    description: "Gaming hardware reviews, game news, PC building guides, and esports coverage. PS5, Xbox, PC gaming.",
    ogTitle: "Gaming Tech - TechVeb",
    ogDescription: "Gaming hardware, news, and reviews.",
    twitterTitle: "Gaming Tech - TechVeb",
    twitterDescription: "Gaming hardware, news, and reviews.",
    keywords: ["gaming", "PC gaming", "PS5", "Xbox", "gaming PC", "esports", "game reviews"],
    schemaName: "Gaming Tech",
  },
  "emerging-tech": {
    title: "Emerging Technology News | TechVeb",
    description: "Quantum computing, robotics, space tech, blockchain, and cutting-edge technology news and analysis.",
    ogTitle: "Emerging Tech - TechVeb",
    ogDescription: "Cutting-edge technology news and analysis.",
    twitterTitle: "Emerging Tech - TechVeb",
    twitterDescription: "Cutting-edge technology news.",
    keywords: ["emerging tech", "quantum computing", "robotics", "space tech", "blockchain", "future technology"],
    schemaName: "Emerging Technology",
  },
  blog: {
    title: "Tech Blog - Insights & Analysis | TechVeb",
    description: "In-depth technology insights, analysis, and opinion pieces on AI, cloud, cybersecurity, and the tech industry.",
    ogTitle: "Tech Blog - TechVeb",
    ogDescription: "In-depth technology insights and analysis.",
    twitterTitle: "Tech Blog - TechVeb",
    twitterDescription: "In-depth technology insights.",
    keywords: ["tech blog", "technology insights", "tech analysis", "AI analysis", "industry trends"],
    schemaName: "Tech Blog",
  },
  coding: {
    title: "Coding Tutorials & Programming Guides | TechVeb",
    description: "Programming tutorials, code guides, and developer resources. Python, JavaScript, TypeScript, and more.",
    ogTitle: "Coding - TechVeb",
    ogDescription: "Programming tutorials and developer guides.",
    twitterTitle: "Coding - TechVeb",
    twitterDescription: "Programming tutorials and guides.",
    keywords: ["coding", "programming", "Python", "JavaScript", "TypeScript", "developer tutorial"],
    schemaName: "Coding",
  },
};

export function getCategoryMeta(slug: string): CategoryMeta {
  return categoryMetaMap[slug] || {
    title: "TechVeb - Technology News & Guides",
    description: "Latest technology news, guides, and reviews on AI, cloud, cybersecurity, and more.",
    ogTitle: "TechVeb",
    ogDescription: "Technology news and guides.",
    twitterTitle: "TechVeb",
    twitterDescription: "Technology news and guides.",
    keywords: ["technology", "tech news", "AI", "coding"],
    schemaName: "Technology",
  };
}

export function getCategoryJsonLd(slug: string, url: string) {
  const meta = getCategoryMeta(slug);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.title,
    description: meta.description,
    url,
    publisher: {
      "@type": "Organization",
      name: "TechVeb",
      url: "https://techveb.com",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://techveb.com" },
        { "@type": "ListItem", position: 2, name: meta.schemaName, item: url },
      ],
    },
  };
}
