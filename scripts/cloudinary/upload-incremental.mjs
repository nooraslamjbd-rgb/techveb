import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import gray from "gray-matter";

cloudinary.config();
const CLOUD = "https://res.cloudinary.com/buccb3t4/image/upload";
const dirs = ["blog", "news", "ai-tools", "reviews", "phones"];

const refs = [];
for (const d of dirs) {
  const dp = path.join("src", "content", d);
  if (!fs.existsSync(dp)) continue;
  for (const f of fs.readdirSync(dp)) {
    if (!f.endsWith(".mdx")) continue;
    const c = fs.readFileSync(path.join(dp, f), "utf-8");
    const { data } = gray(c);
    const img = data.image || data._image_;
    if (img && !img.includes("cloudinary.com")) refs.push(img);
  }
}
const unique = [...new Set(refs)];
console.log("Unique local refs:", unique.length);

const lookup = {};
for (const ref of unique) {
  const file = path.join("public", ref.replace(/^\//, ""));
  const ext = path.extname(file).slice(1);
  const publicId = ref.replace(/^\//, "").replace(/\.[^.]+$/, "");
  try {
    const result = await cloudinary.uploader.upload(file, {
      public_id: publicId,
      format: ext,
      overwrite: true,
      unique_filename: false,
    });
    const m = result.secure_url.match(/\/image\/upload\/(?:v\d+\/)?(.+)$/);
    lookup[ref] = m ? `${CLOUD}/${m[1]}` : result.secure_url;
    console.log("uploaded", publicId);
  } catch (e) {
    console.log("FAILED", publicId, e.message.slice(0, 60));
  }
}

fs.mkdirSync("scripts/cloudinary", { recursive: true });
const mapPath = "scripts/cloudinary/upload-map.json";
const map = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
Object.assign(map, lookup);
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
console.log("map updated");

let updated = 0;
for (const d of dirs) {
  const dp = path.join("src", "content", d);
  if (!fs.existsSync(dp)) continue;
  for (const f of fs.readdirSync(dp)) {
    if (!f.endsWith(".mdx")) continue;
    const fp = path.join(dp, f);
    let c = fs.readFileSync(fp, "utf-8");
    const orig = c;
    for (const [local, url] of Object.entries(lookup)) {
      const esc = local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(image:\\s*)["']?${esc}["']?`, "g");
      c = c.replace(re, `$1"${url}"`);
    }
    if (c !== orig) {
      fs.writeFileSync(fp, c);
      updated++;
    }
  }
}
console.log("frontmatter updated:", updated, "files");
