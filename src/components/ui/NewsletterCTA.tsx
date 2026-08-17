"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterCTA() {
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

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="my-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-12 text-center text-white">
      <h2 className="mb-3 font-heading text-2xl sm:text-3xl font-bold">
        Stay Ahead of the Curve
      </h2>
      <p className="mb-6 mx-auto max-w-md text-white/80">
        Get the latest tech insights, AI trends, and product reviews delivered
        straight to your inbox. No spam, just quality content.
      </p>

      {status === "success" ? (
        <div className="mx-auto max-w-md rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Thanks for subscribing! Check your email to confirm.</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-white/90 disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-white/70">
          Something went wrong. Please try again or email us at{" "}
          <a href="mailto:nooraslamjbd@gmail.com" className="underline">
            nooraslamjbd@gmail.com
          </a>
        </p>
      )}
    </section>
  );
}
