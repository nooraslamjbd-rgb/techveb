import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "TechVeb privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://techveb.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | TechVeb",
    description: "TechVeb privacy policy. Learn how we collect, use, and protect your personal information.",
    url: "https://techveb.com/privacy-policy",
    siteName: "TechVeb",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | TechVeb",
    description: "TechVeb privacy policy. Learn how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">Privacy Policy</h1>

      <div className="prose max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: August 1, 2026
        </p>

        <h2>Introduction</h2>
        <p>
          Welcome to TechVeb (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate
          techveb.com and are committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect information about you in various ways, including:</p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Name, email address, and other contact
            information you voluntarily provide when subscribing to our newsletter
            or contacting us.
          </li>
          <li>
            <strong>Derivative Data:</strong> Information automatically collected
            when you access our website, such as your IP address, browser type,
            operating system, access times, and pages viewed.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies and similar tracking
            technologies to track activity on our website and store certain
            information.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our website</li>
          <li>Send newsletters and updates (if you subscribe)</li>
          <li>Respond to your comments and questions</li>
          <li>Analyze usage patterns to improve our content</li>
          <li>Detect and prevent technical issues</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>We may use third-party services that collect information:</p>
        <ul>
          <li>
            <strong>Google Analytics:</strong> To analyze website traffic and usage
            patterns.
          </li>
          <li>
            <strong>Google AdSense:</strong> To display advertisements. Google
            uses cookies to serve ads based on your prior visits to our website.
          </li>
        </ul>

        <h2>Data Protection Rights (GDPR)</h2>
        <p>
          If you are located in the European Economic Area (EEA), you have certain
          data protection rights. You have the right to access, correct, or delete
          your personal information.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by posting the new policy on this page and updating the
          &quot;Last updated&quot; date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a href="mailto:nooraslamjbd@gmail.com">nooraslamjbd@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
