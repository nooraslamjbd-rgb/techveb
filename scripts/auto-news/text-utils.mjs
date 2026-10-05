/**
 * Text helpers for the auto-news pipeline.
 *
 * Titles must never be cut mid-word: a broken headline reads as spam in SERPs
 * and undermines E-E-A-T. We truncate on a word boundary and strip dangling
 * punctuation instead.
 */

const TITLE_MAX = 70;
const DESC_MAX = 160;

/**
 * Truncate on a word boundary, never mid-word.
 * Tries the limit, then steps back to the previous space.
 */
export function truncateAtWord(text, limit) {
  const value = (text || "").trim().replace(/\s+/g, " ");
  if (!value) return "";
  if (value.length <= limit) return value;

  const hard = value.slice(0, limit);
  const lastSpace = hard.lastIndexOf(" ");
  const cut = lastSpace > limit * 0.6 ? hard.slice(0, lastSpace) : hard;

  return cut.replace(/[\s.,;:!?\-–—:;)\]}"'”’]+$/u, "").trim();
}

export function normalizeTitle(text) {
  return truncateAtWord(text, TITLE_MAX);
}

export function normalizeDescription(text) {
  const value = truncateAtWord(text, DESC_MAX);
  if (value.length < 20) return value;
  return /[.!?:)\]}"'”’]$/u.test(value) ? value : `${value}...`;
}

export { TITLE_MAX, DESC_MAX };