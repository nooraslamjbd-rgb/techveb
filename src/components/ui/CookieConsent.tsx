"use client";

import { useState, useEffect } from "react";
import {
  CONSENT_GRANTED_SNIPPET,
  CONSENT_DENIED_SNIPPET,
} from "@/components/ads/consentMode";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VSCWBGYHE7";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const CONSENT_KEY = "cookie-consent";

type WindowWithTags = Window & {
  dataLayer?: unknown[];
  adsbygoogle?: unknown[];
};

function runSnippet(code: string) {
  try {
    const fn = new Function(code);
    fn();
  } catch {
    /* noop */
  }
}

function loadGA() {
  if (document.getElementById("ga-script")) return;
  const s1 = document.createElement("script");
  s1.id = "ga-script";
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.id = "ga-config";
  s2.textContent = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });
`;
  document.head.appendChild(s2);
}

function loadAdSense() {
  if (!ADSENSE_ID) return;
  if (document.getElementById("adsense-script")) return;

  const w = window as WindowWithTags;
  w.adsbygoogle = w.adsbygoogle || [];

  const s = document.createElement("script");
  s.id = "adsense-script";
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
  document.head.appendChild(s);
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === "accepted") {
      runSnippet(CONSENT_GRANTED_SNIPPET);
      loadGA();
    } else if (consent === "declined") {
      runSnippet(CONSENT_DENIED_SNIPPET);
    } else {
      setShow(true);
    }

    loadAdSense();
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
    runSnippet(CONSENT_GRANTED_SNIPPET);
    loadGA();
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShow(false);
    runSnippet(CONSENT_DENIED_SNIPPET);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted">
          We use cookies to enhance your experience, analyse site traffic, and
          show relevant ads. You can accept all cookies, or decline and still
          use the site. Read our{" "}
          <a
            href="/privacy-policy"
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </a>{" "}
          for details, including how Google Consent Mode v2 is used.
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