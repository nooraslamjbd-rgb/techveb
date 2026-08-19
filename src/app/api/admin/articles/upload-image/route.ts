import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return NextResponse.json({ error: "filename and content required" }, { status: 400 });
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const url = await uploadImage(safeFilename, content, `[Admin] Upload image: ${safeFilename}`);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
