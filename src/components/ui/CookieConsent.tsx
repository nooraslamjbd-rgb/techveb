"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = "G-VSCWBGYHE7";

function loadGA() {
  if (document.getElementById("ga-script")) return;
  const s1 = document.createElement("script");
  s1.id = "ga-script";
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s1.async = true;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.id = "ga-config";
  s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
  document.head.appendChild(s2);
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [consented, setConsented] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      setConsented(true);
      loadGA();
    } else if (consent === "declined") {
      setConsented(false);
    } else {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setConsented(true);
    setShow(false);
    loadGA();
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setConsented(false);
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
