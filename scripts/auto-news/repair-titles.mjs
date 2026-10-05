import fs from "node:fs";
import path from "node:path";

/**
 * Conservative frontmatter-only cleanup for auto-news content.
 *
 * SCOPE IS DELIBERATELY LIMITED TO FRONTMATTER. An earlier revision also rewrote
 * the MDX body, which corrupted markdown (heading/bullet merging) and caused
 * CRLF churn across whole files. Body-level scraper cleanup needs a dedicated,
 * structure-aware pass and is intentionally not attempted here.
 *
 * Only three provably-safe, subtractive operations are performed:
 *   1. title       - drop the dangling fragment left by `substring(0, 60)`
 *   2. readingTime - recompute from real word count
 *   3. keyTakeaways- strip "HomePakistan" prefix + "Published <d> | <t> <AM/PM>"
 *
 * Line endings and all other bytes are preserved: the file is reassembled by
 * splicing edited frontmatter lines back into the original string.
 *
 * Dry-run by default. Pass --write to apply.
 */

const DIRS = ["news", "blog", "reviews", "ai-tools"];
const CONTENT_ROOT = "src/content";
const WRITE = process.argv.includes("--write");
const WORDS_PER_MIN = 220;

const PUBLISHED_INLINE =
  /Published\s+[A-Z][a-z]+\s+\d{1,2},\s*\d{4}\s*\|\s*\d{1,2}:\d{2}\s*(?:AM|PM)?\s*/g;

const SHORT_OK = new Set([
  "a", "an", "the", "of", "in", "on", "at", "to", "is", "it", "as", "by", "for",
  "vs", "up", "so", "no", "us", "uk", "qa", "id", "ai", "1", "2", "3", "24",
  "47", "etc", "pm", "am",
]);

// Two-letter all-caps tokens are almost always meaningful abbreviations that the
// 60-char truncation happened to land on cleanly (Cosmos DB, Punjab CM, GB,
// Foreign Minister, WI cricket notation). Dropping them damages meaning, and
// they cannot be distinguished from real fragments by shape alone, so they are
// left untouched. A trailing hyphen ("D-") IS an unambiguous mid-word cut.
const ABBREV_2 = /^[A-Z]{2}$/;

// Urdu/Arabic-script titles are skipped by the fragment heuristic. Two-character
// tokens are ambiguous there without real morphology: dropping the "ne" suffix
// in "...video ne" is right, but dropping "ge" in "...log hon ge" strands the
// valid word "hon". A cosmetic fragment is better than broken Urdu on a
// bilingual site, so only the trailing-space trim applies.
const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

// Dropping a fragment can expose a dangling function word ("Trump and Xi" ->
// "Trump and"). Strip those so titles stay readable.
const TRAILING_STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "at", "by",
  "for", "with", "from", "as", "is", "are", "was", "were", "be", "been",
  "that", "this", "its", "it", "his", "her", "their", "our", "your", "have",
  "has", "had", "will", "would", "can", "could", "should", "may", "might",
]);

function stripQuotes(v) {
  const t = (v || "").trim();
  if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  return t;
}

function quoteLike(original) {
  return (original || "").trim().startsWith('"') ? '"' : "";
}

function trimEdge(value) {
  return value.replace(/[\s.,;:!?؟\-–—:;)\]}"'”’]+$/u, "").trim();
}

