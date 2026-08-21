import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const socialIcons: { key: keyof typeof siteConfig.social; label: string; path: string }[] = [
  { key: "twitter", label: "X (Twitter)", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { key: "linkedin", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { key: "youtube", label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];

const hasSocial = socialIcons.some((s) => siteConfig.social[s.key]);

const allCategories = [
  { label: "AI & ML", href: "/ai-tools" },
  { label: "Tech News", href: "/blog?cat=tech-news" },
  { label: "Reviews", href: "/reviews" },
  { label: "Cybersecurity", href: "/blog?cat=cybersecurity" },
  { label: "Cloud", href: "/blog?cat=cloud" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Gaming", href: "/blog?cat=gaming" },
  { label: "Programming", href: "/blog?cat=tutorials" },
  { label: "Emerging Tech", href: "/blog?cat=emerging-tech" },
  { label: "General", href: "/blog?cat=blog" },
  { label: "News", href: "/news" },
  { label: "Business", href: "/business" },
  { label: "Sports", href: "/sports" },
  { label: "Education", href: "/education" },
  { label: "Islam", href: "/islam" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                <Image src="/logo-square.png" alt="TechVeb" fill className="object-contain p-0.5" />
              </div>
              <span className="font-heading text-lg font-bold">
                Tech<span className="text-primary">Veb</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Your go-to source for the latest in technology, artificial
              intelligence, and digital innovation.
            </p>
            {hasSocial && (
              <div className="mt-4 flex gap-3">
                {socialIcons.map(({ key, label, path }) => {
                  const url = siteConfig.social[key];
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-muted-foreground hover:text-primary hover:ring-1 hover:ring-primary/30 transition-all"
                      aria-label={label}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={path} />
                      </svg>
                    </a>
                  );
                })}
              </div>
            )}
            <div className="mt-4">
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                RSS Feed
              </a>
            </div>
          </div>

          {siteConfig.footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Topics
            </h3>
            <ul className="space-y-2.5">
              {allCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
