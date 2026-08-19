import { NextRequest, NextResponse } from "next/server";

const EXPECTED_HASH = "76ff4df4cab09a291b7ea550cbc8c0daf8661795a10495b38af4d64dfee46a46";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminRoute(pathname)) return NextResponse.next();

  const response = isPublicAdminRoute(pathname)
    ? NextResponse.next()
    : (() => {
        const session = request.cookies.get("admin_session");
        if (!session || session.value !== EXPECTED_HASH) {
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
