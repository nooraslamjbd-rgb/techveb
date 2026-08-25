#!/usr/bin/env node
/**
 * replace-images-v2.js
 * Assigns unique images from the .wikimedia-images.json pool to all articles.
 * Each article gets one unique image — no two articles share the same image.
 *
 * Usage: node scripts/replace-images-v2.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CONTENT_DIR = path.join(__dirname, "..", "src", "content");
const POOL_FILE = path.join(__dirname, ".wikimedia-images.json");

// ─── Topic mapping: article category → pool topic ───────────────────
const CATEGORY_TO_TOPIC = {
  cybersecurity: "cybersecurity",
  "tech-news": "tech-news",
  ai: "AI",
  "product-reviews": "laptops",
  cloud: "cloud",
  gaming: "gaming",
  programming: "programming",
  "emerging-tech": "robotics",
  privacy: "privacy",
  devops: "DevOps",
  blockchain: "blockchain",
  "space-tech": "space-tech",
  cryptocurrency: "blockchain",
  hardware: "hardware",
};

// ─── Title → topic keywords (for smarter matching) ──────────────────
const TITLE_KEYWORDS = {
  cybersecurity: ["security", "firewall", "phishing", "malware", "encrypt", "vpn", "cyber", "hack", "vulnerability", "ransomware", "zero-day", "password", "biometric", "authentication", "breach", "attack", "defend", "protect", "secure", "privacy"],
  ai: ["ai", "artificial intelligence", "machine learning", "neural", "deep learning", "chatgpt", "claude", "gemini", "llm", "gpt", "openai", "anthropic", "model", "training", "inference", "nlp", "computer vision", "automation"],
  cloud: ["cloud", "aws", "azure", "gcp", "serverless", "lambda", "s3", "docker", "kubernetes", "container", "microservice", "devops", "ci/cd", "terraform", "ansible", "helm", "istio", "prometheus", "grafana"],
  gaming: ["game", "gaming", "esports", "controller", "console", "playstation", "xbox", "nintendo", "steam", "vr", "headset", "monitor", "keyboard", "mouse", "pc build", "indie", "rpg", "fps", "mmo", "streaming"],
  programming: ["code", "program", "developer", "python", "javascript", "typescript", "rust", "go", "java", "react", "nextjs", "svelte", "vue", "angular", "node", "deno", "bun", "git", "github", "api", "graphql", "rest", "sql", "database"],
  hardware: ["processor", "cpu", "gpu", "nvidia", "amd", "intel", "chip", "ram", "ssd", "motherboard", "graphics card", "server", "quantum", "semiconductor", "fab", "foundry", "tsmc"],
  privacy: ["privacy", "surveillance", "data protection", "gdpr", "anonymous", "tor", "proxy", "tracking", "cookies", "consent"],
  blockchain: ["blockchain", "bitcoin", "ethereum", "crypto", "defi", "nft", "web3", "token", "mining", "wallet", "smart contract", "dao"],
  "space-tech": ["space", "nasa", "spacex", "rocket", "satellite", "mars", "moon", "orbit", "telescope", "starlink", "artemis", "iss", "hubble", "james webb"],
  "tech-news": ["apple", "google", "microsoft", "amazon", "meta", "tesla", "samsung", "huawei", "startup", "layoff", "acquisition", "ipo", "regulation", "antitrust", "eu", "china", "india"],
  laptops: ["laptop", "macbook", "thinkpad", "surface", "chromebook", "notebook", "ultrabook", "review", "best", "top", "compare", "vs", "buying guide", "headphone", "earbuds", "monitor", "keyboard", "mouse", "webcam", "printer", "speaker", "router"],
  smartphones: ["phone", "iphone", "galaxy", "pixel", "android", "ios", "mobile", "smartphone", "foldable", "5g"],
  iot: ["iot", "smart home", "sensor", "arduino", "raspberry pi", "embedded", "automation", "zigbee", "matter", "alexa", "homekit"],
  robotics: ["robot", "humanoid", "autonomous", "drone", "self-driving", "lidar", "3d print", "biotech", "fusion", "quantum", "nanotech", "brain-computer"],
};

function hashStr(str) {
  return Math.abs(crypto.createHash("md5").update(str).digest().readInt32LE(0));
}

// ─── Parse MDX frontmatter ──────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };
  const fm = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const kv = line.match(/^([\w-]+):\s*"?(.*?)"?\s*$/);
    if (kv) {
      let val = kv[2].trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        try { val = JSON.parse(val); } catch { /* keep string */ }
      }
      fm[kv[1]] = val;
    }
  }
  return { frontmatter: fm, body: content.slice(match[0].length + 1) };
}

