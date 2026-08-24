import fs from "fs";
import path from "path";
import sharp from "sharp";
import { CONFIG } from "./config.mjs";

let imagePool = [];

function loadImagePool() {
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG.WIKIMEDIA_POOL, "utf-8"));
    imagePool = raw.images || [];
  } catch { imagePool = []; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadImage(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/*,*/*",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("image") && !ct.includes("octet")) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { clearTimeout(t); return null; }
}

function getPoolImage(article) {
  if (imagePool.length === 0) loadImagePool();
  const text = `${article.title} ${article.description}`.toLowerCase();
  let imgs = imagePool.filter(i => i.topic === article.category);
  if (imgs.length === 0) imgs = imagePool;
  if (imgs.length === 0) return null;
  const img = imgs[Math.floor(Math.random() * imgs.length)];
  return img.url;
}

export async function processArticleImage(article) {
  const slug = article.enhanced?.slug || article.slug;
  const outDir = CONFIG.NEWS_IMAGE_DIR;
  const outPath = path.join(outDir, `${slug}.webp`);

  if (fs.existsSync(outPath)) return `/news/${slug}.webp`;

  let imageBuffer = null;

  // Try original article image
  if (article.imageUrl) {
    imageBuffer = await downloadImage(article.imageUrl);
  }

  // Fallback to Wikimedia pool
  if (!imageBuffer) {
    const poolUrl = getPoolImage(article);
    if (poolUrl) {
      imageBuffer = await downloadImage(poolUrl);
    }
  }

  if (!imageBuffer) {
    console.log("    No image available");
    return null;
  }

  try {
    // Resize to 1200x630 (cover)
    const resized = await sharp(imageBuffer)
      .resize(1200, 630, { fit: "cover", position: "center" })
      .toBuffer();

    // Check if logo exists
    if (fs.existsSync(CONFIG.LOGO_PATH)) {
      // Load and resize logo
      const logoRaw = await sharp(CONFIG.LOGO_PATH)
        .resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .ensureAlpha()
        .toBuffer();

      // Make logo semi-transparent (15% opacity)
      const logoData = await sharp(logoRaw)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const pixels = logoData.data;
      for (let i = 3; i < pixels.length; i += 4) {
        pixels[i] = Math.round(pixels[i] * 0.15);
      }

      const logoTransparent = await sharp(pixels, {
        raw: { width: logoData.info.width, height: logoData.info.height, channels: 4 },
      }).png().toBuffer();

      // Composite logo at bottom-right
      const final = await sharp(resized)
        .composite([{
          input: logoTransparent,
          top: 630 - 80 - 15,
          left: 1200 - 80 - 15,
        }])
        .webp({ quality: 85 })
        .toFile(outPath);
    } else {
      // No logo, just save resized image
      await sharp(resized)
        .webp({ quality: 85 })
        .toFile(outPath);
    }

    return `/news/${slug}.webp`;
  } catch (err) {
    console.error(`    Image processing failed: ${err.message}`);
    return null;
  }
}

export async function processAllImages(articles) {
  console.log(`[IMAGES] Processing images for ${articles.length} articles...`);
  fs.mkdirSync(CONFIG.NEWS_IMAGE_DIR, { recursive: true });

  const results = {};
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    process.stdout.write(`  [${i + 1}/${articles.length}] ${article.slug}...`);

    const imagePath = await processArticleImage(article);
    results[article.slug] = imagePath;
    console.log(imagePath ? ` OK` : " SKIP");

    if (i < articles.length - 1) await sleep(200);
  }

  const withImages = Object.values(results).filter(Boolean).length;
  console.log(`[IMAGES] Done. ${withImages}/${articles.length} images processed.`);
  return results;
}
