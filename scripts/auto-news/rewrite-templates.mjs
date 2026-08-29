import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { CONFIG } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONTENT_DIRS = [
  { dir: path.join(__dirname, "..", "..", "src", "content", "blog"), category: "blog" },
  { dir: path.join(__dirname, "..", "..", "src", "content", "reviews"), category: "reviews" },
  { dir: path.join(__dirname, "..", "..", "src", "content", "ai-tools"), category: "ai-tools" },
];

const TEMPLATE_PHRASES = [
  "In today's rapidly evolving digital landscape",
  "According to recent industry reports, the adoption of",
  "Research from Gartner indicates that by 2026",
  "has become essential for professionals",
];

const PROGRESS_FILE = path.join(__dirname, ".rewrite-progress.json");
const DELAY_MS = 2500;
const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    }
  } catch {}
  return { completed: [], failed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf-8");
}

function isTemplateArticle(content) {
  return TEMPLATE_PHRASES.some(p => content.includes(p));
}

function buildRewritePrompt(title, description, content, category) {
  return `You are an expert technology writer for TechVeb (techveb.com). Rewrite this article completely with UNIQUE, ORIGINAL content.

CRITICAL RULES:
- DO NOT use these template phrases: "In today's rapidly evolving digital landscape", "According to recent industry reports", "Research from Gartner indicates"
- Write with a UNIQUE opening sentence that grabs attention
- Use REAL, specific facts and data (not generic "65% growth" numbers)
- Vary sentence structure — mix short punchy sentences with longer explanatory ones
- Include practical examples, use cases, or anecdotes where possible
- Write in an authoritative but accessible tone
- The article must be at least 300 words of body content
- Keep the same topic and angle as the original
- Do NOT include FAQ or Key Takeaways sections (those are added separately)
- Return ONLY the article body in clean Markdown (no frontmatter, no YAML)

ARTICLE TITLE: ${title}
CATEGORY: ${category}
ORIGINAL DESCRIPTION: ${description}

ORIGINAL CONTENT (rewrite completely):
${content.substring(0, 3000)}

Now write a COMPLETE, UNIQUE rewrite of this article. Return ONLY the Markdown body content:`;
}

async function callGroq(prompt, retryCount = 0) {
  try {
    const response = await fetch(CONFIG.GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: CONFIG.GROQ_MODEL,
        messages: [
          { role: "system", content: "You are an expert technology writer. Output clean Markdown only. No frontmatter." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 4096,
        top_p: 0.9,
      }),
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const waitSec = (retryCount + 1) * 15;
      console.log(`\n    Rate limited. Waiting ${waitSec}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await sleep(waitSec * 1000);
      return callGroq(prompt, retryCount + 1);
    }

    if (!response.ok) {
      const err = await response.text();
      console.error(`    Groq error: ${response.status} - ${err.substring(0, 200)}`);
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return text || null;
  } catch (err) {
    console.error(`    Groq call failed: ${err.message}`);
    if (retryCount < MAX_RETRIES) {
      await sleep(5000);
      return callGroq(prompt, retryCount + 1);
    }
    return null;
  }
}

function hasTemplatePhrases(text) {
  return TEMPLATE_PHRASES.filter(p => text.includes(p));
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

async function rewriteArticle(filePath, category) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);

  if (!isTemplateArticle(content)) {
    return "skipped";
  }

  const title = frontmatter.title || "";
  const description = frontmatter.description || "";

  const prompt = buildRewritePrompt(title, description, content, category);
  const newContent = await callGroq(prompt);

  if (!newContent) return "failed";

  if (hasTemplatePhrases(newContent).length > 0) {
    console.log(`    Still has template phrases: ${hasTemplatePhrases(newContent)[0].substring(0, 40)}... Retrying once...`);
    const retryPrompt = `IMPORTANT: The previous output contained template phrases. Rewrite AGAIN avoiding these EXACT phrases: "In today's rapidly evolving digital landscape", "According to recent industry reports", "Research from Gartner indicates". Write a completely fresh article.\n\n${prompt}`;
    const retryContent = await callGroq(retryPrompt);
    if (retryContent && hasTemplatePhrases(retryContent).length === 0) {
      return saveRewrittenFile(filePath, raw, frontmatter, retryContent, description);
    }
    console.log("    Still contains template phrases after retry. Marking failed (will retry on next run).");
    return "failed";
  }

  if (wordCount(newContent) < 100) {
    console.log(`    Too short (${wordCount(newContent)} words). Skipping.`);
    return "failed";
  }

  return saveRewrittenFile(filePath, raw, frontmatter, newContent, description);
}

function saveRewrittenFile(filePath, raw, frontmatter, newBody, oldDescription) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (key === "description") {
      const desc = oldDescription.length > 10 ? oldDescription : (frontmatter.title || "").substring(0, 160);
      lines.push(`description: "${String(desc).replace(/"/g, '\\"')}"`);
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
    } else if (key === "date") {
      const d = new Date(value || Date.now());
      const todayDate = new Date().toISOString().split("T")[0];
      const clamped = !isNaN(d.getTime()) && d.getTime() > Date.now() ? todayDate : (value || todayDate);
      lines.push(`date: "${clamped}"`);
    } else {
      lines.push(`${key}: "${String(value || "").replace(/"/g, '\\"')}"`);
    }
  }
  lines.push("---");

  const cleanedBody = newBody
    .replace(/^```markdown\s*/i, "")
    .replace(/^```\s*/gm, "")
    .replace(/\s*```$/gm, "")
    .replace(/<(?=\d)/g, "&lt;")
    .trim();
  fs.writeFileSync(filePath, `${lines.join("\n")}\n\n${cleanedBody}\n`, "utf-8");
  return "rewritten";
}

async function main() {
  console.log("============================================");
  console.log("  TechVeb Template Article Rewriter (Groq)");
  console.log(`  ${new Date().toISOString()}`);
  console.log("============================================\n");

  const progress = loadProgress();
  let totalFound = 0;
  let rewritten = 0;
  let skipped = 0;
  let failed = 0;
  let alreadyDone = 0;

  for (const { dir, category } of CONTENT_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));
    const templateFiles = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      if (isTemplateArticle(content)) {
        templateFiles.push(file);
      }
    }

    console.log(`[${category}] ${files.length} total, ${templateFiles.length} template articles`);
    totalFound += templateFiles.length;

    for (const file of templateFiles) {
      const relPath = `${category}/${file}`;

      if (progress.completed.includes(relPath)) {
        alreadyDone++;
        continue;
      }

      process.stdout.write(`  ${file.substring(0, 55)}... `);

      const result = await rewriteArticle(path.join(dir, file), category);

      if (result === "rewritten") {
        rewritten++;
        progress.completed.push(relPath);
        console.log("DONE");
      } else if (result === "skipped") {
        skipped++;
        console.log("SKIP (no template)");
      } else {
        failed++;
        progress.failed.push(relPath);
        console.log("FAILED");
      }

      saveProgress(progress);
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n============================================`);
  console.log(`  Template articles found: ${totalFound}`);
  console.log(`  Already done (resume):   ${alreadyDone}`);
  console.log(`  Rewritten:               ${rewritten}`);
  console.log(`  Skipped:                 ${skipped}`);
  console.log(`  Failed:                  ${failed}`);
  console.log(`============================================`);
}

main();
