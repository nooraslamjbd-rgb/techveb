const fs = require('fs');
const path = require('path');

// Mapping of bad articles to better Wikimedia Commons images
const imageFixes = {
  'ai-healthcare-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/AI_Tumor_Detection.jpg/1280px-AI_Tumor_Detection.jpg',
  'ai-agents-explained.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
  'ai-astronomy-discoveries-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Hubble_ultra_deep_field_high_rez_edit1.jpg/1280px-Hubble_ultra_deep_field_high_rez_edit1.jpg',
  'ai-copyright-law-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Copyright.svg/1200px-Copyright.svg.png',
  'ai-driven-materials-science.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Nanotechnology.jpg/1280px-Nanotechnology.jpg',
  'ai-energy-consumption-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Electricity_pylons.jpg/1280px-Electricity_pylons.jpg',
  'ai-for-disaster-response-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Disaster_response_team.jpg/1280px-Disaster_response_team.jpg',
  'ai-for-smart-cities-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Smart_city_concept.jpg/1280px-Smart_city_concept.jpg',
  'ai-generated-media-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg',
  'ai-hiring-fairness-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Job_interview.jpg/1280px-Job_interview.jpg',
  'ai-in-archaeology-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Egyptian_Museum_Cairo_KV_62_Tutanchamun_Tomb.jpg/1280px-Egyptian_Museum_Cairo_KV_62_Tutanchamun_Tomb.jpg',
  'ai-in-manufacturing-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Industrial_robot_in_automobile_factory.jpg/1280px-Industrial_robot_in_automobile_factory.jpg',
  'ai-in-sports-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Baseball_game_at_Tokyo_Dome_2018.jpg/1280px-Baseball_game_at_Tokyo_Dome_2018.jpg',
  'astro-framework-tutorial.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Astro_logo_dark.svg/1200px-Astro_logo_dark.svg.png',
  'best-ps5-games-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/PlayStation_5_with_DualSense.jpg/1280px-PlayStation_5_with_DualSense.jpg',
  'best-racing-games-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Racing_game_screenshot.jpg/1280px-Racing_game_screenshot.jpg',
  'database-sharding-scaling-guide.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Database.svg/1200px-Database.svg.png',
  'devops-metrics-dora-guide.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/DevOps_automation_shema.png/1280px-DevOps_automation_shema.png',
  'future-of-ai-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Artificial_intelligence_logo.svg/1200px-Artificial_intelligence_logo.svg.png',
  'github-actions-complete-tutorial.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png',
  'holographic-display-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Holographic_display_concept.jpg/1280px-Holographic_display_concept.jpg',
  'linux-commands-cheat-sheet.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png',
  'meta-quest-4-review.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Meta_Quest_Pro.jpg/1280px-Meta_Quest_Pro.jpg',
  'openai-gpt-o3-release.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
  'quantum-computing-breakthroughs-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/D-Wave_One_Quantum_Computer.jpg/1280px-D-Wave_One_Quantum_Computer.jpg',
  'semiconductor-industry-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Wafer_4_inch.jpg/1280px-Wafer_4_inch.jpg',
  'serverless-computing-complete-guide.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Cloud_computing_icon.svg/1200px-Cloud_computing_icon.svg.png',
  'terraform-state-management.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Terraform_logo.svg/1200px-Terraform_logo.svg.png',
  'top-10-ai-tools-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
  'two-factor-authentication-guide.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Two-factor_authentication.svg/1200px-Two-factor_authentication.svg.png',
  'web3-blockchain-2026-update.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  'best-external-hard-drives-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/USB_Flash_Drive.jpg/1280px-USB_Flash_Drive.jpg',
  'best-laptops-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/MacBook_Air_M1.jpg/1280px-MacBook_Air_M1.jpg',
  'best-mice-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Laser_Mouse.jpg/1280px-Laser_Mouse.jpg',
  'best-monitors-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/LCD_monitor_in_Kanda_Akihabara_2019.jpg/1280px-LCD_monitor_in_Kanda_Akihabara_2019.jpg',
  'ai-ethics-bias-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ethics-icon.svg/1200px-Ethics-icon.svg.png',
  'ai-finance-tools-investing.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Coinbase_Wordmark.svg/1200px-Coinbase_Wordmark.svg.png',
  'ai-for-real-estate-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Real_estate_in_Pakistan.jpg/1280px-Real_estate_in_Pakistan.jpg',
  'ai-for-sports-analytics.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Philippine_Arenas_2019.jpg/1280px-Philippine_Arenas_2019.jpg',
  'ai-robotics-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Industrial_robot_KUKA KR 100.jpg/1280px-Industrial_robot_KUKA_KR_100.jpg',
  'ai-tools-writers-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Typewriter_Olympia_Britannica_1960s.jpg/1280px-Typewriter_Olympia_Britannica_1960s.jpg',
  'free-ai-tools-you-need.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
  'prompt-engineering-guide-2026.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
  'aws-step-functions-guide.mdx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png',
};

let fixed = 0;
let skipped = 0;

for (const [filename, newImage] of Object.entries(imageFixes)) {
  // Find the file in any content directory
  const dirs = ['src/content/blog', 'src/content/reviews', 'src/content/ai-tools'];
  
  for (const dir of dirs) {
    const filePath = path.join(process.cwd(), dir, filename);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Replace the image URL in frontmatter
      const imageRegex = /(image:\s*["']?)([^"'\n]+)(["']?)/;
      if (imageRegex.test(content)) {
        content = content.replace(imageRegex, `$1${newImage}$3`);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Fixed: ${dir}/${filename}`);
        fixed++;
      } else {
        console.log(`⏭️ Skipped (no image field): ${dir}/${filename}`);
        skipped++;
      }
      break;
    }
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Fixed: ${fixed} articles`);
console.log(`   Skipped: ${skipped} articles`);
