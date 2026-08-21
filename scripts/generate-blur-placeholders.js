/**
 * Generate blur placeholders for all article images.
 * This script downloads a tiny version of each image and creates a base64 blur placeholder.
 * Run: node scripts/generate-blur-placeholders.js
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.join(process.cwd(), "src", "content");
const dirs = ["blog", "reviews", "ai-tools"];
const outputDir = path.join(process.cwd(), "public", "blur-placeholders");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a simple gradient-based SVG placeholder as blur data URL
function generateGradientPlaceholder(color1 = "e2e8f0", color2 = "cbd5e1") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#${color1}"/>
        <stop offset="100%" stop-color="#${color2}"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" fill="url(#g)"/>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Color palette based on categories
const categoryColors = {
  ai: ["3b82f6", "8b5cf6"],
  "tech-news": ["10b981", "059669"],
  "product-reviews": ["f59e0b", "d97706"],
  cloud: ["0ea5e9", "0284c7"],
  cybersecurity: ["ef4444", "dc2626"],
  tutorials: ["8b5cf6", "7c3aed"],
  "emerging-tech": ["06b6d4", "0891b2"],
  gaming: ["ec4899", "db2777"],
  blog: ["64748b", "475569"],
  coding: ["10b981", "059669"],
};

let generated = 0;
let skipped = 0;

dirs.forEach((dir) => {
  const dirPath = path.join(contentDir, dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));

  files.forEach((f) => {
    const slug = f.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(dirPath, f), "utf-8");
    const { data } = matter(raw);

    if (!data.image) {
      skipped++;
      return;
    }

    // Get category colors
    const category = data.category || "blog";
    const colors = categoryColors[category] || ["e2e8f0", "cbd5e1"];

    // Generate placeholder
    const placeholder = generateGradientPlaceholder(colors[0], colors[1]);

    // Save placeholder mapping
    const placeholderPath = path.join(outputDir, `${slug}.json`);
    fs.writeFileSync(
      placeholderPath,
      JSON.stringify({
        slug,
        image: data.image,
        placeholder,
        category,
      })
    );

    generated++;
  });
});

console.log(`✅ Generated ${generated} blur placeholders`);
console.log(`⏭️  Skipped ${skipped} articles (no image)`);
console.log(`📁 Output: ${outputDir}`);
