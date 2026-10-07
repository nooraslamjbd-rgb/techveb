import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Advertising Disclosure",
  description:
    "How advertising and affiliate relationships work on TechVeb, including Google AdSense and consent choices.",
  alternates: { canonical: "https://techveb.com/advertising-disclosure" },
  openGraph: {
    title: "Advertising Disclosure | TechVeb",
    description: "How advertising and affiliate relationships work on TechVeb, including Google AdSense and consent choices.",
    url: "https://techveb.com/advertising-disclosure",
    siteName: "TechVeb",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "TechVeb" }],
  },
};

export default function AdvertisingDisclosurePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Advertising Disclosure" }]} />

      <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">Advertising Disclosure</h1>

      <div className="prose max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>

        <h2>Why We Show Ads</h2>
        <p>
          TechVeb is free to read. To cover hosting, production, and editorial
          costs, we display advertising on our website. Advertising enables us to
          keep our content open and publicly accessible without charge.
        </p>

        <h2>Google AdSense</h2>
        <p>
          We use <a href="https://google.com/adsense" rel="nofollow noopener noreferrer">Google AdSense</a> to display
          ads. AdSense uses cookies and device identifiers to serve and measure
          ads and to prevent ad fraud. Ad serving follows the choices you make in
          our cookie consent banner and respects Google Consent Mode v2, which we
          implement on the site.
        </p>
        <p>
          You can opt out of personalized advertising at any time by visiting{" "}
          <a href="https://www.google.com/settings/ads" rel="nofollow noopener noreferrer">
            Google Ads Settings
          </a>{" "}
          or by declining cookies in our banner. When you decline, Google may still
          show non-personalized ads based on your region rather than your browsing
          history.
        </p>

        <h2>Ads vs. Editorial</h2>
        <p>
          Advertisements on TechVeb are always visually distinct from editorial
          content and are never disguised as articles, reviews, or recommendations.
          Editorial decisions - what we cover, how we test, and what we recommend -
          are made independently of any advertiser. No advertiser has any say in
          our content, and we do not sell positive coverage.
        </p>

        <h2>Affiliate &amp; Sponsored Content</h2>
        <p>
          From time to time we may include affiliate links or clearly labeled
          sponsored content. If we do:
        </p>
        <ul>
          <li>
            Affiliate links will not cost you anything extra; we may earn a small
            commission if you purchase through them.
          </li>
          <li>
            Sponsored content will always be labeled &quot;Sponsored&quot; or
            &quot;Partner Content&quot; at the top of the page and will clearly
            state who paid for it.
          </li>
          <li>
            Affiliate or sponsorship relationships never change our verdicts or
            recommendations.
          </li>
        </ul>

        <h2>Your Choices</h2>
        <p>
          You control personalization through our cookie banner and through your
          browser settings. You can read and use all of our content whether you
          accept or decline cookies; declining does not block articles or remove
          access to anything on the site.
        </p>

        <h2>Questions</h2>
        <p>
          If you have any questions about this disclosure, our advertising
          practices, or a specific page, please reach out through our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}