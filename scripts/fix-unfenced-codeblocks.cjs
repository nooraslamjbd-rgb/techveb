const fs = require('fs');
const path = require('path');

const dirs = ['blog', 'reviews', 'ai-tools'];
let totalFixed = 0;

for (const d of dirs) {
  const dir = path.join('src/content', d);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  for (const f of files) {
    const fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    let modified = false;
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Detect unfenced code blocks: a line that's just a language name (bash, json, yaml, etc.)
      // followed by non-empty content that's not a markdown heading
      const langNames = ['bash', 'json', 'yaml', 'yml', 'python', 'javascript', 'js', 'typescript', 'ts', 'go', 'java', 'sh', 'shell', 'sql', 'xml', 'toml', 'ini', 'dockerfile', 'ruby', 'rust', 'c', 'cpp', 'powershell'];
      
      if (langNames.includes(line.toLowerCase()) && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        // If next line is not empty, not a heading, not a list item, not a fence
        if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('- ') && !nextLine.startsWith('```') && !nextLine.startsWith('*')) {
          // Check if there's already a closing fence before the next blank line or heading
          let hasClosingFence = false;
          for (let j = i + 2; j < Math.min(i + 50, lines.length); j++) {
            if (lines[j].trim().startsWith('```')) {
              hasClosingFence = true;
              break;
            }
            if (lines[j].trim() === '' && j + 1 < lines.length && (lines[j + 1].trim() === '' || lines[j + 1].trim().startsWith('#'))) {
              break;
            }
          }
          
          if (!hasClosingFence) {
            // Find where the code block ends (blank line or heading)
            let endIdx = i + 1;
            for (let j = i + 1; j < lines.length; j++) {
              const l = lines[j].trim();
              if (l === '') {
                endIdx = j;
                break;
              }
              if (l.startsWith('#') || l.startsWith('```')) {
                endIdx = j;
                break;
              }
              endIdx = j + 1;
            }
            
            // Add opening fence
            newLines.push('```' + line);
            // Add code lines
            for (let j = i + 1; j < endIdx; j++) {
              newLines.push(lines[j]);
            }
            // Add closing fence
            newLines.push('```');
            i = endIdx - 1; // skip processed lines
            modified = true;
            continue;
          }
        }
      }
      newLines.push(lines[i]);
    }

    if (modified) {
      fs.writeFileSync(fp, newLines.join('\n'), 'utf-8');
      console.log('FIXED:', d + '/' + f);
      totalFixed++;
    }
  }
}
console.log('Total files fixed:', totalFixed);