/** Subtitle-only: remove a broken trailing fragment, never add words. */
function trimDanglingFragment(title) {
  const value = (title || "").trim();
  if (!value) return value;
  if (/\s$/.test(title)) return trimEdge(value);
  const words = value.split(/\s+/);
  if (words.length < 4) return value;
  const last = words[words.length - 1];
  if (/[.!?:,;"')\]]$/.test(last)) return value;
  if (ARABIC_SCRIPT.test(value)) return value;

  const finish = () => {
    while (
      words.length > 1 &&
      TRAILING_STOPWORDS.has(words[words.length - 1].toLowerCase())
    ) {
      words.pop();
    }
    return trimEdge(words.join(" "));
  };

  if (/-$/.test(last)) {
    words.pop();
    return finish();
  }
  if (last.length === 2 && ABBREV_2.test(last)) return value;
  if (last.length <= 2 && !SHORT_OK.has(last.toLowerCase())) {
    words.pop();
    return finish();
  }
  return value;
}

function cleanTakeaway(text) {
  let out = text;
  out = out.replace(/^(Home\s*Pakistan|Pakistan\s*Home)\s*/i, "");
  out = out.replace(PUBLISHED_INLINE, "");
  out = out.replace(/^\s*\|\s*\d{1,2}:\d{2}\s*(?:AM|PM)?\s*/i, "");
  out = out.replace(/\s{2,}/g, " ").trim();
  return out;
}

function bodyWordCount(rest) {
  const t = rest
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/import\s+\w+\s+from\s+["'][^"']+["'];?/g, " ")
    .replace(/[#*_>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

const stats = { scanned: 0, changed: 0, titleFixed: 0, readTimeFixed: 0, takeawaysCleaned: 0 };
const changes = [];

for (const dir of DIRS) {
  const full = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(full)) continue;

  for (const file of fs.readdirSync(full)) {
    if (!file.endsWith(".mdx")) continue;
    const filePath = path.join(full, file);
    const raw = fs.readFileSync(filePath, "utf8");

    const head = raw.match(/^(---\r?\n)/);
    if (!head) continue;
    const fmStart = head[0].length;
    const closeIdx = raw.indexOf("\n---", fmStart);
    if (closeIdx === -1) continue;
    const fmEnd = closeIdx + 4; // include "\n---"

    const fm = raw.slice(fmStart, fmEnd);
    const rest = raw.slice(fmEnd);
    stats.scanned++;

    // Rebuild frontmatter by editing individual lines, preserving their EOL.
    const eol = fm.includes("\r\n") ? "\r\n" : "\n";
    const lines = fm.split(/\r?\n/);
    let nextLines = lines.slice();
    const patch = { file: filePath, slug: file.replace(/\.mdx$/, "") };
    let dirty = false;

    for (let i = 0; i < nextLines.length; i++) {
      const line = nextLines[i];

      const titleM = line.match(/^title:([ \t]*)(.*)$/);
      if (titleM) {
        const title = stripQuotes(titleM[2]);
        const fixed = trimDanglingFragment(title);
        if (fixed !== title && fixed.length >= 20) {
          nextLines[i] = `title:${titleM[1]}${quoteLike(titleM[2])}${fixed}${quoteLike(titleM[2])}`;
          patch.oldTitle = title;
          patch.newTitle = fixed;
          stats.titleFixed++;
          dirty = true;
        }
        continue;
      }

      const rtM = line.match(/^readingTime:([ \t]*)(.*)$/);
      if (rtM) {
        const words = bodyWordCount(rest);
        if (words > 0) {
          const mins = Math.max(1, Math.round(words / WORDS_PER_MIN));
          const correct = `${mins} min read`;
          if (stripQuotes(rtM[2]) !== correct) {
            nextLines[i] = `readingTime:${rtM[1]}"${correct}"`;
            patch.readingTime = correct;
            stats.readTimeFixed++;
            dirty = true;
          }
        }
        continue;
      }

      const takeM = line.match(/^(\s*-\s*")(.*)(")$/);
      if (takeM && /^(Home\s*Pakistan|Pakistan\s*Home)/i.test(takeM[2])) {
        const cleaned = cleanTakeaway(takeM[2]);
        if (cleaned !== takeM[2] && cleaned.length >= 10) {
          // Only escape quotes that are not already escaped. A blanket
          // /"/g turns an existing \" into \\", which ends the YAML scalar
          // early and makes the whole frontmatter unparseable.
          nextLines[i] = `${takeM[1]}${cleaned.replace(/(?<!\\)"/g, '\\"')}${takeM[3]}`;
          patch.takeawaysCleaned = (patch.takeawaysCleaned || 0) + 1;
          stats.takeawaysCleaned++;
          dirty = true;
        }
      }
    }

    if (dirty) {
      const nextRaw = raw.slice(0, fmStart) + nextLines.join(eol) + rest;
      stats.changed++;
      changes.push(patch);
      if (WRITE) fs.writeFileSync(filePath, nextRaw);
    }
  }
}

console.log(`mode                : ${WRITE ? "WRITE" : "dry-run"}`);
console.log(`files scanned       : ${stats.scanned}`);
console.log(`files changed       : ${stats.changed}`);
console.log(`title fragments     : ${stats.titleFixed}`);
console.log(`readingTime fixed   : ${stats.readTimeFixed}`);
console.log(`keyTakeaways cleaned: ${stats.takeawaysCleaned}`);

if (!WRITE) {
  const rows = changes.filter((c) => c.oldTitle);
  console.log(`\n--- title fragment trims (${rows.length}) ---`);
  for (const c of rows.slice(0, 10)) {
    console.log(`  OLD: ${JSON.stringify(c.oldTitle)}`);
    console.log(`  NEW: ${JSON.stringify(c.newTitle)}`);
  }
  const tk = changes.filter((c) => c.takeawaysCleaned);
  console.log(`\n--- keyTakeaways cleaned (${tk.length}) ---`);
  for (const c of tk.slice(0, 4)) console.log(`  ${c.slug.slice(0, 50)}: ${c.takeawaysCleaned}`);
}