import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about TechVeb - your trusted source for technology news, AI insights, and expert product reviews.",
  alternates: { canonical: "https://techveb.com/about" },
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

          <h2>Our Team</h2>
          <p>
            TechVeb is maintained by a dedicated team of technology enthusiasts
            and professionals who bring years of experience in the tech industry.
            We are committed to delivering accurate, timely, and valuable content
            to our readers.
          </p>

          <h2>Why Trust Us</h2>
          <p>
            We prioritize accuracy, transparency, and integrity in everything we
            publish. Our reviews are based on thorough testing, our articles are
            backed by research, and our guides are written by people who actually
            use the tools they write about.
          </p>

          <h2>Get In Touch</h2>
          <p>
            Have a question, suggestion, or want to collaborate? We would love to
            hear from you. Visit our{" "}
            <a href="/contact">contact page</a> or reach out to us directly at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
