import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6IUThn_afVbRS0CVp27TzQgc2QHervJZD-JAQbbzoAnQw";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

const CONTENT_DIRS = [
  path.join(__dirname, "..", "..", "src", "content", "blog"),
  path.join(__dirname, "..", "..", "src", "content", "news"),
  path.join(__dirname, "..", "..", "src", "content", "ai-tools"),
  path.join(__dirname, "..", "..", "src", "content", "reviews"),
];

const DELAY_MS = 3000;
const MAX_RETRIES = 2;
const MAX_FILES_PER_RUN = 20;
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Strip external/placeholder images from body content to avoid copyright hotlinks.
function stripExternalImages(content) {
  if (!content) return content;
  let text = content;
  text = text.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "");
  text = text.replace(/\[\]\(https?:\/\/[^\s)]+\)/g, "");
  text = text.replace(/!\[[^\]]*\]\((https?:\/\/[^)\s]+|data:image\/[^)]*)\)/g, "");
  text = text.replace(/^\s*https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp|gif)\s*\n?/gim, "");
  text = text.replace(/^\s*(Image source,.*|Image caption,?.*|Figure caption,?.*)\s*\n?/gim, "");
  // Strip raw CSS/style blocks injected by upstream scrapers (e.g. `body { margin:0; ... }`)
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/(?:body|html|\*|p|div|img|h[1-6])\s*\{[^}]*\}\s*/gi, "");
  text = text.replace(/@media[^\{]*\{[^}]*\}\s*/gi, "");
  return text.replace(/\n{3,}/g, "\n\n");
}

function buildPrompt(title, description, content, isUrdu) {
  const lang = isUrdu ? "Urdu (اردو)" : "English";
  return `You are an expert SEO/AEO/GEO/LLMs content editor for TechVeb (techveb.com).
Enhance this article's frontmatter for maximum SEO, Answer Engine Optimization, Generative Engine Optimization, and LLM readability.

LANGUAGE: Generate ALL content in ${lang}.

Title: ${title}
Description: ${description}
Content (first 1500 chars): ${content.substring(0, 1500)}

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "Optimized title (max 60 chars, keyword-rich)",
  "description": "Meta description (max 160 chars, compelling, includes primary keyword)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4", "takeaway 5"],
  "faq": [
    {"question": "Question 1 people actually search for?", "answer": "Direct concise answer 1-2 sentences."},
    {"question": "Question 2?", "answer": "Answer 2."},
    {"question": "Question 3?", "answer": "Answer 3."}
  ]
}

RULES:
- Key Takeaways: 5 concise bullets (max 15 words each)
- FAQ: 3-5 real search questions with direct answers
- Title: max 60 chars, include primary keyword
- Description: max 160 chars
- Tags: 5-8 lowercase relevant tags
- Output ONLY the JSON`;
}

