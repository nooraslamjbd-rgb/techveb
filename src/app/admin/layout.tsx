"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { label: "Articles", href: "/admin/articles", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { label: "Categories", href: "/admin/categories", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
  { label: "New Article", href: "/admin/articles/new", icon: "M12 4v16m8-8H4" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      return;
    }
    fetch("/api/admin/auth-check")
      .then((r) => {
        if (r.ok) setAuthenticated(true);
        else router.push("/admin");
      })
      .catch(() => router.push("/admin"));
  }, [pathname, router]);

  if (pathname === "/admin" || pathname === "/admin/") {
    return <>{children}</>;
  }

  if (!authenticated && pathname !== "/admin" && pathname !== "/admin/") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B14]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0060E0] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080B14] text-gray-200">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1020] border-r border-[#1E293B] transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-[#1E293B] px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0060E0] text-sm font-bold text-white">
            TV
          </div>
          <span className="text-lg font-semibold text-white">TechVeb Admin</span>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0060E0]/15 text-[#3388FF]"
                    : "text-gray-400 hover:bg-[#1A2236] hover:text-gray-200"
                }`}
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#1E293B] p-3">
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-[#1A2236] hover:text-gray-200"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Logout
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#1E293B] bg-[#0B1020]/80 px-4 backdrop-blur-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-[#1A2236] hover:text-gray-200 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white">
              {navItems.find(
                (n) => pathname === n.href || pathname.startsWith(n.href + "/")
              )?.label || "Admin"}
            </h1>
          </div>

          <Link
            href="/"
            target="_blank"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#1A2236] hover:text-gray-200"
          >
            View Site ↗
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
