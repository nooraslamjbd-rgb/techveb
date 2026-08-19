import { NextResponse } from "next/server";
import { getCategoriesFromGitHub } from "@/lib/categories";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "nooraslamjbd-rgb/techveb";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategoriesFromGitHub();

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/src/config/categories.json?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "TechVeb-Admin",
        },
        next: { revalidate: 0 },
      }
    );

    const data = await res.json();
    return NextResponse.json({ categories, sha: data.sha });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load categories", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { categories, sha } = await request.json();

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: "Categories must be an array" }, { status: 400 });
    }

    for (const cat of categories) {
      if (!cat.slug || !cat.label || !cat.color) {
        return NextResponse.json({ error: "Each category needs slug, label, and color" }, { status: 400 });
      }
      if (!/^[a-z0-9-]+$/.test(cat.slug)) {
        return NextResponse.json({ error: `Invalid slug: ${cat.slug}. Use lowercase letters, numbers, and hyphens only.` }, { status: 400 });
      }
    }

    const slugs = categories.map((c: { slug: string }) => c.slug);
    const uniqueSlugs = new Set(slugs);
    if (uniqueSlugs.size !== slugs.length) {
      return NextResponse.json({ error: "Duplicate slugs found" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/src/config/categories.json`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "TechVeb-Admin",
        },
        body: JSON.stringify({
          message: "Update categories via admin panel",
          content: btoa(JSON.stringify(categories, null, 2) + "\n"),
          sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: `GitHub API error: ${res.status}`, details: err }, { status: 500 });
    }

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update categories", details: String(error) },
      { status: 500 }
    );
  }
}
