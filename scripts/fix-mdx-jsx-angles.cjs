const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dirs = ['blog', 'reviews', 'ai-tools'];
let totalFixed = 0;

// Known HTML/JSX tags that should NOT be escaped
const safeTags = new Set([
  'br', 'hr', 'img', 'p', 'div', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'strong', 'em', 'b', 'i', 'u', 'code', 'pre', 'blockquote',
  'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
  'details', 'summary', 'figure', 'figcaption', 'sup', 'sub',
  'abbr', 'dl', 'dt', 'dd', 'input', 'select', 'option', 'textarea',
  'button', 'form', 'label', 'fieldset', 'legend',
]);

for (const d of dirs) {
  const dir = path.join('src/content', d);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  
  for (const f of files) {
    const fp = path.join(dir, f);
    const raw = fs.readFileSync(fp, 'utf-8');
    const { data, content } = matter(raw);
    
    const lines = content.split('\n');
    const newLines = [];
    let inCodeBlock = false;
    let modified = false;
    
    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        newLines.push(line);
        continue;
      }
      
      if (inCodeBlock) {
        newLines.push(line);
        continue;
      }
      
      // Check if line has problematic angle brackets
      if (/<[A-Za-z]/.test(line) || /<[0-9]/.test(line)) {
        let newLine = line;
        
        // Don't touch lines that are inside markdown links [text](url)
        // or lines that start with |
        if (line.trim().startsWith('|')) {
          newLines.push(line);
          continue;
        }
        
        // Escape < followed by digits (like <100 ms, <1GB)
        newLine = newLine.replace(/<(\d)/g, '&lt;$1');
        
        // Escape < not followed by known tags
        newLine = newLine.replace(/<([A-Za-z])/g, (match, letter) => {
          // Check if this looks like a known HTML tag
          const tagMatch = newLine.slice(newLine.indexOf(match)).match(/^<([a-zA-Z]+)/);
          if (tagMatch && safeTags.has(tagMatch[1].toLowerCase())) {
            return match; // Keep known tags
          }
          // Check if it's inside backticks
          return match; // We'll handle backtick check below
        });
        
        // More aggressive: escape ALL < that aren't inside backticks or known tags
        // Split by backticks to preserve inline code
        const parts = newLine.split(/(`[^`]+`)/);
        newLine = parts.map((part, idx) => {
          if (idx % 2 === 1) return part; // Inside backtick, keep as is
          
          // Check for known HTML tags
          return part.replace(/<([A-Za-z][A-Za-z0-9]*)/g, (m, tagName) => {
            if (safeTags.has(tagName.toLowerCase())) return m;
            return '&lt;' + tagName;
          });
        }).join('');
        
        if (newLine !== line) {
          modified = true;
        }
        newLines.push(newLine);
      } else {
        newLines.push(line);
      }
    }
    
    if (modified) {
      const newContent = matter.stringify(newLines.join('\n'), data);
      fs.writeFileSync(fp, newContent, 'utf-8');
      console.log('FIXED:', d + '/' + f);
      totalFixed++;
    }
  }
}

console.log('Total files fixed:', totalFixed);
