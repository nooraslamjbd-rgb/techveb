/**
 * Find real Wikimedia Commons images for all articles.
 * 
 * Usage: node scripts/find-real-images.js
 * 
 * This script searches the Wikimedia Commons API for images matching each article's
 * topic and updates the MDX files with verified, working image URLs.
 * 
 * Requirements: Internet access to commons.wikimedia.org
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const https = require('https');

const contentDir = path.join(process.cwd(), 'src', 'content');
const dirs = ['blog', 'reviews', 'ai-tools'];

// Delay between API calls to avoid rate limiting (ms)
const DELAY_MS = 300;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract search keywords from article title and tags
function getSearchKeywords(title, tags = [], category = '') {
  // Clean title - remove common filler words
  const cleaned = title
    .replace(/\b(in|the|a|an|for|and|or|of|to|with|on|at|by|from|vs|best|top|guide|complete|2026|2025)\b/gi, '')
    .replace(/[^\w\s]/g, '')
    .trim();
  
  // Get first 3-4 meaningful words
  const words = cleaned.split(/\s+/).filter(w => w.length > 2).slice(0, 3);
  
  // Add relevant category keywords
  const categoryMap = {
    'ai': 'artificial intelligence',
    'tech-news': 'technology',
    'product-reviews': 'technology product',
    'cloud': 'cloud computing server',
    'cybersecurity': 'security cyber',
    'tutorials': 'programming code',
    'emerging-tech': 'technology innovation',
    'gaming': 'gaming video game',
    'coding': 'programming developer',
    'blog': 'technology',
  };
  
  const catKeywords = categoryMap[category] || '';
  
  return [...words, catKeywords].filter(Boolean).join(' ');
}

// Search Wikimedia Commons for an image
async function searchWikimedia(keyword) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, {
      headers: { 'User-Agent': 'TechVeb/1.0 (image-finder)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.pages) {
            const pages = Object.values(json.query.pages)
              .filter(p => p.imageinfo && p.imageinfo[0])
              .filter(p => {
                const mime = p.imageinfo[0].mime || '';
                return mime.startsWith('image/') && !mime.includes('svg') && !mime.includes('icon');
              })
              .filter(p => {
                const w = p.imageinfo[0].width || 0;
                const h = p.imageinfo[0].height || 0;
                return w >= 400 && h >= 300 && w <= 5000 && h <= 5000;
              });
            
            if (pages.length > 0) {
              const img = pages[0];
              resolve({
                url: img.imageinfo[0].thumburl,
                title: img.title,
                width: img.imageinfo[0].width,
                height: img.imageinfo[0].height,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Verify an image URL is accessible
async function verifyImage(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'TechVeb/1.0' },
      timeout: 5000,
    }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log('🔍 Finding real Wikimedia images for all articles...\n');
  
  let fixed = 0;
  let failed = 0;
  let verified = 0;
  let total = 0;
  
  for (const dir of dirs) {
    const dirPath = path.join(contentDir, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx'));
    
    for (const f of files) {
      total++;
      const slug = f.replace('.mdx', '');
      const filePath = path.join(dirPath, f);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      
      if (!data.image) continue;
      
      // Check if current image URL works
      const isWorking = await verifyImage(data.image);
      if (isWorking) {
        verified++;
        process.stdout.write('.');
        continue;
      }
      
      // Search for a new image
      const keywords = getSearchKeywords(data.title || slug, data.tags, data.category);
      
      try {
        const result = await searchWikimedia(keywords);
        
        if (result && result.url) {
          // Verify the new URL works
          const newWorking = await verifyImage(result.url);
          
          if (newWorking) {
            // Update the file
            const lines = raw.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].startsWith('image:')) {
                lines[i] = `image: "${result.url}"`;
              }
              if (lines[i].startsWith('imageCredit:')) {
                lines[i] = `imageCredit: "${result.title.replace('File:', '').replace(/_/g, ' ').replace(/\.\w+$/, '')} - Wikimedia Commons"`;
              }
            }
            fs.writeFileSync(filePath, lines.join('\n'));
            fixed++;
            console.log(`\n✅ ${dir}/${slug} → "${keywords}" → ${result.title.substring(0, 50)}`);
          } else {
            failed++;
            console.log(`\n❌ ${dir}/${slug}: found image but URL not accessible`);
          }
        } else {
          failed++;
          console.log(`\n❌ ${dir}/${slug}: no image found for "${keywords}"`);
        }
      } catch (e) {
        failed++;
        console.log(`\n❌ ${dir}/${slug}: API error - ${e.message}`);
      }
      
      await sleep(DELAY_MS);
    }
  }
  
  console.log(`\n\n📊 Summary:`);
  console.log(`✅ Already working: ${verified}`);
  console.log(`✅ Fixed: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${total}`);
}

main().catch(console.error);
