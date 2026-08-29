/**
 * generate-local-heroes.js
 * Replaces non-relatable/unreliable external hero images with local,
 * topic-relevant WebP cards (category-colored gradient + title text).
 *
 * Scans blog/reviews/ai-tools/news. For every article whose `image:` is an
 * external http(s) URL, OR points to a local file that does not exist, it:
 *   1. Renders an SVG card (category gradient, decorative shapes, category
 *      chip, word-wrapped title)
 *   2. Rasterizes to WebP (1200x630) with sharp
 *   3. Saves under public/ and rewrites the article frontmatter `image:`
 *
 * Run: node scripts/generate-local-heroes.js
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "src", "content");
const PUBLIC = path.join(ROOT, "public");

const DIRS = ["blog", "reviews", "ai-tools", "news"];
const W = 1200;
const H = 630;

// Category -> [from, to] hex colors (matches blur-placeholder palette, extended)
const CATEGORY_COLORS = {
  ai: ["3b82f6", "8b5cf6"],
  "tech-news": ["10b981", "059669"],
  "product-reviews": ["f59e0b", "d97706"],
  cloud: ["0ea5e9", "0284c7"],
  cybersecurity: ["ef4444", "dc2626"],
  tutorials: ["8b5cf6", "7c3aed"],
  gaming: ["ec4899", "db2777"],
  "emerging-tech": ["06b6d4", "0891b2"],
  blog: ["64748b", "475569"],
  coding: ["10b981", "059669"],
  business: ["0ea5e9", "6366f1"],
  sports: ["22c55e", "16a34a"],
  mobiles: ["6366f1", "8b5cf6"],
  entertainment: ["f43f5e", "d946ef"],
  education: ["f59e0b", "f97316"],
};

function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function wrapText(title, maxCharsPerLine) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxCharsPerLine) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSvg(title, category) {
  const [c1, c2] = CATEGORY_COLORS[category] || CATEGORY_COLORS.blog;
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);

  // Decorative translucent circles
  const circles = [
    `<circle cx="980" cy="80" r="240" fill="#ffffff" opacity="0.08"/>`,
    `<circle cx="150" cy="560" r="200" fill="#000000" opacity="0.10"/>`,
    `<circle cx="1120" cy="520" r="120" fill="#ffffff" opacity="0.07"/>`,
    `<circle cx="60" cy="120" r="90" fill="#ffffff" opacity="0.06"/>`,
  ].join("\n");

  // Category chip
  const label = (category || "TechVeb").replace(/-/g, " ").toUpperCase();
  const chipW = 56 + label.length * 15;
  const chip = `
    <rect x="70" y="470" rx="22" ry="22" width="${chipW}" height="44" fill="#ffffff" opacity="0.15"/>
    <text x="94" y="499" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22"
      letter-spacing="1" fill="#ffffff">${escapeXml(label)}</text>`;

  // Word-wrapped title
  const maxChars = 52;
  let lines = wrapText(title, maxChars);
  if (lines.length > 5) {
    lines = lines.slice(0, 5);
  }
  const lineHeight = 58;
  const startY = 120 + (lines.length - 1) * (lineHeight / 2);
  const tspans = lines
    .map(
      (ln, i) =>
        `<tspan x="70" y="${startY + i * lineHeight}" dx="0">${escapeXml(ln)}</tspan>`
    )
    .join("\n");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgb(${rgb1.r},${rgb1.g},${rgb1.b})"/>
      <stop offset="100%" stop-color="rgb(${rgb2.r},${rgb2.g},${rgb2.b})"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${circles}
  <text font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="60"
    fill="#ffffff">${tspans}</text>
  ${chip}
</svg>`;
  return svg;
}

function* iterArticles() {
  for (const dir of DIRS) {
    const dirPath = path.join(CONTENT, dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".mdx")) continue;
      yield { dir, file, filePath: path.join(dirPath, file) };
    }
  }
}

function needsLocal(image) {
  if (!image) return false;
  if (image.startsWith("http")) return true; // external -> replace
  if (image.startsWith("/")) {
    const localPath = path.join(PUBLIC, image.replace(/^\/+/, ""));
    if (!fs.existsSync(localPath)) return true; // referenced but missing
  }
  return false;
}

async function main() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const { dir, file, filePath } of iterArticles()) {
    if (generated >= limit) break;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!needsLocal(data.image)) {
      skipped++;
      continue;
    }

    const slug = file.replace(/\.mdx$/, "");
    const category = data.category || "blog";
    const title = data.title || slug.replace(/-/g, " ");

    // Output dir per original convention
    const outDir = dir === "news" ? path.join(PUBLIC, "news") : path.join(PUBLIC, "heroes", dir);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${slug}.webp`);
    const publicPath = dir === "news" ? `/news/${slug}.webp` : `/heroes/${dir}/${slug}.webp`;

    try {
      const svg = buildSvg(title, category);
      await sharp(Buffer.from(svg))
        .webp({ quality: 82 })
        .toFile(outFile);

      // Rewrite frontmatter image:
      data.image = publicPath;
      const updated = matter.stringify(content, data, { lineWidth: -1 });
      fs.writeFileSync(filePath, updated, "utf-8");

      generated++;
      console.log(`[OK] ${dir}/${file} -> ${publicPath}`);
    } catch (e) {
      errors++;
      console.error(`[ERR] ${dir}/${file}: ${e.message}`);
    }
  }

  console.log("\n==========================================");
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped (already local): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log("==========================================");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
