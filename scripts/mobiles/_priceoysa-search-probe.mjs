import * as cheerio from "cheerio";
const UA = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" };
const model = process.argv[2] || "Samsung Galaxy S26 Ultra";
const url = "https://www.priceoye.pk/search?q=" + encodeURIComponent(model) + "&type=products";
console.log("URL:", url);
const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
console.log("status:", r.status);
if (!r.ok) { console.log("fetch failed"); process.exit(0); }
const html = await r.text();
const $ = cheerio.load(html);
// Find product cards from search results: productBox elements
// From earlier probe, search results also have .productBox with name+price
// Let's extract any that have /mobiles/ in the href
const phones = [];
$(".productBox").each((i, el) => {
  const a = $(el).find("a.ga-dataset").first();
  if (!a.length) return;
  const href = a.attr("href") || "";
  if (!href.includes("/mobiles/")) return;
  const name = $(el).find("h4.p-title").first().text().replace(/\s+/g, " ").trim();
  const priceRaw = $(el).find(".price-box.p1 span").first().text().replace(/[^0-9]/g, "");
  const origRaw = $(el).find(".price-diff-retail span").first().text().replace(/[^0-9]/g, "");
  if (!name || !priceRaw) return;
  phones.push({ name, price: parseInt(priceRaw, 10), originalPrice: origRaw ? parseInt(origRaw, 10) : null });
});
console.log("search result phones:", phones.length);
phones.slice(0, 20).forEach(p => console.log(p.name.padEnd(45), "Rs " + p.price));
if (phones.length === 0) console.log("no productBox found in search results - may need different selector");