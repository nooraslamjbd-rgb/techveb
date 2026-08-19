"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/logout", { method: "POST" }).then(() => {
      router.push("/admin");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080B14]">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0060E0] border-t-transparent" />
        Logging out...
      </div>
    </div>
  );
}
