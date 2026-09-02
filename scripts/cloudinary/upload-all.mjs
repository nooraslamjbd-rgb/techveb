import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config();

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAP_FILE = path.join(process.cwd(), "scripts", "cloudinary", "upload-map.json");
const BATCH = 10;
const DELAY = 80;

const FOLDERS = [
  { local: "phones", remote: "techveb/phones" },
  { local: "news", remote: "techveb/news" },
  { local: "heroes/blog", remote: "techveb/heroes/blog" },
  { local: "heroes/ai-tools", remote: "techveb/heroes/ai-tools" },
  { local: "heroes/reviews", remote: "techveb/heroes/reviews" },
];

const ROOT_ASSETS = [
  "logo.png",
  "logo-square.png",
  "og-default.png",
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon-original.png",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-128.png",
  "icon-192.png",
  "icon-512.png",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadOne(localPath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      overwrite: true,
      unique_filename: false,
      resource_type: "auto",
    });
    return { ok: true, url: result.secure_url, pid: result.public_id };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

async function uploadBatch(items) {
  const results = [];
  for (let i = 0; i < items.length; i += BATCH) {
    const chunk = items.slice(i, i + BATCH);
    const batch = await Promise.all(
      chunk.map(({ localPath, publicId }) =>
        uploadOne(localPath, publicId).then((r) => ({
          localPath,
          publicId,
          ...r,
        }))
      )
    );
    results.push(...batch);
    const done = Math.min(i + BATCH, items.length);
    process.stdout.write(`\r  [${done}/${items.length}]`);
    if (i + BATCH < items.length) await sleep(DELAY);
  }
  console.log();
  return results;
}

async function main() {
  console.log("=== Cloudinary Upload ===\n");
  const mapping = {};
  let ok = 0;
  let fail = 0;

  for (const folder of FOLDERS) {
    const dir = path.join(PUBLIC_DIR, folder.local);
    if (!fs.existsSync(dir)) {
      console.log(`SKIP ${folder.local}/ (not found)`);
      continue;
    }
    const exts = /\.(jpe?g|png|webp|gif|avif|ico|svg)$/i;
    const files = fs.readdirSync(dir).filter((f) => exts.test(f));
    console.log(`${folder.local}/ → ${folder.remote}/ (${files.length})`);

    const items = files.map((f) => ({
      localPath: path.join(dir, f),
      publicId: `${folder.remote}/${f.replace(/\.[^.]+$/, "")}`,
    }));

    const results = await uploadBatch(items);
    for (const r of results) {
      if (r.ok) {
        mapping[`/${folder.local}/${path.basename(r.localPath)}`] = r.url;
        ok++;
      } else {
        console.log(`  FAIL ${path.basename(r.localPath)}: ${r.error.slice(0, 80)}`);
        fail++;
      }
    }
  }

  // Root brand assets
  const available = ROOT_ASSETS.filter((f) => fs.existsSync(path.join(PUBLIC_DIR, f)));
  console.log(`root/ → techveb/brand/ (${available.length})`);
  const rootItems = available.map((f) => ({
    localPath: path.join(PUBLIC_DIR, f),
    publicId: `techveb/brand/${f.replace(/\.[^.]+$/, "")}`,
  }));
  const rootResults = await uploadBatch(rootItems);
  for (const r of rootResults) {
    if (r.ok) {
      mapping[`/${path.basename(r.localPath)}`] = r.url;
      ok++;
    } else {
      console.log(`  FAIL ${path.basename(r.localPath)}: ${r.error.slice(0, 80)}`);
      fail++;
    }
  }

  fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });
  fs.writeFileSync(MAP_FILE, JSON.stringify(mapping, null, 2));
  console.log(`\n=== DONE: ${ok} ok, ${fail} fail ===`);
  console.log(`Mapping: ${MAP_FILE}`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
