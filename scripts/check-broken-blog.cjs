const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = 'src/content/blog';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
let count = 0;
const problematic = [];

for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
  const { content } = matter(raw);
  
  const lines = content.split('\n');
  let inCodeBlock = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (!inCodeBlock) {
      // Template literals
      if (/\$\{/.test(line)) {
        problematic.push({ file: f, issue: 'template literal', line: line.trim().slice(0, 60) });
        count++;
        break;
      }
      // Unescaped < that looks like JSX
      if (/<[A-Za-z]/.test(line) && !/^\|/.test(line) && !/\[.*\]\(.*<.*\)/.test(line)) {
        problematic.push({ file: f, issue: 'jsx-like angle bracket', line: line.trim().slice(0, 60) });
        count++;
        break;
      }
    }
  }
}

console.log('Potentially broken:', count);
problematic.forEach(p => console.log(` - ${p.file} (${p.issue})`));
