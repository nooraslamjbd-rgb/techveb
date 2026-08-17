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
    twitter: "",
    linkedin: "",
    youtube: "",
    facebook: "",
    github: "",
  },
  navItems: [
    { label: "Home", href: "/" },
    {
      label: "Blog",
      href: "/blog",
      children: [
        { label: "AI & Machine Learning", href: "/blog?cat=ai" },
        { label: "Tech News", href: "/blog?cat=tech-news" },
        { label: "Cloud & DevOps", href: "/blog?cat=cloud" },
        { label: "Cybersecurity", href: "/blog?cat=cybersecurity" },
        { label: "Programming", href: "/blog?cat=tutorials" },
        { label: "Emerging Tech", href: "/blog?cat=emerging-tech" },
        { label: "Gaming", href: "/blog?cat=gaming" },
      ],
    },
    {
      label: "Reviews",
      href: "/reviews",
      children: [
        { label: "Laptops & PCs", href: "/reviews?cat=laptops" },
        { label: "Phones & Tablets", href: "/reviews?cat=phones" },
        { label: "Audio & Peripherals", href: "/reviews?cat=audio" },
        { label: "Smart Home", href: "/reviews?cat=smart-home" },
        { label: "Software & Apps", href: "/reviews?cat=software" },
      ],
    },
    { label: "AI Tools", href: "/ai-tools" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    {
      title: "Content",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Product Reviews", href: "/reviews" },
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
  categories: [
    { slug: "ai", label: "Artificial Intelligence", color: "#0060E0" },
    { slug: "tech-news", label: "Tech News", color: "#10B981" },
    { slug: "product-reviews", label: "Product Reviews", color: "#F59E0B" },
    { slug: "tutorials", label: "Tutorials & Guides", color: "#8B5CF6" },
    { slug: "cloud", label: "Cloud Computing", color: "#EC4899" },
    { slug: "cybersecurity", label: "Cybersecurity", color: "#EF4444" },
    { slug: "gaming", label: "Gaming Tech", color: "#F97316" },
    { slug: "emerging-tech", label: "Emerging Tech", color: "#06B6D4" },
  ],
};
