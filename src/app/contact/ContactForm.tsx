"use client";

import { useState, type FormEvent } from "react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact TechVeb",
    url: `${siteConfig.url}/contact`,
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://formspree.io/f/xpwzknzl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _subject: `TechVeb Contact: ${subject}`,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <h1 className="mb-3 font-heading text-3xl font-bold sm:text-4xl">Contact Us</h1>
        <p className="mb-10 max-w-2xl text-muted">
          Have a question, suggestion, or want to work together? We would love to
          hear from you. Reach out through any of the channels below.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="mb-2 font-heading text-lg font-semibold">Email</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:text-primary-dark transition-colors text-sm"
              >
                {siteConfig.email}
              </a>
              <p className="mt-2 text-xs text-muted">We respond within 24 hours.</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="mb-2 font-heading text-lg font-semibold">Phone</h2>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="text-primary hover:text-primary-dark transition-colors text-sm"
              >
                {siteConfig.phone}
              </a>
              <p className="mt-2 text-xs text-muted">Available during business hours (PKT).</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="mb-2 font-heading text-lg font-semibold">Location</h2>
              <p className="text-foreground text-sm">{siteConfig.address}</p>
              <p className="mt-2 text-xs text-muted">Serving readers worldwide.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="mb-6 font-heading text-xl font-semibold">Send us a Message</h2>

              {status === "success" ? (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold">Message Sent!</h3>
                  <p className="text-muted text-sm">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help?"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you think..."
                      className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-500">
                      Something went wrong. Please try again or email us directly at{" "}
                      <a href={`mailto:${siteConfig.email}`} className="underline">
                        {siteConfig.email}
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
