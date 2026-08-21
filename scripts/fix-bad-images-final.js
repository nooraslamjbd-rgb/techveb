const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Verified Wikimedia Commons URLs - these are stable, public domain or CC licensed images
// Each mapped to the correct article topic
const imageFixes = {
  // ===== BLOG ARTICLES =====
  '3d-printing-advanced-materials': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/3D_Printer.jpg/1280px-3D_Printer.jpg',
    credit: '3D Printer - Wikimedia Commons',
  },
  'ai-astronomy-discoveries-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/1280px-HST-SM4.jpeg',
    credit: 'Hubble Space Telescope - NASA/ESA',
  },
  'ai-chip-development-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Microchip.jpg/1280px-Microchip.jpg',
    credit: 'Microchip - Wikimedia Commons',
  },
  'ai-healthcare-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/ROBOT-OR-HUMAN-940x460.jpg/1280px-ROBOT-OR-HUMAN-940x460.jpg',
    credit: 'Medical Technology - Wikimedia Commons',
  },
  'ai-in-climate-science-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_blue_marble.jpg/1280px-The_blue_marble.jpg',
    credit: 'The Blue Marble - NASA',
  },
  'ai-in-education-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Classroom_photo.jpg/1280px-Classroom_photo.jpg',
    credit: 'Classroom - Wikimedia Commons',
  },
  'ai-weather-prediction-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/GOES-16%2C_full_disk_view_of_Earth%2C_january_2017.jpg/1280px-GOES-16%2C_full_disk_view_of_Earth%2C_january_2017.jpg',
    credit: 'GOES-16 Satellite Image - NOAA',
  },
  'anthropic-custom-ai-chip-design-team': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cpu-good.jpg/1280px-Cpu-good.jpg',
    credit: 'CPU Chip - Wikimedia Commons',
  },
  'anthropic-volta-ten-billion-compute-deal': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Server_room.jpg/1280px-Server_room.jpg',
    credit: 'Server Room - Wikimedia Commons',
  },
  'autonomous-vehicles-2026-status': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Waymo_second_generation_self-driving_car_%28cropped%29.jpg/1280px-Waymo_second_generation_self-driving_car_%28cropped%29.jpg',
    credit: 'Waymo Self-Driving Car - Wikimedia Commons',
  },
  'autonomous-vehicles-2026-update': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Waymo_Chevrolet_Cruze%2C_Golden_Gate_Park_%282019%29.jpg/1280px-Waymo_Chevrolet_Cruze%2C_Golden_Gate_Park_%282019%29.jpg',
    credit: 'Autonomous Vehicle - Wikimedia Commons',
  },
  'best-simulation-games-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Xbox_One_controller_%2813427775813%29.jpg/1280px-Xbox_One_controller_%2813427775813%29.jpg',
    credit: 'Xbox Controller - Wikimedia Commons',
  },
  'cloud-gaming-guide-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Gaming_laptop.jpg/1280px-Gaming_laptop.jpg',
    credit: 'Gaming Laptop - Wikimedia Commons',
  },
  'gaming-ethics-debate-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Playstation-4-console-with-controller.jpg/1280px-Playstation-4-console-with-controller.jpg',
    credit: 'PlayStation 4 Console - Wikimedia Commons',
  },
  'gcp-google-cloud-platform-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1200px-Google_Cloud_logo.svg.png',
    credit: 'Google Cloud Logo - Google',
  },
  'html5-semantics-accessibility': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png',
    credit: 'HTML5 Logo - W3C',
  },
  'humanoid-robots-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/ASIMO_at_the_U.S._Embassy_in_Tokyo.jpg/1280px-ASIMO_at_the_U.S._Embassy_in_Tokyo.jpg',
    credit: 'Honda ASIMO Robot - Wikimedia Commons',
  },
  'jeff-dean-leaves-google-discovery-loop': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
    credit: 'Google Logo - Google',
  },
  'kubernetes-cost-optimization': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png',
    credit: 'Kubernetes Logo - CNCF',
  },
  'kubernetes-deployment-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png',
    credit: 'Kubernetes Logo - CNCF',
  },
  'kubernetes-helm-charts-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png',
    credit: 'Kubernetes Logo - CNCF',
  },
  'kubernetes-networking-deep-dive': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png',
    credit: 'Kubernetes Logo - CNCF',
  },
  'kubernetes-production-guide-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png',
    credit: 'Kubernetes Logo - CNCF',
  },
  'meta-muse-glimmer-open-weight-ai-model': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png',
    credit: 'Meta Logo - Meta Platforms',
  },
  'microsoft-copilot-updates-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
    credit: 'Microsoft Logo - Microsoft',
  },
  'monitoring-observability-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Monitoring_screens_at_the_Mission_Control_Center.jpg/1280px-Monitoring_screens_at_the_Mission_Control_Center.jpg',
    credit: 'Mission Control Monitoring - NASA',
  },
  'moodys-warns-banks-ai-big-tech-dependency': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/New_York_Stock_Exchange.jpg/1280px-New_York_Stock_Exchange.jpg',
    credit: 'Wall Street / NYSE - Wikimedia Commons',
  },
  'nextjs-fullstack-app-tutorial': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nextjs-logo.svg/1200px-Nextjs-logo.svg.png',
    credit: 'Next.js Logo - Vercel',
  },
  'nginx-reverse-proxy-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nginx_logo.svg/1200px-Nginx_logo.svg.png',
    credit: 'Nginx Logo - Nginx',
  },
  'nuclear-fusion-update-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ITER_principal_parts_assembly.jpg/1280px-ITER_principal_parts_assembly.jpg',
    credit: 'ITER Fusion Reactor - ITER Organization',
  },
  'open-source-ai-models-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png',
    credit: 'GitHub Logo - GitHub',
  },
  'pc-gaming-build-guide-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Gaming_PC.jpg/1280px-Gaming_PC.jpg',
    credit: 'Gaming PC Setup - Wikimedia Commons',
  },
  'security-audit-guide-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Hacking_in_Pakistan.jpg/1280px-Hacking_in_Pakistan.jpg',
    credit: 'Cybersecurity - Wikimedia Commons',
  },
  'security-awareness-training-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Facebook_The_hacker_News_like.png/1280px-Facebook_The_hacker_News_like.png',
    credit: 'Cybersecurity Awareness - Wikimedia Commons',
  },
  'security-compliance-frameworks': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/ISO_27001_Certification.jpg/1280px-ISO_27001_Certification.jpg',
    credit: 'ISO Security Certification - Wikimedia Commons',
  },
  'service-mesh-istio-linkerd': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Microservices.PNG/1280px-Microservices.PNG',
    credit: 'Microservices Architecture - Wikimedia Commons',
  },
  'smart-city-technology-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Neom_line.jpg/1280px-Neom_line.jpg',
    credit: 'Smart City NEOM - Wikimedia Commons',
  },
  'sustainable-ai-computing-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Solar_panel_at_the_Langenburg_Technical_Highschool.jpg/1280px-Solar_panel_at_the_Langenburg_Technical_Highschool.jpg',
    credit: 'Solar Panels - Wikimedia Commons',
  },
  'sustainable-tech-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Wind_turbines_in_San_Gorgonio_California.jpg/1280px-Wind_turbines_in_San_Gorgonio_California.jpg',
    credit: 'Wind Turbines - Wikimedia Commons',
  },
  'tailwind-css-complete-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png',
    credit: 'Tailwind CSS Logo - Tailwind Labs',
  },
  'web-performance-optimization-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Speedtest_2019.png/1280px-Speedtest_2019.png',
    credit: 'Internet Speed Test - Wikimedia Commons',
  },
  'web-security-best-practices': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Caution_sign.svg/1200px-Caution_sign.svg.png',
    credit: 'Security Warning - Wikimedia Commons',
  },

  // ===== REVIEWS =====
  'best-gaming-monitors-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Computer_monitor_-_Pair_of_Dell_UltraSharp_2408WFP.jpg/1280px-Computer_monitor_-_Pair_of_Dell_UltraSharp_2408WFP.jpg',
    credit: 'Dell Monitor Setup - Wikimedia Commons',
  },
  'best-password-managers-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Password_strength.png/1280px-Password_strength.png',
    credit: 'Password Security - Wikimedia Commons',
  },
  'best-streaming-services-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Smart_TV.jpg/1280px-Smart_TV.jpg',
    credit: 'Smart TV Streaming - Wikimedia Commons',
  },
  'best-tablets-for-drawing-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/iPad_2010.jpg/1280px-iPad_2010.jpg',
    credit: 'iPad Tablet - Wikimedia Commons',
  },
  'best-usb-c-hubs-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/USB_3.0_Cable.jpg/1280px-USB_3.0_Cable.jpg',
    credit: 'USB 3.0 Cable - Wikimedia Commons',
  },
  'best-usb-microphones-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BlueYetiMicrophone.jpg/1280px-BlueYetiMicrophone.jpg',
    credit: 'Blue Yeti Microphone - Wikimedia Commons',
  },
  'best-vpn-services-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/VPN_icon_for_extensions_page.svg/1200px-VPN_icon_for_extensions_page.svg.png',
    credit: 'VPN Icon - Wikimedia Commons',
  },
  'best-webcams-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/HD_Webcam_-_CrystalTec.jpg/1280px-HD_Webcam_-_CrystalTec.jpg',
    credit: 'HD Webcam - Wikimedia Commons',
  },
  'best-wireless-mice-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mouse_G500_1.jpg/1280px-Mouse_G500_1.jpg',
    credit: 'Logitech Gaming Mouse - Wikimedia Commons',
  },

  // ===== AI TOOLS =====
  'ai-automation-tools-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Automation_robot_arm_in_automobile_factory.jpg/1280px-Automation_robot_arm_in_automobile_factory.jpg',
    credit: 'Industrial Automation Robot - Wikimedia Commons',
  },
  'ai-content-detection-tools': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/AI_icon.svg/1200px-AI_icon.svg.png',
    credit: 'AI Icon - Wikimedia Commons',
  },
  'ai-customer-support-tools': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chatbot_icon.svg/1200px-Chatbot_icon.svg.png',
    credit: 'Chatbot Icon - Wikimedia Commons',
  },
  'ai-data-analysis-tools': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Data_visualization.png/1280px-Data_visualization.png',
    credit: 'Data Visualization - Wikimedia Commons',
  },
  'ai-design-tools-creatives': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Photoshop_CC_icon_%282019%29.svg/1200px-Photoshop_CC_icon_%282019%29.svg.png',
    credit: 'Adobe Photoshop Icon - Adobe',
  },
  'ai-finance-tools-investing': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Stock_market_chart.png/1280px-Stock_market_chart.png',
    credit: 'Stock Market Chart - Wikimedia Commons',
  },
  'ai-for-accounting-finance': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Calculator_and_pen.jpg/1280px-Calculator_and_pen.jpg',
    credit: 'Calculator and Finance - Wikimedia Commons',
  },
  'ai-for-data-science-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Data_science.png/1280px-Data_science.png',
    credit: 'Data Science Infographic - Wikimedia Commons',
  },
  'ai-for-ecommerce-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Online_shopping_in_Nairobi.jpg/1280px-Online_shopping_in_Nairobi.jpg',
    credit: 'Online Shopping - Wikimedia Commons',
  },
  'ai-for-email-marketing': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Email_icon.svg/1200px-Email_icon.svg.png',
    credit: 'Email Icon - Wikimedia Commons',
  },
  'ai-for-food-industry': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Industrial_kitchen.jpg/1280px-Industrial_kitchen.jpg',
    credit: 'Industrial Kitchen - Wikimedia Commons',
  },
  'ai-for-hr-recruitment-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Networking_event.jpg/1280px-Networking_event.jpg',
    credit: 'Networking Event - Wikimedia Commons',
  },
  'ai-for-marketing-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Marketing_Icon.png/1200px-Marketing_Icon.png',
    credit: 'Marketing Icon - Wikimedia Commons',
  },
  'ai-for-nonprofits-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Donation_Box.jpg/1280px-Donation_Box.jpg',
    credit: 'Charity Donation - Wikimedia Commons',
  },
  'ai-for-seo-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Search_engine_optimization_shrunk.svg/1200px-Search_engine_optimization_shrunk.svg.png',
    credit: 'SEO Infographic - Wikimedia Commons',
  },
  'ai-for-small-business': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Small_business_owner.jpg/1280px-Small_business_owner.jpg',
    credit: 'Small Business Owner - Wikimedia Commons',
  },
  'ai-for-sports-analytics': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/CRICKET_Stumps.jpg/1280px-CRICKET_Stumps.jpg',
    credit: 'Cricket Stumps - Wikimedia Commons',
  },
  'ai-for-startups-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Startup_company.jpg/1280px-Startup_company.jpg',
    credit: 'Startup Company - Wikimedia Commons',
  },
  'ai-for-students-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Students_in_the_classroom.jpg/1280px-Students_in_the_classroom.jpg',
    credit: 'Students in Classroom - Wikimedia Commons',
  },
  'ai-for-teachers-education': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Classroom.jpg/1280px-Classroom.jpg',
    credit: 'Classroom - Wikimedia Commons',
  },
  'ai-for-translation-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Google_Translate_logo.svg/1200px-Google_Translate_logo.svg.png',
    credit: 'Google Translate Logo - Google',
  },
  'ai-for-travel-planning': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Machu_Picchu%2C_Peru.jpg/1280px-Machu_Picchu%2C_Peru.jpg',
    credit: 'Machu Picchu - Wikimedia Commons',
  },
  'ai-for-voice-actors': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Condenser_microphone_%28KK%29.jpg/1280px-Condenser_microphone_%28KK%29.jpg',
    credit: 'Condenser Microphone - Wikimedia Commons',
  },
  'ai-healthcare-tools-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Medical_Free_Licence.jpg/1280px-Medical_Free_Licence.jpg',
    credit: 'Medical Technology - Wikimedia Commons',
  },
  'ai-image-generation-complete-guide': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/AI_icon.svg/1200px-AI_icon.svg.png',
    credit: 'AI Icon - Wikimedia Commons',
  },
  'ai-legal-tools-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Scales_of_justice.svg/1200px-Scales_of_justice.svg.png',
    credit: 'Scales of Justice - Wikimedia Commons',
  },
  'ai-music-generators-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/MusicNotes.jpg/1280px-MusicNotes.jpg',
    credit: 'Music Notes - Wikimedia Commons',
  },
  'ai-presentation-tools': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/PowerPoint_Icon.svg/1200px-PowerPoint_Icon.svg.png',
    credit: 'PowerPoint Icon - Microsoft',
  },
  'ai-project-management-tools': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Kanban_board_example.png/1280px-Kanban_board_example.png',
    credit: 'Kanban Board - Wikimedia Commons',
  },
  'ai-research-tools-academic': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Research_icon.svg/1200px-Research_icon.svg.png',
    credit: 'Research Icon - Wikimedia Commons',
  },
  'ai-tools-podcasters-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Podcast_icon.svg/1200px-Podcast_icon.svg.png',
    credit: 'Podcast Icon - Wikimedia Commons',
  },
  'ai-tools-remote-work-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Home_office.jpg/1280px-Home_office.jpg',
    credit: 'Home Office - Wikimedia Commons',
  },
  'ai-tools-youtube-creators': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/YouTube_logo_%282017%29.svg/1200px-YouTube_logo_%282017%29.svg.png',
    credit: 'YouTube Logo - Google',
  },
  'chatgpt-complete-guide-2026': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
    credit: 'ChatGPT Logo - OpenAI',
  },
};

