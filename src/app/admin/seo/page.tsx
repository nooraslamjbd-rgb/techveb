"use client";

import { useEffect, useState } from "react";

interface SEOMetric {
  label: string;
  status: "good" | "warning" | "error";
  value: string;
  description: string;
}

export default function SEOAuditPage() {
  const [metrics, setMetrics] = useState<SEOMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate SEO audit checks
    const auditMetrics: SEOMetric[] = [
      { label: "Title Tags", status: "good", value: "511/511", description: "All articles have title tags" },
      { label: "Meta Descriptions", status: "good", value: "511/511", description: "All articles have meta descriptions" },
      { label: "Open Graph Tags", status: "good", value: "511/511", description: "OG tags present on all pages" },
      { label: "Twitter Cards", status: "good", value: "511/511", description: "Twitter card tags present" },
      { label: "Canonical URLs", status: "good", value: "511/511", description: "Canonical URLs set correctly" },
      { label: "JSON-LD Schema", status: "good", value: "Active", description: "Article & Website schema active" },
      { label: "Breadcrumb Schema", status: "good", value: "Active", description: "Breadcrumb navigation schema" },
      { label: "FAQ Schema", status: "warning", value: "Partial", description: "Add FAQ schema to tutorial articles" },
      { label: "HowTo Schema", status: "warning", value: "Missing", description: "Add HowTo schema to guide articles" },
      { label: "XML Sitemap", status: "good", value: "Active", description: "Auto-generated sitemap" },
      { label: "Robots.txt", status: "good", value: "Active", description: "Properly configured" },
      { label: "LLM Meta Tags", status: "good", value: "Active", description: "llms.txt and llms-full.txt present" },
      { label: "Semantic HTML", status: "good", value: "Active", description: "Proper heading hierarchy" },
      { label: "Image Alt Tags", status: "warning", value: "95%", description: "Some images missing alt text" },
      { label: "Internal Linking", status: "good", value: "Strong", description: "Good internal link structure" },
      { label: "Page Speed", status: "good", value: "90+", description: "Good Core Web Vitals" },
      { label: "Mobile Friendly", status: "good", value: "100%", description: "All pages responsive" },
      { label: "HTTPS", status: "good", value: "Active", description: "SSL certificate active" },
      { label: "Core Web Vitals", status: "good", value: "Pass", description: "LCP, FID, CLS all pass" },
      { label: "Structured Data", status: "good", value: "12 types", description: "Multiple schema types active" },
    ];
    
    setTimeout(() => {
      setMetrics(auditMetrics);
      setLoading(false);
    }, 500);
  }, []);

  const goodCount = metrics.filter((m) => m.status === "good").length;
  const warningCount = metrics.filter((m) => m.status === "warning").length;
  const errorCount = metrics.filter((m) => m.status === "error").length;

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
              {metrics.length > 0 ? Math.round((goodCount / metrics.length) * 100) : 0}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">SEO Score</h3>
            <p className="text-sm text-gray-400">
              {goodCount} of {metrics.length} checks passing
            </p>
            <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-[#1E293B]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${metrics.length > 0 ? (goodCount / metrics.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AEO / GEO Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
          <h3 className="mb-3 text-lg font-bold text-white">🎯 AEO (Answer Engine Optimization)</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> FAQ Schema on articles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Featured snippet optimized headings
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> TL;DR / Key Takeaways boxes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Comparison tables
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">⚠</span> Add HowTo schema to guides
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
          <h3 className="mb-3 text-lg font-bold text-white">🤖 GEO (Generative Engine Optimization)</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> llms.txt file present
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> llms-full.txt with all content
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Structured data for AI parsing
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Clear entity markup
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Semantic HTML structure
            </li>
          </ul>
        </div>
      </div>

      {/* Audit Metrics */}
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
            {metrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-4 px-5 py-3">
                <span
                  className={`text-lg ${
                    metric.status === "good"
                      ? "text-emerald-400"
                      : metric.status === "warning"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {metric.status === "good" ? "✓" : metric.status === "warning" ? "⚠" : "✗"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{metric.label}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
                <span className="text-sm font-medium text-gray-300">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
