import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/github";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, content } = await request.json();

    if (!filename || !content) {
      return NextResponse.json({ error: "filename and content required" }, { status: 400 });
    }

    const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
    const sizeBytes = Math.ceil((base64Data.length * 3) / 4);
    if (sizeBytes > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Image exceeds 5MB limit" }, { status: 400 });
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const url = await uploadImage(safeFilename, content, `[Admin] Upload image: ${safeFilename}`);

    return NextResponse.json({ success: true, url });
  } catch {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
