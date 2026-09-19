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
    if (/logo|icon|avatar|badge|sprite|pixel|tracking|spacer|blank|placeholder|sprite|english-22/i.test(src)) return;
    if (/\.(svg|gif|ico)$/i.test(src)) return;
    if (/\/p\d+x\d+[.\/]|placeholder|preview-default|no-image|no_image|default-thumb|fallback|thumb_placeholder|p\dx\d\.(jpg|jpeg|png|webp)/i.test(src)) return;
    if (src.includes("i.dawn.com/large/2026/05/03205649172e670")) return;
    if (src.includes("i.dawn.com/large/2024/02/16125537351049d")) return;
    src = src.split("?")[0];
    seen.add(src);
    images.push({ src, score });
  };

  $("meta[property='og:image'], meta[property='og:image:secure_url']").each((_, el) => {
    const c = $(el).attr("content");
    if (c) record(c, 10000000);
  });
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
  images.sort((a, b) => b.score - a.score);
  return images;
}

async function downloadImage(url, timeoutMs = 15000, referer) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept": "image/*,*/*" };
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
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

async function phash(buf) {
  try {
    const { data } = await sharp(buf).resize(9, 8, { fit: "fill", position: "center" }).grayscale().raw().toBuffer({ resolveWithObject: true });
    let hash = "";
    for (let y = 0; y < 8; y++) {
      let bits = 0;
      const row = y * 9;
      for (let x = 0; x < 8; x++) { const diff = data[row + x] - data[row + x + 1]; bits = (bits << 1) | (diff >= 0 ? 1 : 0); }
      hash += bits.toString(16).padStart(2, "0");
    }
    return hash;
  } catch { return null; }
}
function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) { const x = parseInt(a[i], 16) ^ parseInt(b[i], 16); d += (x.toString(2).match(/1/g) || []).length; }
  return d;
}

async function processAndUpload(slug, buffer) {
  const publicId = `techveb/news/${slug}`;
  const resized = await sharp(buffer).resize(1200, 630, { fit: "cover", position: "center" }).toBuffer();
  let finalBuffer;
  if (fs.existsSync(CONFIG.LOGO_PATH)) {
    const logoRaw = await sharp(CONFIG.LOGO_PATH).resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().toBuffer();
    const logoData = await sharp(logoRaw).raw().toBuffer({ resolveWithObject: true });
    const pixels = logoData.data;
    for (let i = 3; i < pixels.length; i += 4) pixels[i] = Math.round(pixels[i] * 0.15);
    const logoTransparent = await sharp(pixels, { raw: { width: logoData.info.width, height: logoData.info.height, channels: 4 } }).png().toBuffer();
    finalBuffer = await sharp(resized).composite([{ input: logoTransparent, top: 630 - 80 - 15, left: 1200 - 80 - 15 }]).webp({ quality: 85 }).toBuffer();
  } else {
    finalBuffer = await sharp(resized).webp({ quality: 85 }).toBuffer();
  }
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId, folder: undefined, format: "webp", overwrite: true, unique_filename: false }, (e, r) => e ? reject(e) : resolve(r.secure_url));
    stream.end(finalBuffer);
  });
}

