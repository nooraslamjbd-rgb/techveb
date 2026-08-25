import categoriesData from "./categories.json";

export const siteConfig = {
  name: "TechVeb",
  title: "TechVeb - Technology, AI & Innovation Hub",
  description:
    "Your go-to source for the latest in technology, artificial intelligence, product reviews, and digital innovation. Stay informed with expert insights and in-depth analysis.",
  url: "https://techveb.com",
  ogImage: "/og-default.png",
  author: "TechVeb Team",
  email: "nooraslamjbd@gmail.com",
  phone: "+92 313 6473379",
  address: "Pakistan",
  social: {
    twitter: "https://x.com/techveb" as string,
    linkedin: "https://linkedin.com/company/techveb" as string,
    youtube: "" as string,
    facebook: "" as string,
    github: "https://github.com/nooraslamjbd-rgb/techveb" as string,
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    {
      label: "Blog",
      href: "/blog",
      children: [
        { label: "AI & Machine Learning", href: "/blog?cat=ai" },
        { label: "Tech News", href: "/blog?cat=tech-news" },
        { label: "Cloud & DevOps", href: "/blog?cat=cloud" },
        { label: "Cybersecurity", href: "/blog?cat=cybersecurity" },
        { label: "Programming", href: "/blog?cat=tutorials" },
        { label: "News", href: "/news" },
        { label: "Gaming", href: "/blog?cat=gaming" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
    { label: "Business", href: "/business" },
    { label: "Sports", href: "/sports" },
    {
      label: "More",
      href: "/blog",
      children: [
        { label: "Reviews", href: "/reviews" },
        { label: "AI Tools", href: "/ai-tools" },
        { label: "Mobiles", href: "/mobiles" },
        { label: "Recipes", href: "/recipes" },
        { label: "Horoscope", href: "/horoscope" },
        { label: "Dictionary", href: "/dictionary" },
        { label: "Poetry", href: "/poetry" },
        { label: "Quotes", href: "/quotes" },
        { label: "Jokes", href: "/jokes" },
        { label: "Education", href: "/education" },
        { label: "Islam", href: "/islam" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    {
      title: "Content",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "News", href: "/news" },
        { label: "Reviews", href: "/reviews" },
        { label: "AI Tools", href: "/ai-tools" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  categories: categoriesData,
};
