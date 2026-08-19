import categoriesData from "@/config/categories.json";

export interface Category {
  slug: string;
  label: string;
  color: string;
}

export const categories: Category[] = categoriesData;

export const categoryColorMap: Record<string, string> = Object.fromEntries(
  categoriesData.map((c) => {
    const colorClassMap: Record<string, string> = {
      "#0060E0": "bg-blue-500/15 text-blue-400",
      "#10B981": "bg-emerald-500/15 text-emerald-400",
      "#F59E0B": "bg-amber-500/15 text-amber-400",
      "#8B5CF6": "bg-violet-500/15 text-violet-400",
      "#EC4899": "bg-pink-500/15 text-pink-400",
      "#EF4444": "bg-red-500/15 text-red-400",
      "#F97316": "bg-orange-500/15 text-orange-400",
      "#06B6D4": "bg-cyan-500/15 text-cyan-400",
      "#6366F1": "bg-indigo-500/15 text-indigo-400",
      "#14B8A6": "bg-teal-500/15 text-teal-400",
      "#D946EF": "bg-fuchsia-500/15 text-fuchsia-400",
      "#84CC16": "bg-lime-500/15 text-lime-400",
      "#F43F5E": "bg-rose-500/15 text-rose-400",
      "#0EA5E9": "bg-sky-500/15 text-sky-400",
      "#A855F7": "bg-purple-500/15 text-purple-400",
    };
    return [c.slug, colorClassMap[c.color] || "bg-gray-500/15 text-gray-400"];
  })
);

export const categoryLabelMap: Record<string, string> = Object.fromEntries(
  categoriesData.map((c) => [c.slug, c.label])
);
