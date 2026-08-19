"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  status: string;
  dir: string;
}

interface Stats {
  total: number;
  blog: number;
  reviews: number;
  aiTools: number;
  published: number;
  drafts: number;
}

const categoryColors: Record<string, string> = {
  ai: "bg-blue-500/15 text-blue-400",
  "tech-news": "bg-emerald-500/15 text-emerald-400",
  "product-reviews": "bg-amber-500/15 text-amber-400",
  tutorials: "bg-violet-500/15 text-violet-400",
  cloud: "bg-pink-500/15 text-pink-400",
  cybersecurity: "bg-red-500/15 text-red-400",
  gaming: "bg-orange-500/15 text-orange-400",
  "emerging-tech": "bg-cyan-500/15 text-cyan-400",
  blog: "bg-indigo-500/15 text-indigo-400",
  coding: "bg-teal-500/15 text-teal-400",
};

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, blog: 0, reviews: 0, aiTools: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((data) => {
        const all = data.articles || [];
        setArticles(all.slice(0, 10));
        setStats({
          total: all.length,
          blog: all.filter((a: Article) => a.dir === "blog").length,
          reviews: all.filter((a: Article) => a.dir === "reviews").length,
          aiTools: all.filter((a: Article) => a.dir === "ai-tools").length,
          published: all.filter((a: Article) => a.status === "published").length,
          drafts: all.filter((a: Article) => a.status === "draft").length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0060E0] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-[#0060E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004BB0]"
        >
          + New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Articles", value: stats.total, color: "text-white" },
          { label: "Blog Posts", value: stats.blog, color: "text-blue-400" },
          { label: "Reviews", value: stats.reviews, color: "text-amber-400" },
          { label: "AI Tools", value: stats.aiTools, color: "text-cyan-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-5">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020]">
        <div className="flex items-center justify-between border-b border-[#1E293B] px-5 py-4">
          <h3 className="font-semibold text-white">Recent Articles</h3>
          <Link href="/admin/articles" className="text-sm text-[#3388FF] hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#1E293B]">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/admin/articles/${article.slug}`}
              className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[#1A2236]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{article.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(article.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  categoryColors[article.category] || "bg-gray-500/15 text-gray-400"
                }`}
              >
                {article.category}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  article.status === "draft"
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-emerald-500/15 text-emerald-400"
                }`}
              >
                {article.status === "draft" ? "Draft" : "Published"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
