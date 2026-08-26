"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import OptimizedImage, { imageSizes } from "@/components/ui/OptimizedImage";

interface Slide {
  slug: string;
  dir: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  date: string;
  readingTime: string;
  author: string;
  source?: string;
  language?: string;
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,96,224,0.12),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Latest Stories
          </span>
          {slide.language === "ur" && (
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 border border-green-500/20">
              اردو
            </span>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <Link
            href={`/${slide.dir}/${slide.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="relative h-[260px] sm:h-[340px] lg:h-[400px] w-full">
              {slide.image ? (
                <OptimizedImage
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={imageSizes.featured}
                  quality={85}
                  category={slide.category}
                  loading="eager"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {slide.category}
                  </span>
                  {slide.source && (
                    <span className="text-xs text-white/50">via {slide.source}</span>
                  )}
                  <span className="text-xs text-white/50">{slide.readingTime}</span>
                </div>
                <h2 className="mb-2 font-heading text-xl font-bold text-white sm:text-2xl lg:text-3xl group-hover:text-primary-light transition-colors line-clamp-3">
                  {slide.title}
                </h2>
                <p className="max-w-2xl text-sm text-white/60 line-clamp-2">
                  {slide.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                  <span className="font-medium text-white/60">{slide.author}</span>
                  <span>·</span>
                  <time dateTime={slide.date}>
                    {new Date(slide.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.slug}
                onClick={() => setCurrent(idx)}
                className={`group flex gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                  idx === current
                    ? "bg-white/10 border border-primary/30"
                    : "bg-white/5 border border-transparent hover:bg-white/8"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    idx === current
                      ? "bg-primary text-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`line-clamp-2 text-sm font-semibold leading-snug ${
                    idx === current ? "text-white" : "text-white/70"
                  }`}>
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {s.readingTime}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={prev}
              className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="flex gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === current ? "w-6 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
