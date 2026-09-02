import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the TechVeb team. Have a question, suggestion, or want to work together? We would love to hear from you.",
  alternates: { canonical: "https://techveb.com/contact" },
  openGraph: {
    title: "Contact Us | TechVeb",
    description: "Get in touch with the TechVeb team.",
    url: "https://techveb.com/contact",
    type: "website",
    images: [{ url: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png", width: 1200, height: 630, alt: "Contact TechVeb" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | TechVeb",
    description: "Get in touch with the TechVeb team.",
    images: ["https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png"],
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
