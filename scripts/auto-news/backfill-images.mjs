import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { CONFIG } from "./config.mjs";

cloudinary.config();

const CONTENT_DIR = "src/content/news";

function pickLargestFromSrcset(srcset) {
  if (!srcset) return null;
  const candidates = srcset.split(",").map((part) => {
    const m = part.trim().match(/^(\S+)(?:\s+(\d+)w)?/);
    if (!m) return null;
    return { url: m[1], width: m[2] ? parseInt(m[2], 10) : 0 };
  }).filter(Boolean);
  candidates.sort((a, b) => b.width - a.width);
  return candidates[0] ? candidates[0].url : null;
}

async function extractImageCandidates(html, baseUrl) {
  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();
  const record = (raw, score) => {
    let src = raw;
    if (!src || seen.has(src)) return;
    if (src.startsWith("data:")) return;
    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) { try { src = new URL(src, baseUrl).href; } catch { return; } }
    else if (!src.startsWith("http")) { try { src = new URL(src, baseUrl).href; } catch { return; } }
    if (/logo|icon|avatar|badge|sprite|pixel|tracking|spacer|blank|placeholder|sprite/i.test(src)) return;
    if (/\.(svg|gif|ico)$/i.test(src)) return;
    if (/\/p\d+x\d+[.\/]|placeholder|preview-default|no-image|no_image|default-thumb|fallback|thumb_placeholder|p\dx\d\.(jpg|jpeg|png|webp)/i.test(src)) return;
    src = src.split("?")[0];
    seen.add(src);
    images.push({ src, score });
  };

  $("img").each((_, el) => {
    const el$ = $(el);
    const srcset = pickLargestFromSrcset(el$.attr("srcset")) || pickLargestFromSrcset(el$.attr("data-srcset"));
    const lazySrc = el$.attr("data-src") || el$.attr("data-lazy-src") || el$.attr("data-original") || el$.attr("data-image") || el$.attr("data-img") || "";
    const src = lazySrc || srcset || el$.attr("src") || "";
    if (!src) return;
    if (lazySrc) {
      record(src, 999999);
      return;
    }
    const w = parseInt(el$.attr("width") || "0", 10);
    const h = parseInt(el$.attr("height") || "0", 10);
    if (w > 0 && w < 200) return;
    if (h > 0 && h < 200) return;
    record(src, w * h || (srcset ? 999999 : 400 * 300));
  });

  $("meta[property='og:image'], meta[property='og:image:secure_url']").each((_, el) => {
    const c = $(el).attr("content");
    if (c) record(c, 999999);
  });

  images.sort((a, b) => b.score - a.score);
  return images;
}

async function downloadImage(url, timeoutMs = 15000, referer) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "image/*,*/*",
  };
  if (referer) headers["Referer"] = referer;
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers, redirect: "follow" });
    clearTimeout(t);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("image") && !ct.includes("octet")) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { clearTimeout(t); return null; }
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

async function processAndUpload(slug, buffer, referer) {
  const publicId = `techveb/news/${slug}`;
  const resized = await sharp(buffer).resize(1200, 630, { fit: "cover", position: "center" }).toBuffer();
  let finalBuffer;
  if (fs.existsSync(CONFIG.LOGO_PATH)) {
    const logoRaw = await sharp(CONFIG.LOGO_PATH)
      .resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha().toBuffer();
    const logoData = await sharp(logoRaw).raw().toBuffer({ resolveWithObject: true });
    const pixels = logoData.data;
    for (let i = 3; i < pixels.length; i += 4) pixels[i] = Math.round(pixels[i] * 0.15);
    const logoTransparent = await sharp(pixels, {
      raw: { width: logoData.info.width, height: logoData.info.height, channels: 4 },
    }).png().toBuffer();
    finalBuffer = await sharp(resized)
      .composite([{ input: logoTransparent, top: 630 - 80 - 15, left: 1200 - 80 - 15 }])
      .webp({ quality: 85 }).toBuffer();
  } else {
    finalBuffer = await sharp(resized).webp({ quality: 85 }).toBuffer();
  }
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, folder: undefined, format: "webp", overwrite: true, unique_filename: false },
      (error, result) => error ? reject(error) : resolve(result)
    );
    stream.end(finalBuffer);
  });
  return result.secure_url;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));
const noImg = [];
for (const f of files) {
  const c = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
  if (!/^image:/m.test(c)) noImg.push({ file: f, content: c, slug: f.replace(".mdx", "") });
}
console.log(`No-image articles: ${noImg.length}`);

for (let i = 0; i < noImg.length; i++) {
  const { file, content, slug } = noImg[i];
  const sourceLink = (content.match(/sourceLink:\s*"([^"]+)"/) || [])[1] || "";
  console.log(`\n[${i + 1}/${noImg.length}] ${slug}`);
  console.log(`  source: ${sourceLink}`);
  if (!sourceLink) { console.log("  no sourceLink, skip"); continue; }

  const html = await fetchPage(sourceLink);
  if (!html) { console.log("  page fetch failed"); await sleep(500); continue; }
  const cands = await extractImageCandidates(html, sourceLink);
  console.log(`  ${cands.length} candidates`);

  let buffer = null;
  let usedUrl = null;
  for (const cand of cands.slice(0, 8)) {
    const variants = [cand.src];
    const m = cand.src.match(/\/(\d{2,4})x(\d{2,4})\//);
    if (m) {
      for (const size of ["1200x630", "1600x900", "800x450", "960x540", "720x405"]) {
        variants.push(cand.src.replace(m[0], "/" + size + "/"));
      }
    }
    for (const v of [...new Set(variants)]) {
      buffer = await downloadImage(v, 15000, sourceLink);
      if (buffer) { usedUrl = v; break; }
    }
    if (buffer) break;
  }
  if (!buffer) { console.log("  all candidates failed"); await sleep(500); continue; }
  console.log(`  got image: ${usedUrl}`);

  try {
    const url = await processAndUpload(slug, buffer, sourceLink);
    const newContent = content.replace(/^(language: ".*")$/m, `$1\nimage: "${url}"`);
    fs.writeFileSync(path.join(CONTENT_DIR, file), newContent, "utf-8");
    console.log(`  UPLOADED + frontmatter updated: ${url}`);
  } catch (e) {
    console.log(`  upload failed: ${e.message}`);
  }
  await sleep(400);
}

console.log("\n[BACKFILL] done.");