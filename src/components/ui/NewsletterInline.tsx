"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("https://formspree.io/f/xpwzknzl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, _subject: "TechVeb Newsletter Subscription" }),
      });
      if (res.ok) { setStatus("success"); setEmail(""); }
      else { setStatus("error"); }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="my-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mb-1 font-heading text-lg font-bold">Stay in the loop</h3>
        <p className="mb-4 text-sm text-muted max-w-md">Get the latest tech news and AI insights delivered to your inbox. No spam, unsubscribe anytime.</p>
        {status === "success" ? (
          <div className="rounded-xl bg-green-500/10 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
            Thanks for subscribing! Check your email to confirm.
            <span className="block text-xs font-normal text-muted-foreground mt-1">
              Or subscribe via <a href="/feed.xml" target="_blank" className="underline hover:text-primary">RSS feed</a>
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-2 text-xs text-muted-foreground">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
