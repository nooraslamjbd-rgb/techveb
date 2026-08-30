import fs from "fs";
import path from "path";

const gsm = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "mobiles", "gsmarena-raw.json"), "utf8"));
const OUT_DIR = path.join(process.cwd(), "src", "content", "phones");
fs.mkdirSync(OUT_DIR, { recursive: true });

function slugify(s) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-$/g, "");
}

function extractPrice(specs) {
  const misc = specs["Misc"] || {};
  for (const key of ["Price", "price", "Price (EUR)", "Price (GBP)"]) {
    if (misc[key]) return misc[key];
  }
  for (const [k, v] of Object.entries(misc)) {
    if (typeof v === "string" && (/€|About/.test(v))) return v;
  }
  return null;
}

function buildDescription(specs) {
  const groups = ["Network", "Launch", "Body", "Display", "Platform"];
  const parts = [];
  for (const g of groups) {
    if (specs[g]) {
      const keys = Object.keys(specs[g]).slice(0, 2);
      if (keys.length) {
        parts.push(`${g}: ${keys.map(k => `${k}: ${specs[g][k]}`).join("; ")}`);
      }
    }
  }
  return parts.join("; ");
}

function genMdx(phone) {
  const { slug, name, brand, announced, specs, image } = phone;
  const price = extractPrice(specs);
  // build tags: brand + first two name tokens
  const nameTokens = name.split(" ").slice(0, 2).map(w => w.replace(/[^a-z]/g, "").toLowerCase()).filter(Boolean);
  const tags = [brand, ...nameTokens];
  // build tags string for frontmatter
  const tagItems = tags.map(t => `"${t}"`).join(", ");
  // frontmatter
  const fm = `---
title: "${name}"
description: "Full specifications for ${name}"
date: "${announced}"
author: "TechVeb Team"
category: "phones"
tags: [${tagItems}]
_image_: "/phones/${slug}.jpg"
_price_: "${price ? price : "Price not available"}"
_priceSource_: "GSMArena (EUR)"
---`;
  // body: spec summary
  const specGroups = ["Network", "Launch", "Body", "Display", "Platform", "Memory", "Main Camera", "Selfie camera", "Sound", "Comms", "Features", "Battery", "Misc"];
  const bodyLines = [];
  bodyLines.push(`# ${name}`);
  bodyLines.push(`\n**Brand:** ${brand}`);
  if (price) { bodyLines.push(`**Price (EUR):** ${price}`); }
  bodyLines.push(`**Released:** ${announced}`);
  bodyLines.push("");
  for (const g of specGroups) {
    if (specs[g]) {
      const items = Object.entries(specs[g]).slice(0, 3).map(([k, v]) => `- **${k}:** ${v}`);
      if (items.length) bodyLines.push(`**${g}:** ${items.join(" ")}`);
    }
  }
  bodyLines.push("");
  bodyLines.push(`![Phone image](${image})`);
  return fm + "\n\n" + bodyLines.join("\n");
}

let written = 0;
for (const phone of gsm) {
  const slug = phone.slug;
  const mdx = genMdx(phone);
  const filePath = path.join(OUT_DIR, `${slug}.mdx`);
  fs.writeFileSync(filePath, mdx);
  written++;
  console.log(`${written}/${gsm.length} ${phone.name}`);
}

console.log(`\nWrote ${written} MDX files to ${OUT_DIR}`);