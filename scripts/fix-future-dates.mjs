import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIRS = ["blog", "reviews", "ai-tools", "news"];
const ROOT = path.join(import.meta.dirname, "..", "src", "content");

// Set every future-dated article's date to this value.
const TARGET = process.env.TARGET_DATE || "2026-08-29";
const today = new Date();
const max = new Date(`${TARGET}T23:59:59Z`).getTime();

if (new Date(TARGET).getTime() > Date.now()) {
  console.error(`Refusing to use a future TARGET_DATE (${TARGET}).`);
  process.exit(1);
}

let fixed = 0;
let unchanged = 0;

for (const dir of CONTENT_DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;

  for (const file of fs.readdirSync(abs).filter((f) => f.endsWith(".mdx"))) {
    const filePath = path.join(abs, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!data.date) continue;

    const t = new Date(data.date).getTime();
    if (isNaN(t) || t <= max) {
      unchanged++;
      continue;
    }

    // Rebuild frontmatter with the corrected date, preserving everything else.
    const lines = ["---"];
    for (const [key, value] of Object.entries(data)) {
      if (key === "date") {
        lines.push(`date: "${TARGET}"`);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          lines.push(`${key}: []`);
        } else if (typeof value[0] === "object") {
          lines.push(`${key}:`);
          for (const item of value) {
            const entries = Object.entries(item)
              .map(([k, v]) => `${k}: "${String(v).replace(/"/g, '\\"')}"`)
              .join(", ");
            lines.push(`  - { ${entries} }`);
          }
        } else {
          lines.push(`${key}: [${value.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(", ")}]`);
        }
      } else if (typeof value === "boolean") {
        lines.push(`${key}: ${value}`);
      } else if (typeof value === "number") {
        lines.push(`${key}: ${value}`);
      } else {
        lines.push(`${key}: "${String(value || "").replace(/"/g, '\\"')}"`);
      }
    }
    lines.push("---");

    fs.writeFileSync(filePath, `${lines.join("\n")}\n${content}`, "utf-8");
    console.log(`FIXED ${dir}/${file}  (${data.date} -> ${TARGET})`);
    fixed++;
  }
}

console.log(`\nDates corrected: ${fixed} (${unchanged} left unchanged)`);
