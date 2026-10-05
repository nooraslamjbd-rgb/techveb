"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

type WindowWithAds = Window & {
  adsbygoogle?: unknown[];
};

export default function AdSlot({
  slot,
  format = "auto",
  className,
  minHeight = 90,
}: {
  slot: string;
  format?: string;
  className?: string;
  minHeight?: number;
}) {
  const publisherId = siteConfig.adsense.publisherId;

  useEffect(() => {
    if (!slot) return;
    try {
      const w = window as WindowWithAds;
      // The queue must exist before the push. AdSlot effects can run before the
      // AdSense loader initialises it, and a missing queue silently drops the
      // ad request, so create it here rather than only checking for it.
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ad blocked or script unavailable - layout stays intact */
    }
  }, [slot]);

  if (!slot || !publisherId) return null;

  return (
    <div
      className={`my-8 flex justify-center ${className || ""}`}
      style={{ minHeight }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}