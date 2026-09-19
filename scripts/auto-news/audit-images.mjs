import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = "src/content/news";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

function getInfo(f, c) {
  const slug = f.replace(".mdx", "");
  const link = (c.match(/sourceLink:\s*"([^"]+)"/) || [])[1] || "";
  const host = link.split("/")[2] || "";
  const img = (c.match(/^image:\s*"(https?:\/\/[^"]+)"/m) || [])[1] || "";
  return { slug, host, img, isTarget: true };
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

const targets = {};
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), "utf-8");
  const info = getInfo(f, c);
  if (!info.isTarget) continue;
  if (!info.img) { targets[info.slug] = { ...info, status: "NO-IMAGE" }; continue; }
  targets[info.slug] = info;
}
const all = Object.values(targets);
console.log("Target urdupoint+bol:", all.length);

const CONCURRENCY = 8;
let idx = 0;
const results = {};
async function worker() {
  while (true) {
    const i = idx++;
    if (i >= all.length) break;
    const a = all[i];
    let status = "ERR", size = 0, hash = null, err = "";
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(a.img, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
      clearTimeout(t);
      status = String(res.status);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        size = buf.length;
        hash = await phash(buf);
        if (buf.length < 5000) err = "tiny";
      } else {
        err = res.status;
      }
    } catch (e) {
      err = e.name === "AbortError" ? "timeout" : e.message.slice(0, 40);
    }
    results[a.slug] = { host: a.host, status, size, hash, err };
    if ((i + 1) % 25 === 0) console.log(`  checked ${i + 1}/${all.length}`);
    await new Promise((r) => setTimeout(r, 120));
  }
}
const ws = [];
for (let w = 0; w < CONCURRENCY; w++) ws.push(worker());
await Promise.all(ws);

const byHash = {};
for (const [slug, r] of Object.entries(results)) {
  if (r.hash) { (byHash[r.hash] ||= []).push(slug); }
}
const dupGroups = Object.entries(byHash).filter(([, v]) => v.length > 1);
const notOk = Object.entries(results).filter(([, r]) => r.status !== "200" || r.err);
const noImg = all.filter((a) => !results[a.slug]?.image && a.status === "NO-IMAGE");

const summary = {
  total: all.length,
  http_ok_200: Object.values(results).filter((r) => r.status === "200" && !r.err).length,
  http_fail: notOk.length,
  duplicate_groups: dupGroups.length,
  slugs_in_duplicate_groups: dupGroups.reduce((n, [, v]) => n + v.length, 0),
  no_image: noImg.length,
  hash_null: Object.values(results).filter((r) => !r.hash && r.status !== "NO-IMAGE").length,
};
console.log("\nSUMMARY:", JSON.stringify(summary, null, 2));

if (notOk.length) {
  console.log("\nHTTP FAILS:");
  for (const [slug, r] of notOk.slice(0, 40)) console.log(`  ${slug} ${r.status} ${r.err}`);
}
console.log("\nDUPLICATE GROUPS (hash -> slugs):");
for (const [h, v] of dupGroups.slice(0, 20)) console.log(`  ${h} x${v.length}`, v.join(", "));

fs.writeFileSync("src/content/.audit-images.json", JSON.stringify({ results, summary, dupGroups, notOk }, null, 2), "utf-8");
console.log("\nWrote src/content/.audit-images.json");