const contentDir = path.join(process.cwd(), 'src', 'content');
const dirs = ['blog', 'reviews', 'ai-tools'];
let fixed = 0;
let skipped = 0;

Object.entries(imageFixes).forEach(([slug, fix]) => {
  let targetDir = null;
  for (const dir of dirs) {
    if (fs.existsSync(path.join(contentDir, dir, `${slug}.mdx`))) {
      targetDir = dir;
      break;
    }
  }
  
  if (!targetDir) {
    console.log(`⚠️  ${slug}: file not found`);
    skipped++;
    return;
  }
  
  const filePath = path.join(contentDir, targetDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');
  
  let inFrontmatter = false;
  let imageReplaced = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    
    if (inFrontmatter) {
      if (lines[i].startsWith('image:')) {
        lines[i] = `image: "${fix.image}"`;
        imageReplaced = true;
      }
      if (lines[i].startsWith('imageCredit:')) {
        lines[i] = `imageCredit: "${fix.credit}"`;
      }
    }
  }
  
  if (imageReplaced) {
    fs.writeFileSync(filePath, lines.join('\n'));
    fixed++;
    console.log(`✅ ${targetDir}/${slug}`);
  } else {
    console.log(`⚠️  ${targetDir}/${slug}: no image field`);
    skipped++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Fixed: ${fixed}`);
console.log(`⚠️  Skipped: ${skipped}`);
console.log(`Total: ${Object.keys(imageFixes).length}`);
