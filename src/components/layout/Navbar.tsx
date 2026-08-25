"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import DarkModeToggle from "../ui/DarkModeToggle";
import SearchModal from "../ui/SearchModal";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

const NEWSLETTER_FORMSPREE = "https://formspree.io/f/xpwzknzl";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [focusedDropdown, setFocusedDropdown] = useState<string | null>(null);
  const activeDropdown = hoveredDropdown || focusedDropdown;
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const subscribeRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setSubscribeOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (subscribeRef.current && !subscribeRef.current.contains(e.target as Node)) {
        setSubscribeOpen(false);
      }
    }
    if (subscribeOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [subscribeOpen]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subEmail) return;
    setSubStatus("loading");
    try {
      const res = await fetch(NEWSLETTER_FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail, _subject: "TechVeb Newsletter Subscription" }),
      });
      if (res.ok) { setSubStatus("success"); setSubEmail(""); }
      else { setSubStatus("error"); }
    } catch { setSubStatus("error"); }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-shadow ${
          scrolled ? "shadow-lg shadow-black/5" : ""
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-border group-hover:ring-primary/30 transition-all">
              <Image src="/logo-square.png" alt="TechVeb" fill className="object-contain p-1" priority />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight">
              Tech<span className="text-primary">Veb</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {siteConfig.navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const hasDropdown = item.children && item.children.length > 0;
              return (
                <li key={item.href} className="relative"
                  onMouseEnter={() => hasDropdown && setHoveredDropdown(item.href)}
                  onMouseLeave={() => hasDropdown && setHoveredDropdown(null)}>
                  <Link href={item.href}
                    aria-haspopup={hasDropdown ? "true" : undefined}
                    aria-expanded={hasDropdown ? activeDropdown === item.href : undefined}
                    onKeyDown={(e) => {
                      if (hasDropdown && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        setFocusedDropdown(activeDropdown === item.href ? null : item.href);
                      } else if (e.key === "Escape") {
                        setFocusedDropdown(null);
                      }
                    }}
                    onBlur={() => setTimeout(() => setFocusedDropdown(null), 150)}
                    className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {item.label}
                    {hasDropdown && (
                      <svg className={`h-3 w-3 transition-transform ${activeDropdown === item.href ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />}
                  </Link>
                  {hasDropdown && activeDropdown === item.href && (
                    <div role="menu" className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-border bg-background p-2 shadow-xl animate-slide-down">
                      {item.children!.map((child) => (
                        <Link key={child.href} href={child.href} role="menuitem"
                          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground transition-colors" aria-label="Search">
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/feed.xml"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
              aria-label="RSS Feed" target="_blank">
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </Link>
            <div className="hidden sm:flex">
              <DarkModeToggle />
            </div>

            {/* Subscribe Dropdown */}
            <div className="relative hidden lg:block" ref={subscribeRef}>
              <button onClick={() => setSubscribeOpen(!subscribeOpen)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Subscribe
              </button>
              {subscribeOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-background p-4 shadow-xl animate-slide-down">
                  {subStatus === "success" ? (
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground">You&apos;re subscribed!</p>
                      <p className="mt-1 text-xs text-muted-foreground">Check your email to confirm.</p>
                      <div className="mt-3 border-t border-border pt-3">
                        <Link href="/feed.xml" target="_blank" className="text-xs text-primary hover:underline">
                          Or follow via RSS feed &rarr;
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe}>
                      <p className="mb-1 text-sm font-semibold text-foreground">Stay updated</p>
                      <p className="mb-3 text-xs text-muted-foreground">Get the latest tech insights delivered to your inbox.</p>
                      <div className="flex gap-2">
                        <input type="email" required value={subEmail} onChange={(e) => setSubEmail(e.target.value)}
                          placeholder="your@email.com" disabled={subStatus === "loading"}
                          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary" />
                        <button type="submit" disabled={subStatus === "loading"}
                          className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                          {subStatus === "loading" ? "..." : "Go"}
                        </button>
                      </div>
                      {subStatus === "error" && (
                        <p className="mt-2 text-xs text-red-400">Something went wrong. Try again.</p>
                      )}
                      <Link href="/feed.xml" target="_blank" className="mt-2 block text-xs text-muted-foreground hover:text-primary">
                        or subscribe via RSS &rarr;
                      </Link>
                    </form>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface md:hidden" aria-label="Toggle menu">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="animate-slide-down border-t border-border bg-background px-4 pb-4 md:hidden">
            <div className="mb-3 pt-3">
              <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search articles...
                <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[10px]">Ctrl+K</kbd>
              </button>
            </div>
            <ul className="space-y-0.5">
              {siteConfig.navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const hasDropdown = item.children && item.children.length > 0;
                const isExpanded = mobileExpanded === item.href;
                return (
                  <li key={item.href}>
                    <div className="flex items-center">
                      <Link href={item.href}
                        className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground"}`}>
                        {item.label}
                      </Link>
                      {hasDropdown && (
                        <button onClick={() => setMobileExpanded(isExpanded ? null : item.href)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface">
                          <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {hasDropdown && isExpanded && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 space-y-2 border-t border-border pt-3">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input type="email" required value={subEmail} onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="Your email for updates" disabled={subStatus === "loading"}
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary" />
                <button type="submit" disabled={subStatus === "loading"}
                  className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {subStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
              {subStatus === "success" && (
                <p className="text-xs text-green-400">Subscribed! Check your email to confirm.</p>
              )}
              <div className="flex items-center justify-center gap-3">
                <DarkModeToggle />
                <Link href="/feed.xml" target="_blank" className="text-xs text-muted-foreground hover:text-primary">RSS Feed</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
