const fs = require('fs');
const path = require('path');

const contentDirs = ['src/content/blog', 'src/content/reviews', 'src/content/ai-tools'];
const issues = [];

for (const dir of contentDirs) {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) continue;
  
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.mdx'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(fullPath, file), 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    
    const frontmatter = frontmatterMatch[1];
    const imageMatch = frontmatter.match(/image:\s*"?([^"\n]+)"?/);
    const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
    
    if (!imageMatch || !titleMatch) continue;
    
    const image = imageMatch[1].trim();
    const title = titleMatch[1].trim();
    
    // Check for obviously wrong images
    const badPatterns = [
      { pattern: /Google.*logo/i, keyword: 'google' },
      { pattern: /Reno.*Elevation/i, keyword: 'reno' },
      { pattern: /Fig.*Sketch/i, keyword: 'sketch' },
      { pattern: /MT_48LC/i, keyword: 'memory chip' },
      { pattern: /Wikipedia.*Logo/i, keyword: 'wikipedia' },
      { pattern: /Creative Commons/i, keyword: 'creative commons' },
    ];
    
    for (const bad of badPatterns) {
      if (bad.pattern.test(image) || bad.pattern.test(decodeURIComponent(image))) {
        issues.push({
          file: file,
          title: title.substring(0, 60),
          image: image.substring(0, 80),
          issue: `Image appears to be "${bad.keyword}" - not relatable to article`
        });
        break;
      }
    }
  }
}

console.log(`\n📸 Image Audit Report`);
console.log(`===================`);
console.log(`Total articles checked: ${contentDirs.reduce((acc, dir) => {
  const p = path.join(process.cwd(), dir);
  return acc + (fs.existsSync(p) ? fs.readdirSync(p).filter(f => f.endsWith('.mdx')).length : 0);
}, 0)}`);

if (issues.length > 0) {
  console.log(`\n❌ ${issues.length} articles with potentially wrong images:\n`);
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.file}`);
    console.log(`   Title: ${issue.title}`);
    console.log(`   Issue: ${issue.issue}`);
    console.log(`   Image: ${issue.image}\n`);
  });
} else {
  console.log(`\n✅ All images appear relevant!`);
}
