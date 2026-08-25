"use client";

import { useEffect, useState } from "react";

interface Category {
  slug: string;
  label: string;
  color: string;
}

const COLOR_PRESETS = [
  "#0060E0", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899",
  "#EF4444", "#F97316", "#06B6D4", "#6366F1", "#14B8A6",
  "#D946EF", "#84CC16", "#F43F5E", "#0EA5E9", "#A855F7",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#0060E0");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editColor, setEditColor] = useState("");

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
      setSha(data.sha || "");
    } catch {
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function generateSlug(label: string): string {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
  }

  async function handleAdd() {
    if (!newLabel.trim()) { alert("Label is required"); return; }
    const slug = generateSlug(newLabel);
    if (categories.some((c) => c.slug === slug)) { alert("Category with this slug already exists"); return; }

    const updated = [...categories, { slug, label: newLabel.trim(), color: newColor }];
    await saveCategories(updated);
    setNewLabel("");
    setNewColor("#0060E0");
  }

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setEditLabel(categories[idx].label);
    setEditColor(categories[idx].color);
  }

  async function handleSaveEdit() {
    if (editingIdx === null) return;
    if (!editLabel.trim()) { alert("Label is required"); return; }

    const updated = [...categories];
    updated[editingIdx] = { ...updated[editingIdx], label: editLabel.trim(), color: editColor };
    await saveCategories(updated);
    setEditingIdx(null);
  }

  async function handleDelete(idx: number) {
    if (!confirm(`Delete "${categories[idx].label}"? Articles with this category will keep their category value.`)) return;
    const updated = categories.filter((_, i) => i !== idx);
    await saveCategories(updated);
  }

  async function saveCategories(updated: Category[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: updated, sha }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
        if (data.sha) setSha(data.sha);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Categories</h2>
          <p className="mt-1 text-sm text-gray-400">{categories.length} categories configured</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">Add Category</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Category label (e.g. Machine Learning)"
            className="flex-1 rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-lg border border-[#1E293B] bg-[#080B14]"
            />
            <span className="text-xs text-gray-500">{newColor}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving || !newLabel.trim()}
            className="rounded-lg bg-[#0060E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004BB0] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add"}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setNewColor(c)}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${newColor === c ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        {newLabel && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#080B14] p-2">
            <span className="text-xs text-gray-400">Preview:</span>
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: newColor }}
            >
              {newLabel}
            </span>
            <span className="text-xs text-gray-500">/ {generateSlug(newLabel)}</span>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#1E293B] bg-[#0B1020]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#1E293B] text-xs uppercase text-gray-400">
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {categories.map((cat, idx) => (
              <tr key={cat.slug} className="transition-colors hover:bg-[#1A2236]">
                <td className="px-4 py-3">
                  {editingIdx === idx ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border border-[#1E293B] bg-[#080B14]"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs text-gray-500">{cat.color}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingIdx === idx ? (
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="w-full rounded-lg border border-[#0060E0] bg-[#080B14] px-3 py-1.5 text-sm text-white outline-none"
                    />
                  ) : (
                    <span className="font-medium text-white">{cat.label}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-[#1E293B] px-2 py-0.5 font-mono text-xs text-gray-400">
                    {cat.slug}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingIdx === idx ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={saving}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIdx(null)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1E293B]"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(idx)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1E293B] hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          disabled={saving}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                  No categories configured. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
