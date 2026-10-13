"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className="text-sm text-muted hover:text-primary transition-colors underline-offset-2 hover:underline"
    >
      Cookie Settings
    </button>
  );
}
