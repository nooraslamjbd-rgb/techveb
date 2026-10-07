import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How TechVeb selects, sources, and verifies its technology journalism, guides, and news coverage.",
  alternates: { canonical: "https://techveb.com/editorial-policy" },
  openGraph: {
    title: "Editorial Policy | TechVeb",
    description: "How TechVeb selects, sources, and verifies its technology journalism, guides, and news coverage.",
    url: "https://techveb.com/editorial-policy",
    siteName: "TechVeb",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "TechVeb" }],
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Editorial Policy" }]} />

      <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">Editorial Policy</h1>

      <div className="prose max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>

        <h2>Our Purpose</h2>
        <p>
          TechVeb publishes original technology journalism, practical guides,
          expert reviews, and clearly summarized news briefs. Our goal is to help
          readers understand technology, make better decisions, and stay informed
          without being misled. Editorial content is never influenced by
          advertising, sponsors, or commercial relationships.
        </p>

        <h2>Independence &amp; Advertising</h2>
        <p>
          Advertising and editorial are strictly separated. Advertisements are
          always labeled as such and never disguised as articles. Our reviews and
          recommendations are based on research and evaluation criteria we state
          in each piece, not on who advertises with us. If any article ever
          contains an affiliate or sponsored relationship, it will be disclosed
          at the top of that article in line with our{" "}
          <a href="/advertising-disclosure">Advertising Disclosure</a>.
        </p>

        <h2>Sourcing &amp; Original Reporting</h2>
        <p>
          We aim for originality in everything we publish. Our guides, explainers,
          and reviews are written in our own words and reflect our own research
          and testing. Where we report on events first covered by news agencies
          and other publishers, our news briefs provide a concise, independently
          written summary and always link to the original report so readers can
          verify the facts at the source.
        </p>

        <h2>Accuracy &amp; Verifiability</h2>
        <p>
          We check facts, dates, names, and figures against the sources we cite.
          We distinguish between established facts, analysis, and opinion. When
          we cannot verify a claim, we say so rather than presenting it as fact.
          Published sources are linked wherever possible.
        </p>

        <h2>Corrections</h2>
        <p>
          We take errors seriously. If you find a factual mistake, outdated
          information, or a broken link, please{" "}
          <a href="/contact">report it to us</a>. We review reports promptly,
          correct the article when needed, and note significant corrections in
          the article itself when appropriate.
        </p>

        <h2>Ai-Assisted Content</h2>
        <p>
          We may use artificial intelligence tools to assist with research,
          drafting, and optimization. Any content published on TechVeb is
          reviewed and verified by human editors before publication, and we take
          responsibility for everything we publish. We never knowingly publish
          unverified machine-generated text as fact.
        </p>

        <h2>Plagiarism &amp; Copyright</h2>
        <p>
          We do not reproduce others&apos; work without permission or proper
          credit. Quotations are limited, clearly marked, and attributed. Images
          are licensed, used under fair-use principles, or produced in-house. If
          you believe content on TechVeb infringes a copyright, please contact us
          and we will investigate and remove it promptly.
        </p>

        <h2>Reviews &amp; Product Testing</h2>
        <p>
          Reviews are based on hands-on use, published specifications, and
          reliable comparison data where direct testing is not possible. We state
          the basis of a review in the article. We disclose any product provided
          by a manufacturer and the fact of that provision never determines the
          verdict.
        </p>

        <h2>Contact the Editorial Team</h2>
        <p>
          Questions about this policy can be sent through our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}