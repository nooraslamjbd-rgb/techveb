import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "TechVeb disclaimer. General information, accuracy, external links, advertising, and content disclosure for techveb.com.",
  alternates: { canonical: "https://techveb.com/disclaimer" },
  openGraph: {
    title: "Disclaimer | TechVeb",
    description: "TechVeb disclaimer. General information, accuracy, external links, advertising, and content disclosure.",
    url: "https://techveb.com/disclaimer",
    siteName: "TechVeb",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "TechVeb" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | TechVeb",
    description: "TechVeb disclaimer. General information, accuracy, external links, advertising, and content disclosure.",
    images: ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"],
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Disclaimer" }]} />

      <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">Disclaimer</h1>

      <div className="prose max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>

        <h2>General Information</h2>
        <p>
          The content published on TechVeb (techveb.com) is provided for general
          informational and educational purposes only. While we aim to keep the
          information accurate and up to date, we make no representations or
          warranties of any kind, express or implied, about the completeness,
          reliability, or suitability of the information found on this website.
        </p>

        <h2>Professional Advice</h2>
        <p>
          Nothing on this website constitutes professional, financial, medical,
          or legal advice. Any action you take based on the information found on
          TechVeb is strictly at your own risk. You should consult a qualified
          professional for advice tailored to your specific situation.
        </p>

        <h2>News &amp; Third-Party Reports</h2>
        <p>
          Some news articles on TechVeb summarize or report on events covered by
          third-party news agencies and publications. Where relevant, we link to
          the original report for verification and further reading. Headlines
          and summaries are our own and may not reflect the views of the original
          publishers.
        </p>

        <h2>External Links</h2>
        <p>
          TechVeb may contain links to external websites that are not provided or
          maintained by us. We do not control the content, policies, or practices
          of these external sites and are not responsible for their accuracy or
          availability. The inclusion of a link does not imply endorsement.
        </p>

        <h2>Advertising &amp; Affiliates</h2>
        <p>
          TechVeb may display third-party advertising (including Google AdSense)
          to keep our content free. Google and other third-party vendors may use
          cookies (including the DART cookie) to serve ads based on prior visits
          to this and other websites. You may opt out of personalized advertising
          by visiting{" "}
          <a href="https://www.google.com/settings/ads" rel="nofollow noopener noreferrer">
            Google Ads Settings
          </a>
          . Ads are clearly distinguishable from editorial content and are never
          disguised as articles.
        </p>
        <p>
          If affiliate links are ever used on TechVeb, they will be clearly
          disclosed, and purchases made through them will not cost you more. We
          currently do not rely on affiliate commissions.
        </p>

        <h2>Images &amp; Media</h2>
        <p>
          Images published on TechVeb are either licensed, used under Creative
          Commons, or uploaded from public sources. Credits and license
          information are provided where applicable. If you believe any image or
          content infringes your rights, please contact us and we will remove it
          promptly.
        </p>

        <h2>Errors &amp; Corrections</h2>
        <p>
          We do our best to ensure accuracy, but errors can occur. If you spot a
          factual mistake, outdated information, or a broken link,{" "}
          <a href="/contact">please let us know</a> and we will correct it
          promptly.
        </p>

        <h2>Contact Us</h2>
        <p>
          For any questions about this disclaimer, contact us at{" "}
          <a href="mailto:nooraslamjbd@gmail.com">nooraslamjbd@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}