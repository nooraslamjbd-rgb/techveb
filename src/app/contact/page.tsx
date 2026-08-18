import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the TechVeb team. Have a question, suggestion, or want to work together? We would love to hear from you.",
  alternates: { canonical: "https://techveb.com/contact" },
};

export default function ContactPage() {
  return <ContactForm />;
}
