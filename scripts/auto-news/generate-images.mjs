import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { CONFIG } from "./config.mjs";

cloudinary.config();

const CONTENT_DIR = CONFIG.CONTENT_DIR;
const PROGRESS_FILE = path.join(CONTENT_DIR, "..", ".fix-images-progress.json");
const POLLINATIONS_URL = "https://image.pollinations.ai/prompt/";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "1", 10);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function readProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return new Set();
  try { return new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"))); } catch { return new Set(); }
}
function saveProgress(set) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...set]), "utf-8");
}

function getArticleInfo(f, content) {
  const slug = f.replace(".mdx", "");
  const title = (content.match(/title:\s*"([^"]+)"/) || [])[1] || "";
  const desc = (content.match(/description:\s*"([^"]+)"/) || [])[1] || "";
  const link = (content.match(/sourceLink:\s*"([^"]+)"/) || [])[1] || "";
  const image = (content.match(/^image:\s*"(https?:\/\/[^"]+)"/m) || [])[1] || "";
  const host = link.split("/")[2] || "";
  const isTarget = /urdupoint|bolnewsurdu/i.test(host);
  return { slug, title, desc, link, image, host, isTarget };
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

async function generateImage(article) {
  const seed = hashSeed(article.slug);
  const prompt = encodeURIComponent(buildPrompt(article.title, article.desc));
  const url = `${POLLINATIONS_URL}${prompt}?width=1200&height=630&seed=${seed}&nologo=true&model=flux&enhance=false&safe=true`;
  let lastErr = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 60000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.status === 429) { lastErr = "429"; await sleep(8000 * (attempt + 1)); continue; }
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
      lastErr = e.name === "AbortError" ? "timeout(60s)" : e.message;
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

async function worker(todo, index, log) {
  let ok = 0, fail = 0;
  for (let i = index; i < todo.length; i += CONCURRENCY) {
    const a = todo[i];
    const gen = await generateImage(a);
    if (gen.error || !gen.buffer) { log(`[${i + 1}/${todo.length}] FAIL (${gen.error})`); fail++; continue; }
    try {
      const url = await uploadAndSet(a.slug, gen.buffer);
      writeArticle(a.slug, url);
      progress.add(a.slug);
      log(`[${i + 1}/${todo.length}] OK ${url.slice(0, 80)}`);
      ok++;
    } catch (e) {
      log(`[${i + 1}/${todo.length}] FAIL upload: ${e.message}`);
      fail++;
    }
    await sleep(400);
  }
  return { ok, fail };
}

// ---------- Main ----------
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));
const progress = readProgress();
const limit = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 0;

const targets = [];
for (const f of files) {
  const c = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
  const info = getArticleInfo(f, c);
  if (!info.isTarget) continue;
  if (progress.has(info.slug)) continue;
  targets.push(info);
}
console.log(`Candidate UrduPoint/BOL images to generate: ${targets.length}${limit ? ` (limit ${limit})` : ""} with concurrency ${CONCURRENCY}`);

const todo = limit ? targets.slice(0, limit) : targets;
const log = (m) => { console.log(m); saveProgress(progress); };
let ok = 0, fail = 0;
const workers = [];
for (let w = 0; w < Math.min(CONCURRENCY, todo.length); w++) {
  workers.push(worker(todo, w, log).then(res => { ok += res.ok; fail += res.fail; }));
}
await Promise.all(workers);
console.log(`\nDONE ok=${ok} fail=${fail}`);