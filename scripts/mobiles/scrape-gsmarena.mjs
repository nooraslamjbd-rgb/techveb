import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const UA = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
};
const OUT = path.join(process.cwd(), "scripts", "mobiles", "gsmarena-raw.json");
const OUT_DIR = path.dirname(OUT);

async function get(url, retries = 6) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (r.ok) return await r.text();
      if (r.status === 429) {
        const wait = 45000 + i * 20000; // 45s, 65s, 85s...
        console.log(`    429 on ${url} -> backoff ${Math.round(wait / 1000)}s`);
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      if (r.status >= 500) {
        const wait = 10000 + i * 10000;
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      throw new Error("HTTP " + r.status);
    } catch (e) {
      if (e.name === "TimeoutError" && i < retries - 1) {
        await new Promise((res) => setTimeout(res, 8000 * (i + 1)));
        continue;
      }
      if (e.message && e.message.startsWith("HTTP") && i >= 0 && i < retries - 1) {
        await new Promise((res) => setTimeout(res, 8000));
        continue;
      }
      throw e;
    }
  }
  throw new Error("fetch failed: " + url);
}

// Brand listing pages -> curated device picks per brand
// Only 2025-2026 popular models across tiers.
const BRAND_PAGES = [
  { brand: "Samsung", page: "samsung-phones-9.php", n: 10 },
  { brand: "Apple", page: "apple-phones-48.php", n: 6 },
  { brand: "Xiaomi", page: "xiaomi-phones-80.php", n: 12 },
  { brand: "OnePlus", page: "oneplus-phones-95.php", n: 6 },
  { brand: "Google", page: "google-phones-107.php", n: 5 },
  { brand: "OPPO", page: "oppo-phones-82.php", n: 6 },
  { brand: "vivo", page: "vivo-phones-98.php", n: 8 },
  { brand: "Realme", page: "realme-phones-118.php", n: 8 },
  { brand: "Infinix", page: "infinix-phones-119.php", n: 6 },
  { brand: "Tecno", page: "tecno-phones-120.php", n: 5 },
  { brand: "Motorola", page: "motorola-phones-4.php", n: 6 },
  { brand: "Nothing", page: "nothing-phones-128.php", n: 4 },
  { brand: "Honor", page: "honor-phones-121.php", n: 6 },
];

function parseGroupedSpecs($) {
  const specs = {};
  let group = "General";
  let lastKey = null;
  $("tr").each((i, tr) => {
    const th = $(tr).find("th").first();
    const thText = th.text().trim();
    if (th.length && thText) {
      group = thText;
      lastKey = null;
    }
    const ttl = $(tr).find("td.ttl").first();
    const nfo = $(tr).find("td.nfo").first();
    if (ttl.length && nfo.length) {
      const key = ttl.text().replace(/\u00a0/g, "").trim();
      const val = nfo.text().replace(/\s+/g, " ").trim();
      if (key) {
        if (!specs[group]) specs[group] = {};
        specs[group][key] = val;
        lastKey = key;
      } else if (val && lastKey) {
        // continuation row (e.g. extra bands, body note) -> append
        specs[group][lastKey] = specs[group][lastKey] + " ; " + val;
      } else if (val) {
        if (!specs[group]) specs[group] = {};
        specs[group]["_note"] = (specs[group]["_note"] ? specs[group]["_note"] + " ; " : "") + val;
      }
    }
  });
  return specs;
}

function normalizeSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractYear(dateStr) {
  const m = (dateStr || "").match(/(202[0-9])/);
  return m ? m[1] : null;
}

function detectSubBrand(name) {
  const n = (name || "").toLowerCase();
  if (n.startsWith("poco ") || n.startsWith("poco-")) return "POCO";
  if (n.startsWith("redmi ") || n.startsWith("redmi-")) return "Redmi";
  return null;
}

async function scrapeBrand({ brand, page, n }) {
  const html = await get("https://www.gsmarena.com/" + page);
  const $ = cheerio.load(html);
  const phones = [];
  $("div.makers ul li").each((i, el) => {
    if (phones.length >= n) return;
    const a = $(el).find("a");
    const href = a.attr("href") || "";
    if (!/^[a-z0-9_]+\-\d+\.php$/.test(href)) return;
    const name = $(el).find("span").text().trim();
    phones.push({
      href,
      name,
      img: a.find("img").attr("src") || "",
      sub: detectSubBrand(name),
    });
  });
  return { brand, phones };
}

async function scrapeDetail(href) {
  const html = await get("https://www.gsmarena.com/" + href);
  const $ = cheerio.load(html);
  const name = $("h1").first().text().trim() || href.replace(/\.php$/, "");
  const img = $("img[src*='bigpic']").first().attr("src") || "";
  const announced = $("td.nfo").filter((i, el) =>
    $(el).parent().find("td.ttl").text().trim() === "Announced" ? true : false
  ).first().text().trim();

  const status = $("td.nfo").filter((i, el) =>
    $(el).parent().find("td.ttl").text().trim() === "Status" ? true : false
  ).first().text().trim();

  const specs = parseGroupedSpecs($);
  const year = extractYear(announced);

  return {
    slug: normalizeSlug(name),
    name,
    image: img,
    announced,
    status,
    year,
    specs,
  };
}

function isDesired(phone) {
  const y = phone.year;
  if (y !== "2025" && y !== "2026") return false;
  const s = (phone.status || "").toLowerCase();
  if (s.includes("rumored")) return false;
  // reject non-phone devices (watches, tablets, earbuds, TVs, monitors, speakers)
  const n = " " + (phone.name || "").toLowerCase().replace(/-/g, " ") + " ";
  const NON_PHONE =
    /(watch|wearable|band|tablet| pad | ear(?:bud|buds|phones?) | headphones? | smart ?tv| monitor | display | speaker | homepod)/;
  if (NON_PHONE.test(n)) return false;
  // require a chipset or display spec to be "full"
  const plat = phone.specs?.["Platform"] || {};
  const disp = phone.specs?.["Display"] || {};
  if (!plat.Chipset && !disp.Type) return false;
  return true;
}

async function main() {
  const seen = new Set();
  const results = [];
  for (const b of BRAND_PAGES) {
    const brand = b.brand;
    try {
      const { phones } = await scrapeBrand(b);
      console.log(`[${brand}] found ${phones.length} on listing`);
      for (const p of phones) {
        try {
          const detail = await scrapeDetail(p.href);
          if (!isDesired(detail)) {
            console.log(`  skip ${detail.name} (year=${detail.year} status=${detail.status})`);
            continue;
          }
          const key = detail.slug;
          if (seen.has(key)) continue;
          seen.add(key);
          detail.brand = p.sub || brand;
          detail.listingImg = p.img;
          results.push(detail);
          console.log(`  + ${detail.name} (${detail.brand}, ${detail.year})`);
        } catch (e) {
          console.log(`  ERR detail ${p.href}: ${e.message}`);
        }
        await new Promise((r) => setTimeout(r, 700));
      }
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.log(`[${brand}] ERR listing: ${e.message}`);
    }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
  console.log(`\nTOTAL desired phones: ${results.length} -> ${OUT}`);
}

main();
