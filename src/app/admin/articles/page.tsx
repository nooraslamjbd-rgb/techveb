"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  status: string;
  dir: string;
  tags: string[];
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

const categoryLabels: Record<string, string> = {
  ai: "AI",
  "tech-news": "Tech News",
  "product-reviews": "Reviews",
  tutorials: "Tutorials",
  cloud: "Cloud",
  cybersecurity: "Security",
  gaming: "Gaming",
  "emerging-tech": "Emerging",
  blog: "General",
  coding: "Coding",
};

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"date" | "title">("date");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const perPage = 25;

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...articles];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortField === "date") {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortDir === "desc" ? -diff : diff;
      }
      return sortDir === "desc"
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    });

    return result;
  }, [articles, search, categoryFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter, sortField, sortDir]);

  async function handleDelete(slug: string, dir: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/articles/${slug}?dir=${dir}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
      } else {
        alert("Failed to delete article");
      }
    } catch {
      alert("Failed to delete article");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0060E0] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-white">
          Articles <span className="text-sm font-normal text-gray-400">({filtered.length})</span>
        </h2>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#0060E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004BB0]"
        >
          + New Article
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#1E293B] bg-[#0B1020] p-4 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
        >
          <option value="all">All Categories</option>
          <option value="ai">AI</option>
          <option value="tech-news">Tech News</option>
          <option value="product-reviews">Reviews</option>
          <option value="tutorials">Tutorials</option>
          <option value="cloud">Cloud</option>
          <option value="cybersecurity">Security</option>
          <option value="gaming">Gaming</option>
          <option value="emerging-tech">Emerging Tech</option>
          <option value="blog">General</option>
          <option value="coding">Coding</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={`${sortField}-${sortDir}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split("-");
            setSortField(field as "date" | "title");
            setSortDir(dir as "desc" | "asc");
          }}
          className="rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#1E293B] bg-[#0B1020]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1E293B] text-xs uppercase text-gray-400">
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 md:table-cell">Category</th>
                <th className="hidden px-4 py-3 sm:table-cell">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {paginated.map((article) => (
                <tr key={article.slug} className="transition-colors hover:bg-[#1A2236]">
                  <td className="max-w-xs truncate px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.slug}`}
                      className="font-medium text-white hover:text-[#3388FF]"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-gray-500 md:hidden">
                      {categoryLabels[article.category] || article.category}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        categoryColors[article.category] || "bg-gray-500/15 text-gray-400"
                      }`}
                    >
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-gray-400 sm:table-cell">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        article.status === "draft"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {article.status === "draft" ? "Draft" : "Live"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/articles/${article.slug}`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1E293B] hover:text-white"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1E293B] hover:text-white"
                      >
                        View ↗
                      </a>
                      <button
                        onClick={() => handleDelete(article.slug, article.dir)}
                        disabled={deleting === article.slug}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deleting === article.slug ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#1E293B] px-4 py-3">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1E293B] hover:text-white disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1E293B] hover:text-white disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
