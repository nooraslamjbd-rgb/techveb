import fs from "fs";
import path from "path";
import { execSync } from "node:child_process";
import { SLUG_MAP } from "./slug-map.ts";

const NEWS_DIR = path.join(process.cwd(), "src", "content", "news");

function log(msg) {
  console.log(msg);
}

const existing = new Set(
  fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".mdx")).map((f) => path.basename(f, ".mdx"))
);

const errors = [];
const legitNumeric = new Set(Object.keys(SLUG_MAP));

for (const oldSlug of Object.keys(SLUG_MAP)) {
  if (!fs.existsSync(path.join(NEWS_DIR, `${oldSlug}.mdx`))) {
    errors.push(`MISSING old file: ${oldSlug}.mdx`);
  }
}

const currentNumeric = new Set(
  fs.readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".mdx") && /^\d+(-\d+)*$/.test(path.basename(f, ".mdx")))
    .map((f) => path.basename(f, ".mdx"))
);

for (const slug of currentNumeric) {
  if (!legitNumeric.has(slug)) errors.push(`UNMAPPED numeric file remains: ${slug}.mdx`);
}

for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(newSlug)) {
    errors.push(`BAD new slug format: ${oldSlug} -> ${newSlug}`);
  }
  if (oldSlug === newSlug) {
    errors.push(`NO-OP: ${oldSlug} -> ${newSlug}`);
  }
}

for (const newSlug of Object.values(SLUG_MAP)) {
  if (existing.has(newSlug)) {
    errors.push(`COLLISION with existing file: ${newSlug}.mdx`);
  }
}

if (errors.length > 0) {
  log("Refusing to apply. Errors:");
  for (const e of errors) log(`  - ${e}`);
  process.exit(1);
}

let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldFile = path.join(NEWS_DIR, `${oldSlug}.mdx`);
  const newFile = path.join(NEWS_DIR, `${newSlug}.mdx`);
  execSync(`git mv "${oldFile}" "${newFile}"`, { stdio: "pipe" });
  log(`  git mv ${oldSlug}.mdx -> ${newSlug}.mdx`);
  renamed++;
}

const remains = fs.readdirSync(NEWS_DIR)
  .filter((f) => f.endsWith(".mdx") && /^\d+(-\d+)*$/.test(path.basename(f, ".mdx")));
log(`Done. ${renamed} files renamed. Remaining numeric-slug files: ${remains.length}`);
if (remains.length > 0) log(`  UNMAPPED: ${remains.join(", ")}`);