import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the TechVeb team. We are here to help with questions, feedback, and collaboration opportunities.",
  alternates: { canonical: "https://techveb.com/contact" },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact TechVeb",
    url: `${siteConfig.url}/contact`,
  };

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

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mb-2 font-heading text-lg font-semibold">Email</h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-primary hover:text-primary-dark transition-colors"
            >
              {siteConfig.email}
            </a>
            <p className="mt-2 text-sm text-muted">
              We typically respond within 24 hours.
            </p>
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
              className="text-primary hover:text-primary-dark transition-colors"
            >
              {siteConfig.phone}
            </a>
            <p className="mt-2 text-sm text-muted">
              Available during business hours (PKT).
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="mb-2 font-heading text-lg font-semibold">Location</h2>
            <p className="text-foreground">{siteConfig.address}</p>
            <p className="mt-2 text-sm text-muted">
              Serving readers worldwide.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="mb-2 font-heading text-lg font-semibold">Write for Us</h2>
            <p className="text-sm text-muted">
              Interested in contributing? Send us your article pitch at{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
