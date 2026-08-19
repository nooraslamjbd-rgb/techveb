"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/use-categories";

interface FaqItem {
  question: string;
  answer: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [showImageUpload, setShowImageUpload] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("blog");
  const [tagsInput, setTagsInput] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [imageCreditUrl, setImageCreditUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [content, setContent] = useState("");
  const [faq, setFaq] = useState<FaqItem[]>([]);

  function addFaq() {
    setFaq([...faq, { question: "", answer: "" }]);
  }

  function removeFaq(index: number) {
    setFaq(faq.filter((_, i) => i !== index));
  }

  function updateFaq(index: number, field: keyof FaqItem, value: string) {
    const updated = [...faq];
    updated[index][field] = value;
    setFaq(updated);
  }

  function generateSlug() {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      const maxDim = 1200;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = (h / w) * maxDim; w = maxDim; }
        else { w = (w / h) * maxDim; h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      ctx?.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          const ext = file.type.includes("png") ? "png" : "jpg";
          const filename = `${generateSlug()}-${Date.now()}.${ext}`;
          uploadToGithub(filename, base64);
        };
        reader.readAsDataURL(blob);
      }, "image/webp", 0.85);
    };
    img.src = URL.createObjectURL(file);
  }

  async function uploadToGithub(filename: string, base64: string) {
    try {
      const res = await fetch("/api/admin/articles/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, content: base64 }),
      });
      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
        setShowImageUpload(false);
      } else {
        alert("Image upload failed");
      }
    } catch {
      alert("Image upload failed");
    }
  }

  async function handleSave(publishStatus: "draft" | "published") {
    if (!title.trim()) { alert("Title is required"); return; }
    if (!description.trim()) { alert("Description is required"); return; }
    setSaving(true);
    const slug = generateSlug();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, date, author: "TechVeb Team",
          category, tags, image, imageCredit, imageCreditUrl,
          featured, status: publishStatus, content,
          faq: faq.filter((f) => f.question && f.answer),
        }),
      });
      if (res.ok) { router.push("/admin/articles"); }
      else { const err = await res.json(); alert(`Error: ${err.error}`); }
    } catch (err) { alert(`Error: ${err}`); }
    finally { setSaving(false); }
  }

  function renderPreview() {
    return content
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="rounded bg-[#1E293B] px-1.5 py-0.5 text-sm text-[#3388FF]">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#3388FF] hover:underline">$1</a>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>')
      .replace(/\n\n/g, "<br/><br/>");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">New Article</h2>
        <div className="flex gap-2">
          <button onClick={() => handleSave("draft")} disabled={saving}
            className="rounded-lg border border-[#1E293B] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1A2236] disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave("published")} disabled={saving}
            className="rounded-lg bg-[#0060E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004BB0] disabled:opacity-50">
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Details</h3>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="Article title" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="Brief description" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]">
                {categories.map((c) => (<option key={c.slug} value={c.slug}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Tags (comma separated)</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="ai, machine learning, guide" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]" />
            </div>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Image</h3>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Image URL</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="https://..." />
              <div className="mt-1.5 flex gap-2">
                <button onClick={() => window.open("https://commons.wikimedia.org", "_blank")}
                  className="text-xs text-[#3388FF] hover:underline">Browse Wikimedia</button>
                <span className="text-gray-600">|</span>
                <button onClick={() => setShowImageUpload(!showImageUpload)}
                  className="text-xs text-[#3388FF] hover:underline">Upload File</button>
              </div>
            </div>
            {showImageUpload && (
              <div className="rounded-lg border border-dashed border-[#1E293B] bg-[#080B14] p-3">
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full text-xs text-gray-400 file:mr-2 file:rounded-lg file:border-0 file:bg-[#0060E0] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white" />
                <p className="mt-1 text-xs text-gray-500">Max 5MB. Resized to 1200px.</p>
              </div>
            )}
            {image && (
              <div className="relative overflow-hidden rounded-lg">
                <img src={image} alt="Preview" className="h-32 w-full object-cover" />
                <button onClick={() => setImage("")}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs text-gray-400">Image Credit</label>
              <input type="text" value={imageCredit} onChange={(e) => setImageCredit(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="Author, License" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Credit URL</label>
              <input type="text" value={imageCreditUrl} onChange={(e) => setImageCreditUrl(e.target.value)}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="https://..." />
            </div>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Options</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-[#1E293B] bg-[#080B14] text-[#0060E0] focus:ring-[#0060E0]" />
              <span className="text-sm text-gray-300">Featured article</span>
            </label>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Status</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2">
                  <input type="radio" name="status" value="draft" checked={status === "draft"}
                    onChange={() => setStatus("draft")} className="h-4 w-4 border-[#1E293B] bg-[#080B14] text-[#0060E0]" />
                  <span className="text-sm text-gray-300">Draft</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="status" value="published" checked={status === "published"}
                    onChange={() => setStatus("published")} className="h-4 w-4 border-[#1E293B] bg-[#080B14] text-[#0060E0]" />
                  <span className="text-sm text-gray-300">Published</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0B1020] p-1">
            <button onClick={() => setPreviewMode("edit")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${previewMode === "edit" ? "bg-[#1A2236] text-white" : "text-gray-400 hover:text-gray-200"}`}>
              Edit
            </button>
            <button onClick={() => setPreviewMode("preview")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${previewMode === "preview" ? "bg-[#1A2236] text-white" : "text-gray-400 hover:text-gray-200"}`}>
              Preview
            </button>
          </div>

          {previewMode === "edit" ? (
            <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-4">
              <label className="mb-2 block text-xs text-gray-400">Article Content (Markdown)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={25}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#0060E0]"
                placeholder="Write your article content in Markdown..." />
            </div>
          ) : (
            <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
              {title && <h1 className="mb-4 text-2xl font-bold text-white">{title}</h1>}
              <div className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: renderPreview() }} />
              {!content && <p className="text-gray-500 italic">Nothing to preview yet...</p>}
            </div>
          )}

          <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">FAQ</h3>
              <button onClick={addFaq}
                className="rounded-lg px-3 py-1 text-xs font-medium text-[#3388FF] hover:bg-[#1A2236]">
                + Add FAQ
              </button>
            </div>
            {faq.map((item, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-[#1E293B] bg-[#080B14] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">FAQ #{i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
                <input type="text" value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)}
                  className="w-full rounded-lg border border-[#1E293B] bg-[#0B1020] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                  placeholder="Question" />
                <textarea value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2}
                  className="w-full rounded-lg border border-[#1E293B] bg-[#0B1020] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0060E0]"
                  placeholder="Answer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}