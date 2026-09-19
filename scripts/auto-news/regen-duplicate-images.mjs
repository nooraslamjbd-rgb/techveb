import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { CONFIG } from "./config.mjs";

if (!process.env.CLOUDINARY_URL) loadEnvLocal();
configureCloudinary();

function loadEnvLocal() {
  const f = path.join(CONFIG.CONTENT_DIR, "..", "..", "..", ".env.local");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf-8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (k && !process.env[k]) process.env[k] = v;
  }
}

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL || "";
  const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (m) {
    cloudinary.config({ cloud_name: m[3], api_key: m[1], api_secret: m[2] });
  } else {
    cloudinary.config();
  }
}

const CONTENT_DIR = CONFIG.CONTENT_DIR;
const PROGRESS_FILE = path.join(CONTENT_DIR, "..", ".fix-images-progress.json");
const AUDIT_FILE = path.join(CONTENT_DIR, "..", ".audit-images.json");
const POLLINATIONS_URL = "https://image.pollinations.ai/prompt/";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "3", 10);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return new Set();
  try { return new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"))); } catch { return new Set(); }
}
function saveProgress(set) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...set]), "utf-8");
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
  if (!a || !b) return null;
  let d = 0;
  for (let i = 0; i < a.length; i++) { const x = parseInt(a[i], 16) ^ parseInt(b[i], 16); d += (x.toString(2).match(/1/g) || []).length; }
  return d;
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 2147483647;
}

function buildPrompt(title, desc) {
  const clean = [title, desc].join(" ").replace(/\s+/g, " ").trim().substring(0, 700);
  return `Photorealistic professional news photograph, 16:9 wide, directly illustrating this news story, matching the subject exactly. No text, no watermark, no logo, no captions, no collage. Realistic lighting, credible press-photo quality. STORY: ${clean}`;
}

async function generateImage(article, salt) {
  const seed = (hashSeed(article.slug) + salt) % 2147483647;
  const prompt = encodeURIComponent(buildPrompt(article.title, article.desc));
  const url = `${POLLINATIONS_URL}${prompt}?width=1200&height=630&seed=${seed}&nologo=true&model=flux&enhance=false&safe=true`;
  let lastErr = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.status === 429) { lastErr = "429"; await sleep(15000 * (attempt + 1)); continue; }
      if (!res.ok) {
        const body = (await res.text()).substring(0, 200);
        lastErr = `${res.status}: ${body}`;
        await sleep(5000);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) { lastErr = `tiny buffer (${buf.length}b)`; await sleep(5000); continue; }
      return { buffer: buf };
    } catch (e) {
      lastErr = e.name === "AbortError" ? "timeout(90s)" : e.message;
      await sleep(3000);
    }
  }
  return { error: lastErr };
}

async function uploadAndSet(slug, buffer) {
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
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, folder: undefined, format: "webp", overwrite: true, unique_filename: false },
      (e, r) => e ? reject(e) : resolve(r.secure_url)
    );
    stream.end(finalBuffer);
  });
}

function writeArticle(slug, url) {
  const f = path.join(CONTENT_DIR, slug + ".mdx");
  let content = fs.readFileSync(f, "utf-8");
  let newContent;
  if (/^image:/m.test(content)) newContent = content.replace(/^image:.*$/m, `image: "${url}"`);
  else newContent = content.replace(/^(language: ".*")$/m, `$1\nimage: "${url}"`);
  fs.writeFileSync(f, newContent, "utf-8");
}

// ---------- Collect duplicate-fingerprint slugs ----------
let audit;
try { audit = JSON.parse(fs.readFileSync(AUDIT_FILE, "utf-8")); } catch { console.error("Missing audit json, run _audit-images.mjs first"); process.exit(1); }

const dupSlugs = new Set();
const dupHashSet = new Set(audit.dupGroups.map(([h]) => h));
for (const [h, v] of audit.dupGroups) for (const slug of v) dupSlugs.add(slug);
console.log("Duplicate-fingerprint slugs to regenerate:", dupSlugs.size);

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
const articles = [];
for (const f of files) {
  const slug = f.replace(".mdx", "");
  if (!dupSlugs.has(slug)) continue;
  const c = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
  const title = (c.match(/title:\s*"([^"]+)"/) || [])[1] || "";
  const desc = (c.match(/description:\s*"([^"]+)"/) || [])[1] || "";
  articles.push({ slug, title, desc });
}
console.log("Loaded articles:", articles.length);

const progress = readProgress();
const pendingAll = articles.filter((a) => !progress.has(a.slug));
const limit = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 0;
const pending = limit ? pendingAll.slice(0, limit) : pendingAll;
console.log(`Pending after resume-skip: ${pending.length}${limit ? ` (limit ${limit})` : ""}`);

// ---------- Workers ----------
const log = (m) => { console.log(m); saveProgress(progress); };
let ok = 0, fail = 0, conflict = 0, idx = 0;

async function worker() {
  while (true) {
    const i = idx++;
    if (i >= pending.length) break;
    const a = pending[i];
    let bestBuf = null, bestHash = null, attempts = 0;
    for (let salt = 0; salt < 3; salt++) {
      const gen = await generateImage(a, salt);
      if (gen.error || !gen.buffer) { log(`[${i + 1}/${pending.length}] FAIL gen (${gen.error}) ${a.slug}`); break; }
      attempts++;
      bestBuf = gen.buffer;
      bestHash = await phash(gen.buffer);
      const tooClose = [...dupHashSet].some((h) => hamming(h, bestHash) !== null && hamming(h, bestHash) <= 12);
      if (!tooClose) break;
      conflict++;
      log(`[${i + 1}/${pending.length}] near-duplicate generated (salt ${salt}), retrying ${a.slug}`);
    }
    if (!bestBuf) { fail++; continue; }
    try {
      const url = await uploadAndSet(a.slug, bestBuf);
      writeArticle(a.slug, url);
      progress.add(a.slug);
      log(`[${i + 1}/${pending.length}] OK ${url.slice(0, 80)} (phash ${bestHash})`);
      ok++;
    } catch (e) {
      log(`[${i + 1}/${pending.length}] FAIL upload: ${e.message}`);
      fail++;
    }
    await sleep(400);
  }
}

const ws = [];
for (let w = 0; w < Math.min(CONCURRENCY, pending.length); w++) ws.push(worker());
await Promise.all(ws);
console.log(`\nDONE ok=${ok} fail=${fail} near-dup-retries=${conflict}`);