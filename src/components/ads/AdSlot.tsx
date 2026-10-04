"use client";

import { useEffect } from "react";

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
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!slot) return;
    try {
      const w = window as WindowWithAds;
      if (w.adsbygoogle) w.adsbygoogle.push({});
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