import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const NEWS_DIR = join(import.meta.dirname, "..", "src", "content", "news");

const GARBAGE_PATTERNS = [
  /^-?\s*Home\s*(Pakistan|Business|Tech|World|Sports|Entertainment|Opinion|Life|Science|Middle East|UAE)?/i,
  /^-?\s*Published\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i,
  /^-?\s*\w+Pakistan/i,
  /^-?\s*\w+Business/i,
  /^-?\s*\w+Middle\s+East/i,
  /^###\s+/,
  /seconds?\s+ago/i,
  /\]\(https?:\/\/[^\)]+\)/,
  /More\s+Stories\s+From/i,
];

function isGarbageDescription(desc, lang) {
  if (!desc || desc.length < 5) return true;

  for (const pattern of GARBAGE_PATTERNS) {
    if (pattern.test(desc)) return true;
  }

  if (desc.length > 200) return true;

  return false;
}

function isNavOrJunk(line) {
  if (line === "") return true;
  if (line.startsWith("-")) return true;
  if (line.startsWith("[")) return true;
  if (line.startsWith("### ")) return true;
  if (line.startsWith("*Originally reported")) return true;
  if (line === "---") return true;
  if (/seconds?\s+ago/i.test(line)) return true;
  if (/More\s+Stories/i.test(line)) return true;
  return false;
}

function cleanText(text) {
  let cleaned = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
  return cleaned;
}

function extractFromKeyTakeaways(frontmatter) {
  const ktMatch = frontmatter.match(/keyTakeaways:\s*\n([\s\S]*?)(?=\n---)/);
  if (!ktMatch) return "";

  const lines = ktMatch[1].split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*-\s+"(.+?)"\s*$/);
    if (!m) continue;
    const text = cleanText(m[1]);
    if (text.length < 10) continue;
    if (/^Home/i.test(text)) continue;
    if (/^Published/i.test(text)) continue;
    if (/More\s+Stories/i.test(text)) continue;
    if (/seconds?\s+ago/i.test(text)) continue;
    if (text.length > 200) return text.substring(0, 197) + "...";
    return text;
  }
  return "";
}

function extractDescriptionFromBody(body) {
  const lines = body.split("\n");
  let foundTakeaways = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!foundTakeaways) {
      if (line === "## Key Takeaways" || line === "## Key Highlights") {
        foundTakeaways = true;
      }
      continue;
    }

    if (line.startsWith("## Frequently Asked Questions") || line.startsWith("## FAQ")) break;
    if (line.startsWith("*Originally reported by")) break;
    if (line === "---") break;

    if (isNavOrJunk(line)) continue;

    if (line.startsWith("## ")) continue;

    let cleaned = cleanText(line);
    if (cleaned.length < 10) continue;

    if (cleaned.length > 200) {
      cleaned = cleaned.substring(0, 197) + "...";
    }

    return cleaned;
  }

  return "";
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: null, body: content };
  return { frontmatter: match[1], body: content.substring(match[0].length).trim() };
}

function replaceDescription(frontmatter, newDesc) {
  const escaped = newDesc.replace(/"/g, '\\"');
  return frontmatter.replace(
    /^description:\s*"[^"]*"/m,
    `description: "${escaped}"`
  );
}

const files = readdirSync(NEWS_DIR).filter((f) => f.endsWith(".mdx"));
let fixedCount = 0;
let totalUrdu = 0;
let totalEn = 0;

for (const file of files) {
  const filePath = join(NEWS_DIR, file);
  const raw = readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(raw);

  if (!frontmatter) continue;

  const langMatch = frontmatter.match(/language:\s*"(\w+)"/);
  if (!langMatch) continue;

  const lang = langMatch[1];
  if (lang === "ur") totalUrdu++;
  if (lang === "en") totalEn++;

  const descMatch = frontmatter.match(/description:\s*"([^"]*)"/);
  if (!descMatch) continue;

  const currentDesc = descMatch[1];

  if (!isGarbageDescription(currentDesc, lang)) continue;

  let newDesc = extractDescriptionFromBody(body);

  if (!newDesc || newDesc.length < 10) {
    newDesc = extractFromKeyTakeaways(frontmatter);
  }

  if (!newDesc || newDesc.length < 10) {
    console.log(`  SKIP (no good content): ${file}`);
    continue;
  }

  if (newDesc === currentDesc) continue;

  const newFrontmatter = replaceDescription(frontmatter, newDesc);
  const newContent = raw.replace(frontmatter, newFrontmatter);

  writeFileSync(filePath, newContent, "utf-8");
  fixedCount++;
  console.log(`FIXED [${lang}] ${file}`);
  console.log(`  OLD: ${currentDesc.substring(0, 80)}...`);
  console.log(`  NEW: ${newDesc.substring(0, 80)}...`);
  console.log();
}

console.log(`\nDone.`);
console.log(`  Urdu articles scanned: ${totalUrdu}`);
console.log(`  English articles scanned: ${totalEn}`);
console.log(`  Files fixed: ${fixedCount}`);
