import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const socialIcons: { key: keyof typeof siteConfig.social; label: string; path: string }[] = [
  { key: "twitter", label: "X (Twitter)", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { key: "linkedin", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { key: "github", label: "GitHub", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .215.15.46.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
];

const hasSocial = socialIcons.some((s) => siteConfig.social[s.key]);

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
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

          {siteConfig.footerLinks.map((group, groupIdx) => (
            <div key={`${group.title}-${groupIdx}`}>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link, linkIdx) => (
                  <li key={`${link.label}-${linkIdx}`}>
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
        </div>

        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
