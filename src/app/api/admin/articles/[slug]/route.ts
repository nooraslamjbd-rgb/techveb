import { NextResponse } from "next/server";
import { getPost } from "@/lib/mdx";
import { getFileContent, createFile, updateFile, deleteFile } from "@/lib/github";
import { getDirFromCategory } from "@/lib/category-utils";

export const dynamic = "force-dynamic";

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

    const dirs = ["blog", "reviews", "ai-tools"];
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
    const body = await request.json();
    const { title, description, date, author, category, tags, image, imageCredit, imageCreditUrl, featured, status, content, faq, dir: bodyDir } = body;

    const dir = bodyDir || getDirFromCategory(category || "blog");
    const targetSlug = body.newSlug || slug;

    const frontmatter = buildFrontmatter({
      title,
      description,
      date: date || new Date().toISOString().split("T")[0],
      author: author || "TechVeb Team",
      category,
      tags: tags || [],
      image: image || undefined,
      imageCredit: imageCredit || undefined,
      imageCreditUrl: imageCreditUrl || undefined,
      featured: featured || false,
      status: status || "published",
      faq: faq && faq.length > 0 ? faq : undefined,
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
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir") || "blog";

    const existing = await getFileContent(dir, slug);
    await deleteFile(dir, slug, existing.sha, `[Admin] Delete article: ${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
