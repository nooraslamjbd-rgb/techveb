const WORD_SAFE_TRIM = /[\s.,;:!?؟\-–—:;)\]}"'”’]+$/u;

/**
 * Truncate to `max` characters without cutting a word in half.
 *
 * SEO metadata titles must never end mid-word ("...professionalism and sa").
 * Google rewrites such titles anyway, and the cut fragment reads as a typo in
 * SERPs and on social cards. This walks back to the last word boundary instead.
 *
 * Never returns an empty string for non-empty input. Note that a single
 * unbroken word longer than `max` has no boundary to fall back to, so it is
 * hard-cut — such titles do not occur in practice, but the limit is honoured.
 */
export function truncateAtWord(value: string, max: number): string {
  const text = (value ?? "").trim();
  if (!text || max <= 0) return "";
  if (text.length <= max) return text;

  const hardCut = text.slice(0, max);
  const lastSpace = hardCut.lastIndexOf(" ");
  const boundary = lastSpace > 0 ? hardCut.slice(0, lastSpace) : hardCut;

  return boundary.replace(WORD_SAFE_TRIM, "").trim();
}