import { NextRequest, NextResponse } from "next/server";

async function hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = Uint8Array.from(
    signature.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

function isPublicAdminRoute(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname === "/admin/" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/auth-check"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminRoute(pathname)) return NextResponse.next();

  const response = isPublicAdminRoute(pathname)
    ? NextResponse.next()
    : await (async () => {
        const session = request.cookies.get("admin_session");
        if (!session?.value) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        const [tokenId, signature] = session.value.split(".");
        if (!tokenId || !signature) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        const secret = process.env.SESSION_SECRET;
        if (!secret) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
          }
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        const valid = await hmacVerify(tokenId, signature, secret);
        if (!valid) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        return NextResponse.next();
      })();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
