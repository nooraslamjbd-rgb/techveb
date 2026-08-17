"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted">
          We use cookies to enhance your experience and analyze site traffic. By
          clicking &quot;Accept&quot;, you consent to our use of cookies. Read our{" "}
          <a href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </a>{" "}
          for more information.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-hover transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
