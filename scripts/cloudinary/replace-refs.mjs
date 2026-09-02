import fs from "fs";
import path from "path";

const SRC = path.join(process.cwd(), "src");
const OG = "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/og-default.png";
const LOGO = "https://res.cloudinary.com/buccb3t4/image/upload/techveb/brand/logo-square.png";

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(SRC);
let changed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, "utf-8");
  const orig = content;

  // ${siteConfig.url}/og-default.png and /logo-square.png
  const siteUrlExpr = "${siteConfig.url}";
  content = content.split(`${siteUrlExpr}/og-default.png`).join(OG);
  content = content.split(`${siteUrlExpr}/logo-square.png`).join(LOGO);

  // Literal absolute https://techveb.com/... forms
  content = content.split("https://techveb.com/og-default.png").join(OG);
  content = content.split("https://techveb.com/logo-square.png").join(LOGO);

  // Root-relative "/og-default.png" and "/logo-square.png" (quoted)
  content = content.split('"/og-default.png"').join(`"${OG}"`);
  content = content.split("'/og-default.png'").join(`'${OG}'`);
  content = content.split('"/logo-square.png"').join(`"${LOGO}"`);
  content = content.split("'/logo-square.png'").join(`'${LOGO}'`);

  if (content !== orig) {
    fs.writeFileSync(f, content);
    changed++;
    console.log("  " + path.relative(process.cwd(), f));
  }
}

console.log(`Updated ${changed} files`);
