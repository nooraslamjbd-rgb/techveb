import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "TechVeb terms of service. Read the rules and guidelines for using our website and services.",
  alternates: { canonical: "https://techveb.com/terms" },
  openGraph: {
    title: "Terms of Service | TechVeb",
    description: "TechVeb terms of service. Read the rules and guidelines for using our website and services.",
    url: "https://techveb.com/terms",
    siteName: "TechVeb",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | TechVeb",
    description: "TechVeb terms of service. Read the rules and guidelines for using our website and services.",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">Terms of Service</h1>

      <div className="prose max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using TechVeb (techveb.com), you accept and agree to
          be bound by these Terms of Service. If you do not agree to these terms,
          please do not use our website.
        </p>

        <h2>2. Use of Content</h2>
        <p>
          All content on TechVeb, including articles, reviews, images, and
          graphics, is owned by TechVeb or our content providers. You may:
        </p>
        <ul>
          <li>Read and share our articles with proper attribution</li>
          <li>Quote small portions for educational or commentary purposes</li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>Reproduce, republish, or redistribute our content without permission</li>
          <li>Use our content for commercial purposes without authorization</li>
          <li>Modify or create derivative works from our content</li>
        </ul>

        <h2>3. User Conduct</h2>
        <p>When using our website, you agree to:</p>
        <ul>
          <li>Not engage in any disruptive or harmful behavior</li>
          <li>Not attempt to gain unauthorized access to our systems</li>
          <li>Not use automated systems to scrape or download content</li>
          <li>Not post spam, misleading, or fraudulent content in comments</li>
        </ul>

        <h2>4. Disclaimer</h2>
        <p>
          The information provided on TechVeb is for general informational
          purposes only. We make no warranties about the completeness,
          reliability, or accuracy of this information. Any action you take based
          on the information on our website is strictly at your own risk.
        </p>

        <h2>5. Product Reviews</h2>
        <p>
          Our product reviews reflect our honest opinions based on testing and
          research. Reviews may contain affiliate links, meaning we may earn a
          commission if you purchase through our links, at no additional cost to
          you. This does not influence our editorial content or ratings.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          TechVeb shall not be held liable for any damages arising from the use
          of or inability to use our website or content.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be
          effective immediately upon posting. Your continued use of the website
          constitutes acceptance of the modified terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:nooraslamjbd@gmail.com">nooraslamjbd@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
