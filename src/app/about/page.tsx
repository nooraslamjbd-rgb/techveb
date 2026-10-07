import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about TechVeb - your trusted source for technology news, AI insights, and expert product reviews.",
  alternates: { canonical: "https://techveb.com/about" },
  openGraph: {
    title: "About Us | TechVeb",
    description: "Learn about TechVeb - your trusted source for technology news, AI insights, and expert product reviews.",
    url: "https://techveb.com/about",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "About TechVeb" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | TechVeb",
    description: "Learn about TechVeb - your trusted source for technology news, AI insights, and expert product reviews.",
    images: ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About TechVeb",
    description: siteConfig.description,
    url: `${siteConfig.url}/about`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">About TechVeb</h1>

        <div className="prose max-w-none">
          <p className="text-lg text-muted">
            Welcome to TechVeb, your go-to destination for everything technology.
            We are passionate about making complex tech topics accessible,
            understandable, and engaging for everyone.
          </p>

          <h2>Our Mission</h2>
          <p>
            At TechVeb, our mission is to bridge the gap between cutting-edge
            technology and everyday users. We believe that everyone deserves access
            to reliable, well-researched information about the tools and
            technologies that shape our digital world.
          </p>

          <h2>What We Cover</h2>
          <p>Our content spans across several key areas:</p>
          <ul>
            <li>
              <strong>Artificial Intelligence:</strong> From the latest AI models to
              practical guides on using AI tools effectively, we keep you informed
              about the AI revolution.
            </li>
            <li>
              <strong>Tech News:</strong> Stay updated with the most important
              developments in the technology industry, from startups to tech giants.
            </li>
            <li>
              <strong>Product Reviews:</strong> Our honest, in-depth reviews help
              you make informed decisions about the latest gadgets, software, and
              services.
            </li>
            <li>
              <strong>Tutorials &amp; Guides:</strong> Step-by-step guides and
              tutorials that help you master new tools and technologies.
            </li>
            <li>
              <strong>Cloud Computing:</strong> Insights into cloud platforms,
              DevOps practices, and infrastructure trends.
            </li>
          </ul>

          <h2>How We Work</h2>
          <p>
            TechVeb is maintained by an editorial team of technology writers and
            editors. Our guides, explainers, and reviews are researched from
            publicly available information, official product documentation,
            peer publications, and hands-on use where applicable. We clearly mark
            opinion and analysis, and we fix errors promptly when they are
            brought to our attention.
          </p>
          <p>
            Some of our news briefs summarize and link to reports originally
            published by established news agencies and technology publications.
            We provide the original source link alongside those summaries so you
            can always verify the details yourself.
          </p>

          <h2>Our Standards</h2>
          <ul>
            <li>
              <strong>Transparency:</strong> We disclose how we produce content
              and name sources and methods where relevant.
            </li>
            <li>
              <strong>Corrections:</strong> We update and correct articles
              whenever errors are reported via our contact page.
            </li>
            <li>
              <strong>Editorial Independence:</strong> Advertising, when present,
              is clearly labeled and never influences our reporting or
              recommendations.
            </li>
            <li>
              <strong>Respect for Others:</strong> We credit and link to sources,
              use licensed images, and do not present others&apos; work as our own.
            </li>
          </ul>

          <h2>Who Runs TechVeb</h2>
          <p>
            TechVeb is published by{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.author}</a>, a
            technology-focused editorial publisher based in Pakistan. The site is
            run and edited by its founder, and technical reviews and guides are
            written or fact-checked by human editors before publication.
          </p>
          <p>
            We are reachable at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and via
            our <Link href="/contact">contact page</Link>. We do not publish
            anonymous opinion, and we are transparent about who is responsible
            for the content on this website.
          </p>

          <h2>Get In Touch</h2>
          <p>
            Have a question, suggestion, or want to collaborate? We would love to
            hear from you. Visit our{" "}
            <Link href="/contact">contact page</Link> or reach out to us directly at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
