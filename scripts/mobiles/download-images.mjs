import fs from "fs";
import path from "path";

const UA = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

const OUT_DIR = path.join(process.cwd(), "public", "phones");
const gsm = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "mobiles", "gsmarena-raw.json"), "utf8"));

fs.mkdirSync(OUT_DIR, { recursive: true });

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, { headers: UA, timeout: 20000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (e) {
    console.log(`  DOWNLOAD FAIL: ${url} -> ${e.message}`);
    return false;
  }
}

async function main() {
  let ok = 0, fail = 0;
  for (const phone of gsm) {
    const slug = phone.slug;
    const bigpic = phone.image;
    if (!bigpic) { fail++; continue; }
    const dest = path.join(OUT_DIR, `${slug}.jpg`);
    const ok2 = await downloadImage(bigpic, dest);
    if (ok2) { ok++; } else { fail++; }
    console.log(`${ok+fail}/${gsm.length} ${phone.name.padEnd(35)} ${ok2 ? "OK" : "FAIL"}`);
  }
  console.log(`\nDownloaded: ${ok}, Failed: ${fail}`);
}

main();