const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Map article slugs to Wikimedia search keywords
const searchKeywords = {
  '3d-printing-advanced-materials': '3D printer',
  'ai-astronomy-discoveries-2026': 'telescope space',
  'ai-chip-development-2026': 'microprocessor chip',
  'ai-healthcare-2026': 'surgery robot medical',
  'ai-in-climate-science-2026': 'earth climate',
  'ai-in-education-2026': 'classroom education',
  'ai-weather-prediction-2026': 'weather satellite',
  'anthropic-custom-ai-chip-design-team': 'semiconductor chip',
  'anthropic-volta-ten-billion-compute-deal': 'data center server',
  'autonomous-vehicles-2026-status': 'self-driving car',
  'autonomous-vehicles-2026-update': 'autonomous vehicle',
  'best-simulation-games-2026': 'video game controller',
  'cloud-gaming-guide-2026': 'gaming setup',
  'gaming-ethics-debate-2026': 'esports gaming',
  'gcp-google-cloud-platform-guide': 'cloud computing server',
  'html5-semantics-accessibility': 'web development coding',
  'humanoid-robots-2026': 'humanoid robot',
  'jeff-dean-leaves-google-discovery-loop': 'google headquarters',
  'kubernetes-cost-optimization': 'docker container',
  'kubernetes-deployment-guide': 'server room datacenter',
  'kubernetes-helm-charts-guide': 'cloud infrastructure',
  'kubernetes-networking-deep-dive': 'network cables',
  'kubernetes-production-guide-2026': 'server rack datacenter',
  'meta-muse-glimmer-open-weight-ai-model': 'artificial intelligence brain',
  'microsoft-copilot-updates-2026': 'microsoft office',
  'monitoring-observability-2026': 'computer screen dashboard',
  'moodys-warns-banks-ai-big-tech-dependency': 'banking finance',
  'nextjs-fullstack-app-tutorial': 'javascript programming',
  'nginx-reverse-proxy-guide': 'web server nginx',
  'nuclear-fusion-update-2026': 'nuclear fusion reactor',
  'open-source-ai-models-2026': 'github code programming',
  'pc-gaming-build-guide-2026': 'gaming computer PC',
  'security-audit-guide-2026': 'cybersecurity firewall',
  'security-awareness-training-2026': 'security padlock',
  'security-compliance-frameworks': 'information security',
  'service-mesh-istio-linkerd': 'microservices cloud',
  'smart-city-technology-2026': 'smart city',
  'sustainable-ai-computing-2026': 'solar panels renewable',
  'sustainable-tech-2026': 'wind turbine renewable energy',
  'tailwind-css-complete-guide': 'css code programming',
  'web-performance-optimization-2026': 'website speed loading',
  'web-security-best-practices': 'hacking cybersecurity',
  'best-gaming-monitors-2026': 'gaming monitor',
  'best-password-managers-2026': 'password security',
  'best-streaming-services-2026': 'television streaming',
  'best-tablets-for-drawing-2026': 'graphics tablet drawing',
  'best-usb-c-hubs-2026': 'usb hub',
  'best-usb-microphones-2026': 'microphone recording',
  'best-vpn-services-2026': 'virtual private network',
  'best-webcams-2026': 'webcam camera',
  'best-wireless-mice-2026': 'computer mouse',
  'ai-automation-tools-2026': 'robot automation',
  'ai-content-detection-tools': 'artificial intelligence',
  'ai-customer-support-tools': 'chatbot customer service',
  'ai-data-analysis-tools': 'data visualization',
  'ai-design-tools-creatives': 'digital art design',
  'ai-finance-tools-investing': 'stock market trading',
  'ai-for-accounting-finance': 'accounting calculator',
  'ai-for-data-science-2026': 'data science',
  'ai-for-ecommerce-2026': 'online shopping ecommerce',
  'ai-for-email-marketing': 'email marketing',
  'ai-for-food-industry': 'food industry kitchen',
  'ai-for-hr-recruitment-2026': 'job interview recruitment',
  'ai-for-marketing-2026': 'marketing digital',
  'ai-for-nonprofits-2026': 'charity volunteering',
  'ai-for-seo-2026': 'search engine google',
  'ai-for-small-business': 'small business office',
  'ai-for-sports-analytics': 'sports cricket analysis',
  'ai-for-startups-2026': 'startup entrepreneur',
  'ai-for-students-guide': 'student studying',
  'ai-for-teachers-education': 'teacher classroom',
  'ai-for-translation-2026': 'translation language',
  'ai-for-travel-planning': 'travel tourism map',
  'ai-for-voice-actors': 'voice recording studio',
  'ai-healthcare-tools-2026': 'medical doctor technology',
  'ai-image-generation-complete-guide': 'artificial intelligence neural network',
  'ai-legal-tools-2026': 'law justice scales',
  'ai-music-generators-2026': 'music studio',
  'ai-presentation-tools': 'presentation slides',
  'ai-project-management-tools': 'project management',
  'ai-research-tools-academic': 'academic research library',
  'ai-tools-podcasters-2026': 'podcast studio microphone',
  'ai-tools-remote-work-2026': 'home office desk',
  'ai-tools-youtube-creators': 'youtube studio camera',
  'chatgpt-complete-guide-2026': 'artificial intelligence chatbot',
};

