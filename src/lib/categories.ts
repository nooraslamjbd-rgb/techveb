import fs from "fs";
import path from "path";

export interface Category {
  slug: string;
  label: string;
  color: string;
}

const CATEGORIES_PATH = path.join(process.cwd(), "src", "config", "categories.json");

export function getCategories(): Category[] {
  try {
    const raw = fs.readFileSync(CATEGORIES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getCategoriesFromGitHub(): Promise<Category[]> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "nooraslamjbd-rgb/techveb";
  const branch = process.env.GITHUB_BRANCH || "main";

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/src/config/categories.json?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "TechVeb-Admin",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) return getCategories();

  const data = await res.json();
  const content = atob(data.content);
  return JSON.parse(content);
}

export async function updateCategoriesOnGitHub(
  categories: Category[],
  sha: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "nooraslamjbd-rgb/techveb";
  const branch = process.env.GITHUB_BRANCH || "main";

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/src/config/categories.json`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "TechVeb-Admin",
      },
      body: JSON.stringify({
        message: "Update categories via admin panel",
        content: btoa(JSON.stringify(categories, null, 2) + "\n"),
        sha,
        branch,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${res.status} ${JSON.stringify(err)}`);
  }
}
