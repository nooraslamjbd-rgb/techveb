/**
 * Fix all broken article images by replacing with reliable placehold.co images.
 * These show the article topic text and are guaranteed to load.
 * 
 * Usage: node scripts/fix-broken-images.js
 * 
 * After running, use scripts/find-real-images.js with internet access
 * to replace placeholders with actual Wikimedia Commons images.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(process.cwd(), 'src', 'content');
const dirs = ['blog', 'reviews', 'ai-tools'];

// Category colors for placehold.co
const categoryColors = {
  ai: { bg: '3b82f6', fg: 'ffffff' },
  'tech-news': { bg: '10b981', fg: 'ffffff' },
  'product-reviews': { bg: 'f59e0b', fg: 'ffffff' },
  cloud: { bg: '0ea5e9', fg: 'ffffff' },
  cybersecurity: { bg: 'ef4444', fg: 'ffffff' },
  tutorials: { bg: '8b5cf6', fg: 'ffffff' },
  'emerging-tech': { bg: '06b6d4', fg: 'ffffff' },
  gaming: { bg: 'ec4899', fg: 'ffffff' },
  blog: { bg: '6366f1', fg: 'ffffff' },
  coding: { bg: '10b981', fg: 'ffffff' },
};

function getPlaceholderUrl(title, category) {
  const colors = categoryColors[category] || { bg: '6366f1', fg: 'ffffff' };
  // Clean title for URL
  const cleanTitle = title
    .replace(/[^\w\s]/g, '')
    .substring(0, 60)
    .trim()
    .replace(/\s+/g, '+');
  return `https://placehold.co/1280x720/${colors.bg}/${colors.fg}?text=${encodeURIComponent(cleanTitle)}`;
}

let fixed = 0;

dirs.forEach(dir => {
  const dirPath = path.join(contentDir, dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx'));
  
  files.forEach(f => {
    const slug = f.replace('.mdx', '');
    const filePath = path.join(dirPath, f);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    
    if (!data.image) return;
    
    // Check if image is one of the known broken patterns
    const brokenPatterns = [
      'AI_Tumor_Detection', 'Microchip.jpg', 'ROBOT-OR-HUMAN',
      'Kubernetes_logo', 'New_York_Stock_Exchange',
      'Google_%22G%22_Logo', 'ChatGPT_logo',
      'HST-SM4', 'The_blue_marble',
      'Nextjs-logo', 'Nginx_logo', 'HTML5_logo',
      'Octicons-mark-github', 'Meta_Platforms',
      'Microsoft_logo', 'YouTube_logo',
      'ASIMO_at_the', 'ITER_principal',
      'Tailwind_CSS_Logo', 'Computer_monitor_-_Pair',
      'BlueYetiMicrophone', 'Scales_of_justice',
      'Artificial_intelligence_logo',
      'Xbox_One_controller', 'GOES-16',
      'Cpu-good', 'Server_room',
      'Waymo_second', 'Waymo_Chevrolet',
      'Speedtest_2019',
      'Smart_TV', 'iPad_2010',
      'USB_3.0_Cable', 'VPN_icon',
      'HD_Webcam', 'Mouse_G500',
      'Robot.svg', 'AI_icon',
      'Chatbot_icon', 'Data_visualization',
      'Photoshop_CC_icon', 'Stock_market_chart',
      'Calculator_and_pen', 'Data_science',
      'Online_shopping_in_Nairobi', 'Email_icon',
      'Industrial_kitchen', 'Networking_event',
      'Marketing_Icon', 'Donation_Box',
      'SEO', 'Small_business_owner',
      'CRICKET_Stumps', 'Startup_company',
      'Students_in_the_classroom', 'Classroom',
      'Google_Translate_logo', 'Machu_Picchu',
      'Condenser_microphone', 'Medical_Free_Licence',
      'PowerPoint_Icon', 'Kanban_board',
      'Research_icon', 'Podcast_icon',
      'Home_office', 'YouTube_logo',
      'Scales_of_justice', 'Octicons-mark-github',
      'Campagne_ESSULYX', 'Polistil_Video',
      'Michelangelo_Caetani', 'Dresden_Castle',
      'Starlink_Mission', 'Ariane_5',
      'Computer_abstraction', 'Philippine_Arenas',
      'Bitkub_Blockchain', 'Thermal_Infrared',
      'Gravity_sensor', 'Smartphone_Icon',
      'Coinbase_Wordmark', 'Pluto-01',
      'Better_Oblivion', 'Wikiproject_video',
      'Smaky_100', 'Privacy_by_Leyland',
      'Jinwan_Arts', 'Data_Management',
      'Computer_programming', 'Continuous_Fractional',
      'Artifacts_in_Mobile', 'Jeanette_Scissum',
      'WikiActivate', 'Cjam-distance',
      'Corinne-kutz', 'Workflow_of_a_machine',
      'Rendered_Samsung', 'Google_Autonomous',
      'Google_2015_logo', 'Polistil_Video',
      'Rendering_Samsung',
    ];
    
    const isBroken = brokenPatterns.some(p => data.image.includes(p));
    
    if (isBroken) {
      const title = data.title || slug;
      const category = data.category || 'blog';
      const newUrl = getPlaceholderUrl(title, category);
      
      // Update file
      const lines = raw.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('image:')) {
          lines[i] = `image: "${newUrl}"`;
        }
        if (lines[i].startsWith('imageCredit:')) {
          lines[i] = `imageCredit: "TechVeb"`;
        }
      }
      fs.writeFileSync(filePath, lines.join('\n'));
      fixed++;
    }
  });
});

console.log(`✅ Fixed ${fixed} broken images with placehold.co`);
console.log(`📝 Run "node scripts/find-real-images.js" to replace with real Wikimedia images`);