async function searchWikimedia(keyword) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages)
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
        const thumbUrl = img.imageinfo[0].thumburl;
        return {
          url: thumbUrl,
          title: img.title,
          credit: img.title?.replace('File:', '').replace(/_/g, ' ').replace(/\.\w+$/, '') || keyword,
        };
      }
    }
  } catch (e) {
    console.error(`  ❌ API error for "${keyword}": ${e.message}`);
  }
  return null;
}

async function main() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const dirs = ['blog', 'reviews', 'ai-tools'];
  let fixed = 0;
  let failed = 0;
  
  const entries = Object.entries(searchKeywords);
  console.log(`🔍 Processing ${entries.length} articles...\n`);
  
  for (const [slug, keyword] of entries) {
    // Find which directory this slug is in
    let targetDir = null;
    for (const dir of dirs) {
      if (fs.existsSync(path.join(contentDir, dir, `${slug}.mdx`))) {
        targetDir = dir;
        break;
      }
    }
    
    if (!targetDir) {
      console.log(`⚠️  ${slug}: not found in any directory`);
      failed++;
      continue;
    }
    
    const filePath = path.join(contentDir, targetDir, `${slug}.mdx`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    
    // Search Wikimedia for relevant image
    const result = await searchWikimedia(keyword);
    
    if (!result) {
      console.log(`❌ ${targetDir}/${slug}: no image found for "${keyword}"`);
      failed++;
      continue;
    }
    
    // Replace image line in frontmatter
    const lines = raw.split('\n');
    let inFrontmatter = false;
    let imageReplaced = false;
    let creditReplaced = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        inFrontmatter = !inFrontmatter;
        continue;
      }
      
      if (inFrontmatter) {
        if (lines[i].startsWith('image:')) {
          lines[i] = `image: "${result.url}"`;
          imageReplaced = true;
        }
        if (lines[i].startsWith('imageCredit:')) {
          lines[i] = `imageCredit: "${result.credit} - Wikimedia Commons"`;
          creditReplaced = true;
        }
      }
    }
    
    if (imageReplaced) {
      fs.writeFileSync(filePath, lines.join('\n'));
      fixed++;
      console.log(`✅ ${targetDir}/${slug} → "${keyword}" → ${result.credit.substring(0, 50)}`);
    } else {
      console.log(`⚠️  ${targetDir}/${slug}: no image field found`);
      failed++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Fixed: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${entries.length}`);
}

main().catch(console.error);
