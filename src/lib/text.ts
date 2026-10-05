const WORD_SAFE_TRIM = /[\s.,;:!?؟\-–—:;)\]}"'”’]+$/u;

// Falling back to a word boundary can leave a dangling function word
// ("...professionalism and"). Strip those so titles read cleanly in SERPs.
const TRAILING_STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "at", "by",
  "for", "with", "from", "as", "is", "are", "was", "were", "be", "been",
  "that", "this", "its", "it", "his", "her", "their", "our", "your",
]);

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

  const words = boundary.replace(WORD_SAFE_TRIM, "").trim().split(/\s+/);
  while (
    words.length > 1 &&
    TRAILING_STOPWORDS.has(words[words.length - 1].toLowerCase())
  ) {
    words.pop();
  }

  return words.join(" ").trim();
}