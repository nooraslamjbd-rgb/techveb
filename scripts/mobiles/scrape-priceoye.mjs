import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const UA = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
};

const BRANDS = [
  "samsung",
  "apple",
  "xiaomi",
  "redmi",
  "poco",
  "oneplus",
  "google",
  "oppo",
  "vivo",
  "realme",
  "infinix",
  "tecno",
  "motorola",
  "nothing",
  "honor",
];

const OUT = path.join(process.cwd(), "scripts", "mobiles", "priceoye-raw.json");

async function get(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(35000) });
      if (r.ok) return await r.text();
      if (r.status === 429) {
        await new Promise((res) => setTimeout(res, 30000 + i * 15000));
        continue;
      }
      if (r.status >= 500) {
        await new Promise((res) => setTimeout(res, 8000 + i * 8000));
        continue;
      }
      throw new Error("HTTP " + r.status);
    } catch (e) {
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, 8000));
        continue;
      }
      throw e;
    }
  }
  throw new Error("fetch failed: " + url);
}

function parsePage(html) {
  const $ = cheerio.load(html);
  const out = [];
  $(".productBox").each((i, el) => {
    const a = $(el).find("a.ga-dataset").first();
    const name = $(el).find("h4.p-title").first().text().replace(/\s+/g, " ").trim();
    const href = a.attr("href") || "";
    const priceRaw = $(el).find(".price-box.p1 span").first().text().replace(/[^0-9]/g, "");
    const origRaw = $(el).find(".price-diff-retail span").first().text().replace(/[^0-9]/g, "");
    const discount = $(el).find(".price-diff-saving").first().text().trim();
    if (!name || !priceRaw) return;
    out.push({
      name,
      href,
      price: priceRaw ? parseInt(priceRaw, 10) : null,
      originalPrice: origRaw ? parseInt(origRaw, 10) : null,
      discount: discount || null,
    });
  });
  return out;
}

async function main() {
  const all = [];
  for (const b of BRANDS) {
    try {
      const html = await get("https://www.priceoye.pk/mobiles/" + b);
      const items = parsePage(html);
      console.log(`[${b}] ${items.length} products`);
      all.push(...items);
    } catch (e) {
      console.log(`[${b}] ERR: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  // dedupe by href
  const seen = new Set();
  const uniq = all.filter((p) => (seen.has(p.href) ? false : (seen.add(p.href), true)));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(uniq, null, 2));
  console.log(`\nTOTAL unique products: ${uniq.length} -> ${OUT}`);
}

main();