function replaceFrontmatterField(content, key, value) {
  const cleaned = String(value).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  const escaped = `"${cleaned.replace(/"/g, '\\"')}"`;
  const regex = new RegExp(`^${key}:.*$`, "m");
  if (regex.test(content)) {
    return content.replace(regex, `${key}: ${escaped}`);
  }
  return content.replace(/^---\n/, `---\n${key}: ${escaped}\n`);
}

// ─── Find best image for article ────────────────────────────────────
function findBestImage(title, category, pool, usedUrls) {
  const titleLower = title.toLowerCase();
  const cat = category || "tech-news";

  // Determine primary topic from category
  const primaryTopic = CATEGORY_TO_TOPIC[cat] || "tech-news";

  // Check title keywords to find a more specific topic
  let bestTopic = primaryTopic;
  let bestScore = 0;
  for (const [topic, keywords] of Object.entries(TITLE_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (titleLower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  // Find available images for the best topic
  const topicImages = pool.filter((img) => img.topic === bestTopic && !usedUrls.has(img.url));
  if (topicImages.length > 0) {
    const idx = hashStr(title) % topicImages.length;
    return topicImages[idx];
  }

  // Fallback: try primary topic
  const primaryImages = pool.filter((img) => img.topic === primaryTopic && !usedUrls.has(img.url));
  if (primaryImages.length > 0) {
    const idx = hashStr(title) % primaryImages.length;
    return primaryImages[idx];
  }

  // Fallback: any unused image
  const anyUnused = pool.filter((img) => !usedUrls.has(img.url));
  if (anyUnused.length > 0) {
    const idx = hashStr(title) % anyUnused.length;
    return anyUnused[idx];
  }

  // Last resort: reuse any image from pool (better than no image)
  const idx = hashStr(title) % pool.length;
  return pool[idx];
}

// ─── Main ───────────────────────────────────────────────────────────
function main() {
  console.log("=== replace-images-v2: Unique Image Assignment ===\n");

  // Load pool
  if (!fs.existsSync(POOL_FILE)) {
    console.error("Pool file not found:", POOL_FILE);
    process.exit(1);
  }
  const pool = JSON.parse(fs.readFileSync(POOL_FILE, "utf8")).images;
  console.log(`Image pool: ${pool.length} unique images\n`);

  // Collect all MDX files
  const mdxFiles = [];
  for (const sub of ["blog", "reviews", "ai-tools"]) {
    const dir = path.join(CONTENT_DIR, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".mdx")) {
        mdxFiles.push({ filePath: path.join(dir, f), sub, name: f });
      }
    }
  }

  console.log(`Found ${mdxFiles.length} MDX articles\n`);

  let replaced = 0;
  let skipped = 0;
  let errors = 0;
  const usedUrls = new Set();
  const topicCounts = {};

  for (let i = 0; i < mdxFiles.length; i++) {
    const { filePath, sub, name } = mdxFiles[i];
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = parseFrontmatter(content);

    const title = frontmatter.title || name.replace(".mdx", "");
    const category = frontmatter.category || "tech-news";

    process.stdout.write(`[${i + 1}/${mdxFiles.length}] ${title.substring(0, 55)}... `);

    const image = findBestImage(title, category, pool, usedUrls);
    if (!image) {
      console.log("NO IMAGE LEFT");
      errors++;
      continue;
    }

    usedUrls.add(image.url);
    const topic = image.topic;
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;

    // Update MDX content
    let updated = content;
    updated = replaceFrontmatterField(updated, "image", image.url);
    updated = replaceFrontmatterField(updated, "imageCredit", image.credit);
    updated = replaceFrontmatterField(updated, "imageCreditUrl", image.creditUrl);
    fs.writeFileSync(filePath, updated, "utf8");

    replaced++;
    console.log(`OK [${topic}]`);
  }

  console.log(`\n=== IMAGE REPLACEMENT v2 COMPLETE ===`);
  console.log(`Replaced: ${replaced}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Unique images used: ${usedUrls.size}`);
  console.log(`\nTopic distribution:`);
  for (const [topic, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${topic}: ${count}`);
  }
}

main();
