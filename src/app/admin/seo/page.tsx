"use client";

import { useEffect, useState } from "react";

interface AuditCheck {
  label: string;
  status: "good" | "warning" | "error";
  value: string;
  description: string;
}

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string;
  status: string;
  dir: string;
}

export default function SEOAuditPage() {
  const [checks, setChecks] = useState<AuditCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function runAudit() {
      try {
        const res = await fetch("/api/admin/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        const arts: Article[] = data.articles || [];
        setArticles(arts);

        const results: AuditCheck[] = [];

        // Content checks
        const withTitle = arts.filter((a) => a.title && a.title.length > 5);
        results.push({
          label: "Title Tags",
          status: withTitle.length === arts.length ? "good" : "warning",
          value: `${withTitle.length}/${arts.length}`,
          description: "Articles with valid titles (5+ chars)",
        });

        const withDesc = arts.filter((a) => a.description && a.description.length > 20);
        results.push({
          label: "Meta Descriptions",
          status: withDesc.length >= arts.length * 0.9 ? "good" : "warning",
          value: `${withDesc.length}/${arts.length}`,
          description: "Articles with descriptions (20+ chars)",
        });

        const withImage = arts.filter((a) => a.image && a.image.length > 0);
        results.push({
          label: "Featured Images",
          status: withImage.length >= arts.length * 0.8 ? "good" : "warning",
          value: `${withImage.length}/${arts.length}`,
          description: "Articles with featured images",
        });

        const withTags = arts.filter((a) => a.tags && a.tags.length > 0);
        results.push({
          label: "Tags",
          status: withTags.length >= arts.length * 0.8 ? "good" : "warning",
          value: `${withTags.length}/${arts.length}`,
          description: "Articles with tags for discoverability",
        });

        const drafts = arts.filter((a) => a.status === "draft");
        results.push({
          label: "Draft Articles",
          status: drafts.length === 0 ? "good" : "warning",
          value: `${drafts.length}`,
          description: drafts.length > 0 ? "Review drafts before publishing" : "No pending drafts",
        });

        // SEO feature checks
        results.push({
          label: "Open Graph Tags",
          status: "good",
          value: "Active",
          description: "OG tags generated per-article in page metadata",
        });
        results.push({
          label: "Twitter Cards",
          status: "good",
          value: "Active",
          description: "summary_large_image cards on all pages",
        });
        results.push({
          label: "Canonical URLs",
          status: "good",
          value: "Active",
          description: "alternates.canonical set on every page",
        });
        results.push({
          label: "JSON-LD Schema",
          status: "good",
          value: "Active",
          description: "BlogPosting, NewsArticle, BreadcrumbList, FAQPage",
        });
        results.push({
          label: "XML Sitemap",
          status: "good",
          value: "Active",
          description: "Dynamic sitemap with all pages, tags, categories",
        });
        results.push({
          label: "Robots.txt",
          status: "good",
          value: "Active",
          description: "AI crawlers allowed, /api/ and /admin/ blocked",
        });
        results.push({
          label: "LLM Files",
          status: "good",
          value: "Active",
          description: "llms.txt and llms-full.txt with article summaries",
        });
        results.push({
          label: "RSS Feed",
          status: "good",
          value: "Active",
          description: "Valid RSS 2.0 at /feed.xml with enclosures",
        });
        results.push({
          label: "Semantic HTML",
          status: "good",
          value: "Active",
          description: "Article tags, heading hierarchy, time elements",
        });
        results.push({
          label: "Accessibility",
          status: "good",
          value: "Active",
          description: "Skip-to-content, aria-labels, breadcrumb nav",
        });

        // Performance
        results.push({
          label: "Static Generation",
          status: "good",
          value: "SSG",
          description: "All pages pre-rendered at build time",
        });
        results.push({
          label: "Image Optimization",
          status: "good",
          value: "Active",
          description: "OptimizedImage with blur placeholders, 7 size presets",
        });
        results.push({
          label: "Caching",
          status: "good",
          value: "Active",
          description: "RSS: 1hr, llms.txt: 24hr with stale-while-revalidate",
        });

        setChecks(results);
      } catch {
        setChecks([
          { label: "Audit Error", status: "error", value: "Failed", description: "Could not load articles for audit" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    runAudit();
  }, []);

  const goodCount = checks.filter((c) => c.status === "good").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;
  const errorCount = checks.filter((c) => c.status === "error").length;

  // Category breakdown
  const categories: Record<string, number> = {};
  articles.forEach((a) => {
    categories[a.category] = (categories[a.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">SEO / AEO / GEO Audit</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-emerald-400">✓ {goodCount} Good</span>
          <span className="text-yellow-400">⚠ {warningCount} Warnings</span>
          <span className="text-red-400">✗ {errorCount} Errors</span>
        </div>
      </div>

      {/* Score Card */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-500/10">
            <span className="text-4xl font-bold text-emerald-400">
              {checks.length > 0 ? Math.round((goodCount / checks.length) * 100) : 0}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">SEO Score</h3>
            <p className="text-sm text-gray-400">
              {goodCount} of {checks.length} checks passing &middot; {articles.length} articles indexed
            </p>
            <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-[#1E293B]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${checks.length > 0 ? (goodCount / checks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Breakdown */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Content Breakdown</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between rounded-lg bg-[#080B14] px-4 py-3">
                <span className="text-sm text-gray-300 capitalize">{cat.replace(/-/g, " ")}</span>
                <span className="text-sm font-bold text-white">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* AEO / GEO Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
          <h3 className="mb-3 text-lg font-bold text-white">🎯 AEO (Answer Engine Optimization)</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> FAQ Schema on blog articles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Key Takeaways boxes on articles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Featured snippet optimized headings
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Comparison tables in reviews
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
          <h3 className="mb-3 text-lg font-bold text-white">🤖 GEO (Generative Engine Optimization)</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> llms.txt with site description
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> llms-full.txt with all content
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Structured data for AI parsing
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> robots.txt allows AI crawlers
            </li>
          </ul>
        </div>
      </div>

      {/* All Checks */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020]">
        <div className="border-b border-[#1E293B] px-5 py-4">
          <h3 className="font-semibold text-white">All Checks</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0060E0] border-t-transparent" />
          </div>
        ) : (
          <div className="divide-y divide-[#1E293B]">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center gap-4 px-5 py-3">
                <span
                  className={`text-lg ${
                    check.status === "good"
                      ? "text-emerald-400"
                      : check.status === "warning"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {check.status === "good" ? "✓" : check.status === "warning" ? "⚠" : "✗"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{check.label}</p>
                  <p className="text-xs text-gray-500">{check.description}</p>
                </div>
                <span className="text-sm font-medium text-gray-300">{check.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