async function callGemini(title, description, content, isUrdu, retryCount = 0) {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(title, description, content, isUrdu) }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const waitSec = (retryCount + 1) * 10;
      console.log(`\n    Rate limited. Waiting ${waitSec}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await sleep(waitSec * 1000);
      return callGemini(title, description, content, isUrdu, retryCount + 1);
    }

    if (!response.ok) {
      const err = await response.text();
      console.error(`    Gemini error: ${response.status} - ${err.substring(0, 200)}`);
      if (response.status === 429) return "quota";
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON object by finding matching braces
      const start = text.indexOf("{");
      if (start === -1) return null;
      let depth = 0;
      let end = -1;
      for (let i = start; i < text.length; i++) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
      }
      if (end === -1) return null;
      try {
        parsed = JSON.parse(text.substring(start, end + 1));
      } catch {
        return null;
      }
    }

    return {
      title: (parsed.title || title).substring(0, 60),
      description: (parsed.description || description).substring(0, 160),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : null,
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways.slice(0, 5) : null,
      faq: Array.isArray(parsed.faq) ? parsed.faq.slice(0, 5) : null,
    };
  } catch (err) {
    console.error(`    Gemini call failed: ${err.message}`);
    return null;
  }
}

function rebuildFrontmatter(data, originalFrontmatter) {
  const lines = ["---"];

  // Preserve all original frontmatter keys, but enhance specific ones
  for (const [key, value] of Object.entries(originalFrontmatter)) {
    if (key === "faq" && data.faq) {
      lines.push("faq:");
      for (const item of data.faq) {
        const q = (item.question || "").replace(/"/g, '\\"');
        const a = (item.answer || "").replace(/"/g, '\\"');
        lines.push(`  - question: "${q}"`);
        lines.push(`    answer: "${a}"`);
      }
    } else if (key === "keyTakeaways" && data.keyTakeaways) {
      lines.push("keyTakeaways:");
      for (const kt of data.keyTakeaways) {
        lines.push(`  - "${(kt || "").replace(/"/g, '\\"')}"`);
      }
    } else if (key === "title" && data.title) {
      lines.push(`title: "${data.title.replace(/"/g, '\\"')}"`);
    } else if (key === "description" && data.description) {
      lines.push(`description: "${data.description.replace(/"/g, '\\"')}"`);
    } else if (key === "tags" && data.tags) {
      lines.push(`tags: [${data.tags.map(t => `"${t}"`).join(", ")}]`);
    } else if (key === "date") {
      const d = new Date(value || Date.now());
      const todayDate = new Date().toISOString().split("T")[0];
      const clamped = !isNaN(d.getTime()) && d.getTime() > Date.now() ? todayDate : (value || todayDate);
      lines.push(`date: "${clamped}"`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else if (typeof value[0] === "object") {
        lines.push(`${key}:`);
        for (const item of value) {
          const entries = Object.entries(item).map(([k, v]) => `${k}: "${String(v).replace(/"/g, '\\"')}"`).join(", ");
          lines.push(`  - { ${entries} }`);
        }
      } else {
        lines.push(`${key}: [${value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(", ")}]`);
      }
    } else if (typeof value === "boolean") {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === "number") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value || "").replace(/"/g, '\\"')}"`);
    }
  }

  // Add new fields if not in original
  if (!originalFrontmatter.faq && data.faq) {
    lines.push("faq:");
    for (const item of data.faq) {
      const q = (item.question || "").replace(/"/g, '\\"');
      const a = (item.answer || "").replace(/"/g, '\\"');
      lines.push(`  - question: "${q}"`);
      lines.push(`    answer: "${a}"`);
    }
  }
  if (!originalFrontmatter.keyTakeaways && data.keyTakeaways) {
    lines.push("keyTakeaways:");
    for (const kt of data.keyTakeaways) {
      lines.push(`  - "${(kt || "").replace(/"/g, '\\"')}"`);
    }
  }

  lines.push("---");
  return lines.join("\n");
}

async function enhanceFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);

  // Skip if already has FAQ and Key Takeaways
  if (frontmatter.faq && frontmatter.faq.length > 0 && frontmatter.keyTakeaways && frontmatter.keyTakeaways.length > 0) {
    return "skipped";
  }

  const title = frontmatter.title || "";
  const description = frontmatter.description || "";
  const language = frontmatter.language || "en";
  const isUrdu = language === "ur";

  const result = await callGemini(title, description, content, isUrdu);
  if (result === "quota") return "quota";
  if (!result) return "failed";

  const newFrontmatter = rebuildFrontmatter(result, frontmatter);
  fs.writeFileSync(filePath, `${newFrontmatter}\n${stripExternalImages(content)}`, "utf-8");
  return "enhanced";
}

async function main() {
  console.log("========================================");
  console.log("  TechVeb Blog Enhancer (SEO/AEO/GEO)");
  console.log(`  ${new Date().toISOString()}`);
  console.log("========================================\n");

  let totalFiles = 0;
  let enhanced = 0;
  let skipped = 0;
  let failed = 0;
  let quotaExhausted = false;

  for (const dir of CONTENT_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const category = path.basename(dir);
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));
    console.log(`[${category}] ${files.length} files`);

    for (const file of files) {
      if (enhanced >= MAX_FILES_PER_RUN) {
        console.log(`\n[LIMIT] Reached ${MAX_FILES_PER_RUN} enhanced files. Stopping.`);
        break;
      }
      if (quotaExhausted) {
        console.log(`\n[QUOTA] Gemini quota exhausted. Skipping remaining files.`);
        break;
      }

      const filePath = path.join(dir, file);
      totalFiles++;
      process.stdout.write(`  ${file.substring(0, 50)}...`);

      const result = await enhanceFile(filePath);
      if (result === "enhanced") { enhanced++; console.log(" ENHANCED"); }
      else if (result === "skipped") { skipped++; console.log(" SKIP (has FAQ+KT)"); }
      else if (result === "quota") { quotaExhausted = true; failed++; console.log(" FAILED (quota)"); }
      else { failed++; console.log(" FAILED"); }

      if (!quotaExhausted) await sleep(DELAY_MS);
    }

    if (enhanced >= MAX_FILES_PER_RUN || quotaExhausted) break;
  }

  console.log(`\n========================================`);
  console.log(`  Total: ${totalFiles} files`);
  console.log(`  Enhanced: ${enhanced}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`========================================`);
}

main();
