"use client";

import { useEffect } from "react";

export default function PageLang({
  lang = "en",
  dir = "ltr",
}: {
  lang?: string;
  dir?: string;
}) {
  useEffect(() => {
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    return () => {
      document.documentElement.lang = prevLang;
      document.documentElement.dir = prevDir;
    };
  }, [lang, dir]);
  return null;
}
