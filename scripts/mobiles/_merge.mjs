import fs from "fs";
import path from "path";

const gsm = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "mobiles", "gsmarena-raw.json"), "utf8"));
const po = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "mobiles", "priceoye-raw.json"), "utf8"));

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/galaxy\s+/g, "galaxy")
    .replace(/\b(5g|4g|3g|2g|lte)\b/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(iphone|iphone|ihone)\b/g, " iphone ")
    .replace(/\b(xiaomi|redmi|poco|po?co)\b/g, " xiaomi ")
    .replace(/\b(smart|pro|plus|ultra|max|mini|fe|lite|edge|note|nova|neo|turbo|gt|xt|fantasy|x|s)\b/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function jaccard(a, b) {
  const sa = new Set(a), sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

const results = [];
let matched = 0;
for (const phone of gsm) {
  const pn = norm(phone.name);
  let best = null, bestScore = 0;
  for (const p of po) {
    const on = norm(p.name);
    const score = jaccard(pn, on);
    if (score > bestScore) { bestScore = score; best = p; }
  }
  if (best && bestScore >= 0.5) {
    phone.priceoyeMatch = best;
    phone.matchScore = +bestScore.toFixed(2);
    matched++;
  }
  results.push(phone);
}

console.log(`Matched: ${matched}/${gsm.length}\n`);
for (const p of results) {
  console.log(
    (p.priceoyeMatch ? "OK " : "?? ") +
    p.name.padEnd(42) +
    (p.priceoyeMatch ? p.matchScore + "  " + p.priceoyeMatch.name + " = Rs " + p.priceoyeMatch.price
                      : "(no priceoye match)")
  );
}

fs.writeFileSync(path.join(process.cwd(), "scripts", "mobiles", "merged-raw.json"), JSON.stringify(results, null, 2));
console.log("\nWrote merged-raw.json");
