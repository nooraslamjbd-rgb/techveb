"use client";

import { useEffect, useState } from "react";

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const container = document.getElementById("giscus-comments");
    if (!container) return;

    container.innerHTML = "";

    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "nooraslamjbd-rgb/techveb");
    script.setAttribute("data-repo-id", "");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", isDark ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    container.appendChild(script);
  }, [mounted, slug]);

  if (!mounted) return null;

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="mb-6 font-heading text-xl font-bold sm:text-2xl">Comments</h2>
      <div id="giscus-comments" />
      <p className="mt-4 text-xs text-muted-foreground">
        Comments are powered by{" "}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Giscus
        </a>{" "}
        with GitHub Discussions.
      </p>
    </div>
  );
}
