import { NextResponse } from "next/server";
import { getPost } from "@/lib/mdx";
import { getFileContent, createFile, updateFile, deleteFile } from "@/lib/github";
import { getDirFromCategory } from "@/lib/category-utils";

export const dynamic = "force-dynamic";

const ALLOWED_DIRS = ["blog", "reviews", "ai-tools", "news"];

function validateDir(dir: string | null): string {
  if (!dir || !ALLOWED_DIRS.includes(dir)) return "blog";
  return dir;
}

function validateSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9\-]{0,200}$/.test(slug);
}

function sanitizeString(val: unknown, maxLen: number = 500): string {
  if (typeof val !== "string") return "";
  return val.slice(0, maxLen).trim();
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function buildFrontmatter(fields: Record<string, unknown>): string {
  const lines: string[] = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === "boolean") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(String(value))}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!validateSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const dirs = ALLOWED_DIRS.filter(d => d !== "news");
    let post = null;
    let dir = "blog";

    for (const d of dirs) {
      const found = getPost(d, slug);
      if (found) {
        post = found;
        dir = d;
        break;
      }
    }

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
      category: post.category,
      tags: post.tags,
      image: post.image || "",
      imageCredit: post.imageCredit || "",
      imageCreditUrl: post.imageCreditUrl || "",
      featured: post.featured || false,
      status: (post as unknown as Record<string, unknown>).status === "draft" ? "draft" : "published",
      content: post.content,
      faq: post.faq || [],
      dir,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!validateSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const body = await request.json();
    const title = sanitizeString(body.title, 200);
    const description = sanitizeString(body.description, 500);
    const content = sanitizeString(body.content, 100000);
    const category = sanitizeString(body.category, 50);
    const author = sanitizeString(body.author, 100);

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const dir = validateDir(body.dir || getDirFromCategory(category || "blog"));
    const targetSlug = body.newSlug && validateSlug(body.newSlug) ? body.newSlug : slug;

    const frontmatter = buildFrontmatter({
      title,
      description,
      date: body.date || new Date().toISOString().split("T")[0],
      author: author || "TechVeb Team",
      category,
      tags: Array.isArray(body.tags) ? body.tags.slice(0, 20) : [],
      image: sanitizeString(body.image, 500) || undefined,
      imageCredit: sanitizeString(body.imageCredit, 200) || undefined,
      imageCreditUrl: sanitizeString(body.imageCreditUrl, 500) || undefined,
      featured: Boolean(body.featured),
      status: ["published", "draft"].includes(body.status) ? body.status : "published",
      faq: Array.isArray(body.faq) ? body.faq.slice(0, 20) : undefined,
    });

    const fullContent = `${frontmatter}\n\n${content || ""}`;

    if (targetSlug !== slug) {
      const github = await import("@/lib/github");
      try {
        const old = await github.getFileContent(dir, slug);
        await github.deleteFile(dir, slug, old.sha, `[Admin] Delete old article: ${slug}`);
      } catch {
        // Old file might not exist
      }
      await createFile(dir, targetSlug, fullContent, `[Admin] Create article: ${targetSlug}`);
    } else {
      try {
        const existing = await getFileContent(dir, slug);
        await updateFile(dir, targetSlug, fullContent, existing.sha, `[Admin] Update article: ${targetSlug}`);
      } catch {
        await createFile(dir, targetSlug, fullContent, `[Admin] Create article: ${targetSlug}`);
      }
    }

    return NextResponse.json({ success: true, slug: targetSlug });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!validateSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const dir = validateDir(searchParams.get("dir"));

    const existing = await getFileContent(dir, slug);
    await deleteFile(dir, slug, existing.sha, `[Admin] Delete article: ${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
