import fs from "fs";
import path from "path";

const ROOT = path.resolve();
const CONTENT = path.join(ROOT, "src", "content");
const OUT = path.join(ROOT, "reports");
const DIRS = ["news", "blog", "reviews", "ai-tools", "phones"];

const JUNK_RE = [
  /follow our (threads|twitter|facebook|instagram|youtube|tiktok|telegram)/i,
  /@arynewstv|@[a-z0-9_-]*(newstv|newsshow|newschannel)/i,
  /originally reported by/i,
  /subscribe to our (youtube|channel|telegram|whatsapp)/i,
  /for more (news|updates|details).{0,20}(visit|follow)/i,
  /ہمارے تھریڈ اکاؤنٹ/,	// "follow our Threads account"
  /تھریڈ اکاؤنٹ کو فالو کریں/,
  /also read\s*[:—-]/i,
  /lees verder|czytaj więcej|weiterlesen/i,
  /fbpx|gtag\(|googletag/i,
];

const NUM_SLUG_RE = /^\d+(-?\d+)*\.mdx$/i;

function parseFrontmatter(raw) {
  const fm = {};
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return fm;
  const lines = m[1].split(/\r?\n/);
  const stack = [];
  let current = fm;
  for (let line of lines) {
    if (/^\s*-\s+/.test(line) && current._list) {
      current._list.push(line.replace(/^\s*-\s+/, "").replace(/^['"]|['"]$/g, "").trim());
      continue;
    }
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (key === "faq" || key === "keyTakeaways" || key === "tags") {
      const list = [];
      current[key] = list;
      stack.push([current, key]);
      current = { _list: list };
      continue;
    }
    if (val.startsWith("-")) {
      const list = [];
      current[key] = list;
      list.push(val.replace(/^\s*-\s+/, "").replace(/^['"]|['"]$/g, "").trim());
      stack.push([current, key]);
      current = { _list: list };
      continue;
    }
    if (current._list) {
      const [parent, key] = stack.pop();
      parent[key] = current._list;
      current = parent;
    }
    const clean = (v) => v.replace(/,?\s*$/, "").replace(/^['"]|['"]$/g, "");
    current[key] = clean(val);
  }
  if (current._list) {
    const [parent, key] = stack.pop();
    if (parent) parent[key] = current._list;
  }
  delete fm._list;
  return fm;
}

function bodyText(raw) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

function normTitle(t) {
  return (t || "")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, " ")
    .trim();
}

const hasUrdu = (s) => /[\u0600-\u06FF]/.test(s || "");

const records = [];
const titleIdx = new Map();

for (const dir of DIRS) {
  const folder = path.join(CONTENT, dir);
  if (!fs.existsSync(folder)) continue;
  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(folder, file), "utf8");
    const fm = parseFrontmatter(raw);
    const body = bodyText(raw);
    const words = body.length ? body.trim().split(/\s+/).filter(Boolean).length : 0;
    const junk = [];
    JUNK_RE.forEach((re, i) => {
      const m = body.match(re);
      if (m) junk.push(patternLabel(i));
    });
    // "Originally reported by" is stripped at render time (lib/mdx stripSourceAttribution),
    // so it is NOT user-visible junk. Track it separately.
    const srcAttr = /originally reported by/i.test(body);
    const visibleJunk = junk.filter((j) => j !== "ORIGINALLY-REPORTED-BY");
    const desc = (fm.description || "").trim();
    const date = fm.date || "";
    const rec = {
      dir,
      file,
      slug: file.replace(/\.mdx$/, ""),
      title: fm.title || "",
      titleNorm: normTitle(fm.title),
      description: desc,
      date,
      category: fm.category || "",
      language: fm.language || (hasUrdu(fm.title + body) ? "ur" : "en"),
      words,
      frontmatter: fm,
      junk: visibleJunk,
      srcAttribution: srcAttr,
      numericSlug: NUM_SLUG_RE.test(file),
    };
    records.push(rec);
    if (rec.titleNorm) {
      if (!titleIdx.has(rec.titleNorm)) titleIdx.set(rec.titleNorm, []);
      titleIdx.get(rec.titleNorm).push(rec);
    }
  }
}

function patternLabel(i) {
  return ["THREADS-SOCIAL", "ARY-SOCIAL", "ORIGINALLY-REPORTED-BY", "SUBSCRIBE-PLUG", "MORE-DETAILS-PLUG", "URDU-THREADS-PLUG", "URDU-FOLLOW-PLUG", "ALSO-READ-LEFTOVER", "FOREIGN-CTA", "SCRIPT-LEFTOVER"][i] || `JUNK${i}`;
}

const dupGroups = [...titleIdx.values()].filter((g) => g.length > 1);

const byFile = new Map();

for (const g of dupGroups) {
  const best = [...g].sort((a, b) => {
    const aScore = (a.description ? 1 : 0) * 10 + Math.min(a.words, 2000) + (a.numericSlug ? -100000 : 0);
    const bScore = (b.description ? 1 : 0) * 10 + Math.min(b.words, 2000) + (b.numericSlug ? -100000 : 0);
    return bScore - aScore || a.file.localeCompare(b.file);
  })[0];
  for (const r of g) {
    if (r === best) {
      r._decision = "KEEP";
      r._reasons = r._reasons || [];
      r._reasons.push("FINALIST-OF-DUP-GROUP");
    } else {
      r._decision = r.numericSlug ? "REMOVE" : "MERGE";
      r._reasons = [`DUPLICATE-TITLE-OF:${best.dir}/${best.file}`];
    }
    byFile.set(r.dir + "/" + r.file, r);
  }
}

for (const r of records) {
  if (byFile.has(r.dir + "/" + r.file)) continue;
  const reasons = [];
  if (r.junk.length) reasons.push("JUNK-BODY-LINES:" + r.junk.join("|"));
  if (!r.description || r.description.length < 10) reasons.push("NO-DESCRIPTION");
  if (r.words < 200) reasons.push("THIN-BODY");
  if (r.numericSlug) reasons.push("NUMERIC-SLUG");
  if (r.words >= 200 && r.description && !r.junk.length && !r.numericSlug) {
    r._decision = "KEEP";
    r._reasons = ["OK"];
  } else {
    r._decision = "UPDATE";
    r._reasons = reasons;
  }
  byFile.set(r.dir + "/" + r.file, r);
}

// Summary
const stats = {};
for (const r of records) {
  const d = r.dir;
  stats[d] = stats[d] || { files: 0, words: 0, keep: 0, update: 0, merge: 0, remove: 0, dup: 0, thin: 0, noDesc: 0, junk: 0, ur: 0, en: 0 };
  const s = stats[d];
  s.files++;
  s.words += r.words;
  s.keep += r._decision === "KEEP" ? 1 : 0;
  s.update += r._decision === "UPDATE" ? 1 : 0;
  s.merge += r._decision === "MERGE" ? 1 : 0;
  s.remove += r._decision === "REMOVE" ? 1 : 0;
  if (r.junk.length) s.junk++;
  if (r.words < 200) s.thin++;
  if (!r.description || r.description.length < 10) s.noDesc++;
  if (r.language === "ur") s.ur++;
  else s.en++;
}

console.log("=== CONTENT AUDIT SUMMARY ===");
const patCount = {};
for (const r of records) for (const j of r.junk) patCount[j] = (patCount[j] || 0) + 1;
console.log("Visible-junk by pattern:", JSON.stringify(patCount));
const attrCount = records.filter((r) => r.srcAttribution).length;
console.log("Body files w/ 'Originally reported by' (render-stripped):", attrCount);
for (const dir of Object.keys(stats)) {
  const s = stats[dir];
  console.log(`\n[${dir}] files=${s.files} avgWords=${Math.round(s.words / s.files)} keep=${s.keep} update=${s.update} merge=${s.merge} remove=${s.remove} dupInvolved=${s.merge + s.remove} thin<200=${s.thin} noDesc=${s.noDesc} junkBody=${s.junk} ur=${s.ur} en=${s.en}`);
}

console.log("\nREMOVE candidates:");
for (const r of records) if (r._decision === "REMOVE") console.log("  ", r.dir + "/" + r.file, "->", r._reasons.join(";"));
console.log("\nMERGE groups:");
for (const g of dupGroups) {
  console.log("  GROUP:", g.map((r) => r.dir + "/" + r.file + (r._decision === "MERGE" ? "(merge)" : "(keep)")).join(" | "));
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const csv = ["dir,file,title,decision,reasons,words,language,category,hasDescription,junk"];
for (const r of records) {
  csv.push([r.dir, r.file, `"${(r.title || "").replace(/"/g, '""')}"`, r._decision, `"${(r._reasons || []).join(";")}"`, r.words, r.language, r.category, r.description ? 1 : 0, r.junk.join("|")].join(","));
}
fs.writeFileSync(path.join(OUT, "audit-content.csv"), csv.join("\n"));
const json = { generatedAt: new Date().toISOString(), dirs: DIRS, stats, visibleJunkByPattern: patCount, srcAttributionCount: attrCount, dupGroups: dupGroups.map((g) => ({ title: g[0].title, titleNorm: g[0].titleNorm, files: g.map((r) => ({ dir: r.dir, file: r.file, decision: r._decision })) })), records: records.map((r) => ({ dir: r.dir, file: r.file, slug: r.slug, title: r.title, decision: r._decision, reasons: r._reasons || [], words: r.words, language: r.language, category: r.category, date: r.date, junk: r.junk, srcAttribution: r.srcAttribution })) };
fs.writeFileSync(path.join(OUT, "audit-content.json"), JSON.stringify(json, null, 1));
console.log("\nWrote reports/audit-content.csv and reports/audit-content.json");