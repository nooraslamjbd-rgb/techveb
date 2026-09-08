import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { CONFIG } from "./config.mjs";

cloudinary.config();

const CONTENT_DIR = CONFIG.CONTENT_DIR;
const PROGRESS_FILE = path.join(CONTENT_DIR, "..", ".fix-images-progress.json");
const IMAGE_MODEL = "gemini-2.5-flash-image";
const IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`;

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

function buildPrompt(title, desc, language) {
  const langNote = language === "ur"
    ? "The subject is Pakistani news in Urdu. Generate a culturally appropriate, neutral news illustration."
    : "";
  return `You are a news media photo editor. Create ONE professional, photorealistic 16:9 news photograph for an article, matching the subject exactly. No text overlays, no watermarks, no logos, no people's real faces — if people are unavoidable, show them from behind or at a distance. Neutral, credible press-photo style.

${langNote}

ARTICLE TITLE: ${title}
ARTICLE SUMMARY: ${desc}

Requirements:
- 16:9 landscape, detailed, realistic, news-photography quality
- Directly illustrates the subject of the article
- Strictly one image, no collage
- Do NOT include any text, letters, numbers, or captions in the image`;
}

async function generateImage(article) {
  const prompt = buildPrompt(article.title, article.desc, article.language);
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  };
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(`${IMAGE_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 429) {
        const text = await res.text();
        lastErr = `429 body=${text.substring(0, 600)} retryAfter=${res.headers.get("retry-after")} limits=${res.headers.get("x-ratelimit-remaining")}/${res.headers.get("x-ratelimit-limit")}`;
        await sleep(6000 * (attempt + 1));
        continue;
      }
      if (!res.ok) { lastErr = `${res.status}: ${(await res.text()).substring(0, 200)}`; await sleep(3000); continue; }
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
          return { buffer: Buffer.from(part.inlineData.data, "base64"), mime: part.inlineData.mimeType };
        }
      }
      // fallbacks for text-only responses
      if (parts.length) lastErr = "no inline image in response parts";
      else lastErr = "empty response";
    } catch (e) { lastErr = e.message; await sleep(2000); }
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

// ---------- Main ----------
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx"));
const progress = readProgress();
const limit = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 0;

const targets = [];
for (const f of files) {
  const c = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
  const info = getArticleInfo(f, c);
  if (!info.isTarget) continue;      // only UrduPoint / BOL
  if (progress.has(info.slug)) continue;
  const q = (c.match(/language:\s*"([^"]+)"/) || [])[1] || "en";
  info.language = q;
  targets.push(info);
}
console.log(`Candidate UrduPoint/BOL images to generate: ${targets.length}${limit ? ` (limit ${limit})` : ""}`);

const todo = limit ? targets.slice(0, limit) : targets;
let ok = 0, fail = 0;
for (let i = 0; i < todo.length; i++) {
  const a = todo[i];
  process.stdout.write(`[${i + 1}/${todo.length}] ${a.slug}... `);
  const gen = await generateImage(a);
  if (gen.error || !gen.buffer) { console.log(`FAIL (${gen.error})`); fail++; continue; }
  try {
    const url = await uploadAndSet(a.slug, gen.buffer);
    const f = path.join(CONTENT_DIR, a.slug + ".mdx");
    let content = fs.readFileSync(f, "utf-8");
    let newContent;
    if (/^image:/m.test(content)) newContent = content.replace(/^image:.*$/m, `image: "${url}"`);
    else newContent = content.replace(/^(language: ".*")$/m, `$1\nimage: "${url}"`);
    fs.writeFileSync(f, newContent, "utf-8");
    progress.add(a.slug);
    saveProgress(progress);
    console.log(`OK ${url.slice(0, 70)}`);
    ok++;
  } catch (e) {
    console.log(`FAIL upload: ${e.message}`);
    fail++;
  }
  await sleep(1000);
}
console.log(`\nDONE ok=${ok} fail=${fail}`);