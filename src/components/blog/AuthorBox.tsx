import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function AuthorBox() {
  return (
    <div className="mt-12 rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {siteConfig.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{siteConfig.author}</h3>
          <p className="mt-1 text-sm text-muted">
            Your trusted source for the latest in technology, AI innovations, and digital trends.
            We bring you in-depth analysis, expert reviews, and comprehensive guides.
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Learn more about us &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
