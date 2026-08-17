const categoryDirMap: Record<string, string> = {
  ai: "ai-tools",
  "product-reviews": "reviews",
  reviews: "reviews",
};

export function getDirFromCategory(category: string): string {
  return categoryDirMap[category] || "blog";
}
