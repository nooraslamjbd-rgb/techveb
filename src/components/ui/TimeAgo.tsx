"use client";

import { useState, useEffect } from "react";

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitialRelative(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHr = Math.floor(diffMs / 3600000);
  if (diffHr < 24) return getRelativeTime(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TimeAgo({ date, className = "" }: { date: string; className?: string }) {
  const [relative, setRelative] = useState(() => getInitialRelative(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelative(getRelativeTime(date));
    }, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <time dateTime={date} className={className} title={new Date(date).toLocaleString()}>
      {relative}
    </time>
  );
}
