const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  [String.fromCharCode(0x202F), ' '],   // Narrow No-Break Space
  [String.fromCharCode(0x2009), ' '],   // Thin Space
  [String.fromCharCode(0x200A), ' '],   // Hair Space
  [String.fromCharCode(0x200B), ''],    // Zero Width Space
  [String.fromCharCode(0xFEFF), ''],    // BOM
  [String.fromCharCode(0x2011), '-'],   // Non-Breaking Hyphen
  [String.fromCharCode(0x2012), '-'],   // Figure Dash
  [String.fromCharCode(0x2013), '-'],   // En Dash
  [String.fromCharCode(0x2014), '--'],  // Em Dash
  [String.fromCharCode(0x2015), '--'],  // Horizontal Bar
  [String.fromCharCode(0x2026), '...'], // Ellipsis
  [String.fromCharCode(0x00A0), ' '],   // Non-Breaking Space
];

const dirs = ['blog', 'news', 'reviews', 'ai-tools'];
let totalFixed = 0;

for (const d of dirs) {
  const dir = path.join('src/content', d);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

  for (const f of files) {
    const fp = path.join(dir, f);
    const raw = fs.readFileSync(fp, 'utf-8');

    // Find frontmatter boundaries manually - don't use gray-matter
    const firstDash = raw.indexOf('---');
    if (firstDash !== 0) continue;
    const secondDash = raw.indexOf('---', 3);
    if (secondDash === -1) continue;

    const fmEnd = secondDash + 3; // position after closing ---
    const frontmatter = raw.substring(0, fmEnd);
    let content = raw.substring(fmEnd);

    let modified = false;
    for (const [bad, good] of REPLACEMENTS) {
      if (content.includes(bad)) {
        content = content.split(bad).join(good);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(fp, frontmatter + content, 'utf-8');
      totalFixed++;
    }
  }
}

console.log('Total files fixed:', totalFixed);
