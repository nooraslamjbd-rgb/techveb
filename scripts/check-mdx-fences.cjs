const fs = require('fs');
const path = require('path');

const dirs = ['blog', 'reviews', 'ai-tools'];
let issues = 0;

for (const d of dirs) {
  const dir = path.join('src/content', d);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === 'json' && i + 1 < lines.length && lines[i + 1].trim().startsWith('{')) {
        if (i > 0 && !lines[i - 1].trim().startsWith('```')) {
          console.log(`${d}/${f}:${i + 1}`);
          issues++;
        }
      }
    }
  }
}
console.log('Unfenced JSON blocks:', issues);
