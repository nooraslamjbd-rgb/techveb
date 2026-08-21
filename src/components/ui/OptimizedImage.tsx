"use client";

import { useState, useCallback, useMemo } from "react";
import Image, { type ImageProps } from "next/image";

// Tiny 1x1 transparent pixel as blur placeholder (base64)
const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=";

// Gradient placeholder for category-colored fallbacks
function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    ai: "from-blue-600/20 to-purple-600/20",
    "tech-news": "from-green-600/20 to-emerald-600/20",
    "product-reviews": "from-orange-500/20 to-amber-500/20",
    cloud: "from-sky-500/20 to-blue-500/20",
    cybersecurity: "from-red-500/20 to-rose-500/20",
    tutorials: "from-violet-500/20 to-indigo-500/20",
    "emerging-tech": "from-cyan-500/20 to-teal-500/20",
    gaming: "from-pink-500/20 to-fuchsia-500/20",
    blog: "from-gray-500/20 to-slate-500/20",
    coding: "from-emerald-500/20 to-green-500/20",
  };
  return gradients[category] || "from-primary/20 to-accent/20";
}

// Generate gradient SVG blur placeholder based on category
function makeBlurPlaceholder(category?: string): string {
  const categoryColors: Record<string, [string, string]> = {
    ai: ["3b82f6", "8b5cf6"],
    "tech-news": ["10b981", "059669"],
    "product-reviews": ["f59e0b", "d97706"],
    cloud: ["0ea5e9", "0284c7"],
    cybersecurity: ["ef4444", "dc2626"],
    tutorials: ["8b5cf6", "7c3aed"],
    "emerging-tech": ["06b6d4", "0891b2"],
    gaming: ["ec4899", "db2777"],
    blog: ["64748b", "475569"],
    coding: ["10b981", "059669"],
  };
  const colors = categoryColors[category || ""] || ["e2e8f0", "cbd5e1"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23${colors[0]}"/><stop offset="100%" stop-color="%23${colors[1]}"/></linearGradient></defs><rect width="32" height="32" fill="url(%23g)"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

interface OptimizedImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  /** Show blur placeholder while loading */
  showBlur?: boolean;
  /** Category for gradient fallback */
  category?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  showBlur = true,
  category,
  quality = 75,
  loading = "lazy",
  sizes,
  ...props
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate gradient blur placeholder based on category
  const blurDataUrl = useMemo(
    () => (showBlur ? makeBlurPlaceholder(category) : undefined),
    [category, showBlur]
  );

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // If image failed to load, show gradient fallback
  if (hasError) {
    const gradient = getCategoryGradient(category || "");
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
        {...(props.style ? { style: props.style } : {})}
      >
        <span className="text-center text-sm font-semibold text-muted-foreground/50 line-clamp-2 px-4">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${isLoaded ? "" : "bg-muted/30"}`}>
      <Image
        src={src}
        alt={alt}
        quality={quality}
        loading={loading}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        placeholder={showBlur ? "blur" : undefined}
        blurDataURL={blurDataUrl || BLUR_PLACEHOLDER}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}

// Predefined size presets for common layouts
export const imageSizes = {
  /** Full-width hero on article pages */
  hero: "(max-width: 768px) 100vw, 768px",
  /** Featured card on homepage - large */
  featured: "(max-width: 768px) 100vw, (max-width: 1200px) 800px, 900px",
  /** Standard article card in grid */
  card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px",
  /** Compact sidebar card */
  compact: "64px",
  /** Thumbnail for lists */
  thumbnail: "128px",
  /** Medium card for two-column layout */
  medium: "(max-width: 768px) 100vw, 500px",
  /** Small card for three-column grid */
  small: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
} as const;
