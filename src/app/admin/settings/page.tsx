"use client";

import { useState } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorEmail: string;
  phone: string;
  address: string;
  googleAnalyticsId: string;
  searchConsoleVerification: string;
  ogDefaultImage: string;
  twitterHandle: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "TechVeb",
    siteDescription: "Your go-to source for the latest in technology, artificial intelligence, product reviews, and digital innovation.",
    siteUrl: "https://techveb.com",
    authorEmail: "nooraslamjbd@gmail.com",
    phone: "+92 313 6473379",
    address: "Pakistan",
    googleAnalyticsId: "",
    searchConsoleVerification: "",
    ogDefaultImage: "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png",
    twitterHandle: "",
    facebookUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
  });

  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem("techveb-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Site Settings</h2>
          <p className="text-xs text-gray-500 mt-1">Settings are saved to your browser. For persistent changes, edit src/config/site.ts.</p>
        </div>
        <button
          onClick={handleSave}
          className="rounded-lg bg-[#0060E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004BB0]"
        >
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>

      {/* General Settings */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">General</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Site URL</label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-400">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Email</label>
            <input
              type="email"
              value={settings.authorEmail}
              onChange={(e) => setSettings({ ...settings, authorEmail: e.target.value })}
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">SEO & Analytics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Google Analytics ID</label>
            <input
              type="text"
              value={settings.googleAnalyticsId}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#0060E0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Search Console Verification</label>
            <input
              type="text"
              value={settings.searchConsoleVerification}
              onChange={(e) => setSettings({ ...settings, searchConsoleVerification: e.target.value })}
              placeholder="XXXXXXXXXX"
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#0060E0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Default OG Image</label>
            <input
              type="text"
              value={settings.ogDefaultImage}
              onChange={(e) => setSettings({ ...settings, ogDefaultImage: e.target.value })}
              className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white outline-none focus:border-[#0060E0]"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Social Media</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "twitterHandle" as const, label: "Twitter/X Handle", placeholder: "@techveb" },
            { key: "facebookUrl" as const, label: "Facebook URL", placeholder: "https://facebook.com/techveb" },
            { key: "linkedinUrl" as const, label: "LinkedIn URL", placeholder: "https://linkedin.com/company/techveb" },
            { key: "youtubeUrl" as const, label: "YouTube URL", placeholder: "https://youtube.com/@techveb" },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-medium text-gray-400">{field.label}</label>
              <input
                type="url"
                value={settings[field.key]}
                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-[#1E293B] bg-[#080B14] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#0060E0]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B1020] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1E293B] bg-[#080B14] px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2236] hover:text-white"
          >
            Google Search Console ↗
          </a>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1E293B] bg-[#080B14] px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2236] hover:text-white"
          >
            Google Analytics ↗
          </a>
          <a
            href="https://pagespeed.web.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1E293B] bg-[#080B14] px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2236] hover:text-white"
          >
            PageSpeed Insights ↗
          </a>
          <a
            href="https://validator.schema.org"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1E293B] bg-[#080B14] px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2236] hover:text-white"
          >
            Schema Validator ↗
          </a>
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1E293B] bg-[#080B14] px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2236] hover:text-white"
          >
            Rich Results Test ↗
          </a>
        </div>
      </div>
    </div>
  );
}
