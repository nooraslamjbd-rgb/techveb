import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { CONFIG } from "./config.mjs";

cloudinary.config();

let imagePool = [];

function loadImagePool() {
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG.WIKIMEDIA_POOL, "utf-8"));
    imagePool = raw.images || [];
  } catch { imagePool = []; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadImage(url, timeoutMs = 15000, referer) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "image/*,*/*",
  };
  if (referer) headers["Referer"] = referer;
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers,
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

function expandVariants(url) {
  const variants = [url];
  const m = url.match(/\/(\d{2,4})x(\d{2,4})\//);
  if (m) {
    for (const size of ["1200x630", "1600x900", "800x450", "960x540", "720x405"]) {
      variants.push(url.replace(m[0], "/" + size + "/"));
    }
  }
  return [...new Set(variants)];
}

export async function processArticleImage(article) {
  const slug = article.enhanced?.slug || article.slug;
  const publicId = `techveb/news/${slug}`;
  const referer = article.link || undefined;

  const candidates = [];
  if (article.imageUrl) candidates.push({ url: article.imageUrl, src: "article" });
  for (const img of (article.articleImages || []).slice(0, 6)) {
    if (img?.src && img.src !== article.imageUrl) candidates.push({ url: img.src, src: "page" });
  }
  if (article.rssImage && article.rssImage !== article.imageUrl) candidates.push({ url: article.rssImage, src: "rss" });

  let imageBuffer = null;
  let usedSrc = null;

  for (const cand of candidates) {
    const urls = expandVariants(cand.url);
    for (const url of urls) {
      imageBuffer = await downloadImage(url, 15000, referer);
      if (imageBuffer) { usedSrc = cand.src; break; }
    }
    if (imageBuffer) break;
  }

  if (!imageBuffer) {
    const poolUrl = getPoolImage(article);
    if (poolUrl) {
      imageBuffer = await downloadImage(poolUrl, 15000);
      if (imageBuffer) usedSrc = "pool";
    }
  }

  if (!imageBuffer) {
    console.log("    No source image available (all candidates + pool failed)");
    return null;
  }

  try {
    const resized = await sharp(imageBuffer)
      .resize(1200, 630, { fit: "cover", position: "center" })
      .toBuffer();

    let finalBuffer;

    if (fs.existsSync(CONFIG.LOGO_PATH)) {
      const logoRaw = await sharp(CONFIG.LOGO_PATH)
        .resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .ensureAlpha()
        .toBuffer();

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

      finalBuffer = await sharp(resized)
        .composite([{
          input: logoTransparent,
          top: 630 - 80 - 15,
          left: 1200 - 80 - 15,
        }])
        .webp({ quality: 85 })
        .toBuffer();
    } else {
      finalBuffer = await sharp(resized)
        .webp({ quality: 85 })
        .toBuffer();
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: undefined,
          format: "webp",
          overwrite: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(finalBuffer);
    });

    return result.secure_url;
  } catch (err) {
    console.error(`    Image processing failed: ${err.message}`);
    return null;
  }
}

export async function processAllImages(articles) {
  console.log(`[IMAGES] Processing images for ${articles.length} articles...`);

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