function expandVariants(url) {
  const variants = [url];
  const m = url.match(/\/(\d{2,4})x(\d{2,4})\//);
  if (m) for (const size of ["1200x630", "1600x900", "800x450", "960x540", "720x405"]) variants.push(url.replace(m[0], "/" + size + "/"));
  return [...new Set(variants)];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Main: pick slugs from shared-fingerprint groups + low-entropy, excluding urdupoint/bol (gemini handled separately) ----------
const quality = JSON.parse(fs.readFileSync(process.argv[2] || "C:/Users/MNA/AppData/Local/Temp/opencode/quality.json", "utf-8"));
const bySlug = {};
const groupOf = {};
for (const k of Object.keys(quality)) {
  const e = quality[k];
  bySlug[e.slug] = e;
  const fp = `${e.entropy}|${e.variance}|${e.bytes}`;
  if (!groupOf[fp]) groupOf[fp] = [];
  groupOf[fp].push(e.slug);
}
const sharedFps = new Set(Object.entries(groupOf).filter(([, v]) => v.length > 1).map(([fp]) => fp));

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));
const target = new Set();
for (const f of files) {
  const slug = f.replace(".mdx", "");
  const c = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
  const q = bySlug[slug];
  if (!q) continue;
  const link = (c.match(/sourceLink:\s*"([^"]+)"/) || [])[1] || "";
  const host = link.split("/")[2] || "";
  if (/urdupoint|bolnewsurdu/i.test(host)) continue; // gemini
  const fp = `${q.entropy}|${q.variance}|${q.bytes}`;
  if (sharedFps.has(fp) || q.entropy < 3.0) target.add(slug);
}
console.log("target Dawn/BBC/etc shared+low-entropy articles:", target.size);

let ok = 0, same = 0, failed = 0, skipped = 0;
let i = 0;
const PROGRESS_FILE = path.join(CONTENT_DIR, "..", ".fix-images-progress.json");
let done = new Set();
if (fs.existsSync(PROGRESS_FILE)) {
  try { done = new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"))); } catch {}
}
const pending = [...target].filter(s => !done.has(s));
console.log("already done:", done.size, "pending:", pending.length);
for (const slug of pending) {
  i++;
  const f = path.join(CONTENT_DIR, slug + ".mdx");
  if (!fs.existsSync(f)) { done.add(slug); continue; }
  const content = fs.readFileSync(f, "utf-8");
  const oldImg = (content.match(/^image:\s*"(https?:\/\/[^"]+)"/m) || [])[1];
  const sourceLink = (content.match(/sourceLink:\s*"([^"]+)"/) || [])[1] || "";
  const host = sourceLink.split("/")[2] || "";
  const html = await fetchPage(sourceLink);
  if (!html) { console.log(`[${i}] FEIL fetch ${slug} (${host})`); failed++; continue; }
  const cands = await extractImageCandidates(html, sourceLink);
  if (cands.length === 0) { console.log(`[${i}] no candidates ${slug}`); skipped++; continue; }

  let buffer = null, usedUrl = null;
  for (const cand of cands.slice(0, 6)) {
    for (const v of expandVariants(cand.src)) {
      buffer = await downloadImage(v, 20000, sourceLink);
      if (buffer) { usedUrl = v; break; }
    }
    if (buffer) break;
  }
  if (!buffer) { console.log(`[${i}] dl fail ${slug}`); failed++; continue; }

  // compare to current
  const oldBuf = oldImg ? await downloadImage(oldImg, 20000) : null;
  const oldHash = oldBuf ? await phash(oldBuf) : null;
  const newHash = await phash(buffer);
  let dist = null;
  if (oldHash && newHash) dist = hamming(oldHash, newHash);
  if (dist !== null && dist <= 12) { console.log(`[${i}] SAME (d=${dist}) skip ${slug}`); same++; continue; }

  try {
    const url = await processAndUpload(slug, buffer);
    let newContent;
    if (/^image:/m.test(content)) newContent = content.replace(/^image:.*$/m, `image: "${url}"`);
    else newContent = content.replace(/^(language: ".*")$/m, `$1\nimage: "${url}"`);
    fs.writeFileSync(f, newContent, "utf-8");
    console.log(`[${i}] UPLOADED ${slug} (${host}) d=${dist} ${url.slice(0, 80)}`);
    ok++;
  } catch (e) {
    console.log(`[${i}] upload fail ${slug}: ${e.message}`);
    failed++;
  }
  done.add(slug);
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done]), "utf-8");
  await sleep(350);
}
console.log(`\nDONE ok=${ok} same=${same} skipped=${skipped} failed=${failed}`);