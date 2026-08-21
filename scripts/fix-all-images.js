const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Map article slugs to Wikimedia search keywords for relevant images
const imageMap = {
  // Blog articles
  '3d-printing-advanced-materials': { search: '3D printer', credit: '3D Printing', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/3D_Printer.jpg/1280px-3D_Printer.jpg' },
  'ai-astronomy-discoveries-2026': { search: 'space telescope astronomy', credit: 'Space Telescope', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/1280px-HST-SM4.jpeg' },
  'ai-chip-development-2026': { search: 'microprocessor chip', credit: 'Microprocessor', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Intel_Core_i7-8700K.jpg/1280px-Intel_Core_i7-8700K.jpg' },
  'ai-healthcare-2026': { search: 'medical artificial intelligence', credit: 'Medical AI', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Robodoc_surgery.jpg/1280px-Robodoc_surgery.jpg' },
  'ai-in-climate-science-2026': { search: 'climate change earth', credit: 'Climate Science', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_blue_marble.jpg/1280px-The_blue_marble.jpg' },
  'ai-in-education-2026': { search: 'education technology classroom', credit: 'EdTech', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg' },
  'ai-weather-prediction-2026': { search: 'weather forecast satellite', credit: 'Weather Satellite', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GOES-16_Geocolor_Image_of_the_Eastern_Pacific_Hurricane_Season.png/1280px-GOES-16_Geocolor_Image_of_the_Eastern_Pacific_Hurricane_Season.png' },
  'anthropic-custom-ai-chip-design-team': { search: 'AI chip processor', credit: 'AI Chip', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tensor_Processing_Unit.jpg/1280px-Tensor_Processing_Unit.jpg' },
  'anthropic-volta-ten-billion-compute-deal': { search: 'cloud computing data center', credit: 'Cloud Computing', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Cloud Computing.jpg/1280px-Cloud_Computing.jpg' },
  'autonomous-vehicles-2026-status': { search: 'self driving car autonomous vehicle', credit: 'Autonomous Vehicle', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Self-driving_car_-_Flickr_-_Intel_Free_Stocks.jpg/1280px-Self-driving_car_-_Flickr_-_Intel_Free_Stocks.jpg' },
  'autonomous-vehicles-2026-update': { search: 'self driving car lidar', credit: 'Self-Driving Car', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Autonomous_Vehicle_Technology.jpg/1280px-Autonomous_Vehicle_Technology.jpg' },
  'best-simulation-games-2026': { search: 'video game controller', credit: 'Gaming', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Xbox_One_controller_%2813427775813%29.jpg/1280px-Xbox_One_controller_%2813427775813%29.jpg' },
  'cloud-gaming-guide-2026': { search: 'cloud gaming', credit: 'Cloud Gaming', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Gaming-smartphone.jpg/1280px-Gaming-smartphone.jpg' },
  'gaming-ethics-debate-2026': { search: 'video game', credit: 'Gaming Ethics', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Playstation-4-console-with-controller.jpg/1280px-Playstation-4-console-with-controller.jpg' },
  'gcp-google-cloud-platform-guide': { search: 'google cloud platform', credit: 'Google Cloud', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1200px-Google_Cloud_logo.svg.png' },
  'html5-semantics-accessibility': { search: 'html5 web development coding', credit: 'Web Development', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png' },
  'humanoid-robots-2026': { search: 'humanoid robot boston dynamics', credit: 'Humanoid Robot', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/HUBO_robot_2015.jpg/800px-HUBO_robot_2015.jpg' },
  'jeff-dean-leaves-google-discovery-loop': { search: 'google artificial intelligence', credit: 'Google AI', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png' },
  'kubernetes-cost-optimization': { search: 'kubernetes container', credit: 'Kubernetes', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png' },
  'kubernetes-deployment-guide': { search: 'kubernetes container orchestration', credit: 'Kubernetes', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png' },
  'kubernetes-helm-charts-guide': { search: 'kubernetes docker container', credit: 'Kubernetes', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png' },
  'kubernetes-networking-deep-dive': { search: 'kubernetes networking', credit: 'Kubernetes', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png' },
  'kubernetes-production-guide-2026': { search: 'kubernetes production', credit: 'Kubernetes', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png' },
  'meta-muse-glimmer-open-weight-ai-model': { search: 'meta artificial intelligence', credit: 'Meta AI', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png' },
  'microsoft-copilot-updates-2026': { search: 'microsoft copilot ai', credit: 'Microsoft AI', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png' },
  'monitoring-observability-2026': { search: 'server monitoring dashboard', credit: 'Monitoring', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Nagios_logo.svg/1200px-Nagios_logo.svg.png' },
  'moodys-warns-banks-ai-big-tech-dependency': { search: 'banking finance technology', credit: 'Banking Tech', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Online_banking.jpg/1280px-Online_banking.jpg' },
  'nextjs-fullstack-app-tutorial': { search: 'nextjs react javascript', credit: 'Next.js', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nextjs-logo.svg/1200px-Nextjs-logo.svg.png' },
  'nginx-reverse-proxy-guide': { search: 'nginx web server', credit: 'Nginx', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nginx_logo.svg/1200px-Nginx_logo.svg.png' },
  'nuclear-fusion-update-2026': { search: 'nuclear fusion reactor', credit: 'Nuclear Fusion', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ITER_principal_parts_assembly.jpg/1280px-ITER_principal_parts_assembly.jpg' },
  'open-source-ai-models-2026': { search: 'open source software code', credit: 'Open Source', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png' },
  'pc-gaming-build-guide-2026': { search: 'gaming pc computer build', credit: 'PC Gaming', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Gaming_PC.jpg/1280px-Gaming_PC.jpg' },
  'security-audit-guide-2026': { search: 'cybersecurity security lock', credit: 'Cybersecurity', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Computer_security_audit.jpg/1280px-Computer_security_audit.jpg' },
  'security-awareness-training-2026': { search: 'cybersecurity awareness', credit: 'Security', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hacking_attempt.jpg/1280px-Hacking_attempt.jpg' },
  'security-compliance-frameworks': { search: 'information security compliance', credit: 'Security', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/ISO_27001_Certification.jpg/1280px-ISO_27001_Certification.jpg' },
  'service-mesh-istio-linkerd': { search: 'microservices architecture', credit: 'Microservices', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Microservices.PNG/1280px-Microservices.PNG' },
  'smart-city-technology-2026': { search: 'smart city technology', credit: 'Smart City', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Smart_city.jpg/1280px-Smart_city.jpg' },
  'sustainable-ai-computing-2026': { search: 'green computing renewable energy', credit: 'Green Computing', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Solar_energy.jpg/1280px-Solar_energy.jpg' },
  'sustainable-tech-2026': { search: 'sustainable technology green energy', credit: 'Sustainable Tech', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/1280px-Camponotus_flavomarginatus_ant.jpg' },
  'tailwind-css-complete-guide': { search: 'tailwind css framework', credit: 'Tailwind CSS', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png' },
  'web-performance-optimization-2026': { search: 'website speed performance', credit: 'Web Performance', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Speedtest_2019.png/1280px-Speedtest_2019.png' },
  'web-security-best-practices': { search: 'web security https ssl', credit: 'Web Security', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/SSL_certificate.png/1280px-SSL_certificate.png' },
  
  // Reviews
  'best-gaming-monitors-2026': { search: 'gaming monitor display', credit: 'Gaming Monitor', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Computer_monitor_-_Pair_of_Dell_UltraSharp_2408WFP.jpg/1280px-Computer_monitor_-_Pair_of_Dell_UltraSharp_2408WFP.jpg' },
  'best-password-managers-2026': { search: 'password security', credit: 'Password Security', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Public_key_infrastructure.svg/1200px-Public_key_infrastructure.svg.png' },
  'best-streaming-services-2026': { search: 'streaming media video', credit: 'Streaming', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Streaming_media_player.jpg/1280px-Streaming_media_player.jpg' },
  'best-tablets-for-drawing-2026': { search: 'drawing tablet digital art', credit: 'Drawing Tablet', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Drawing_tablet.jpg/1280px-Drawing_tablet.jpg' },
  'best-usb-c-hubs-2026': { search: 'usb hub type-c', credit: 'USB-C Hub', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/USB_3.0_Cable.jpg/1280px-USB_3.0_Cable.jpg' },
  'best-usb-microphones-2026': { search: 'usb microphone podcast', credit: 'USB Microphone', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/BlueYetiMicrophone.jpg/1280px-BlueYetiMicrophone.jpg' },
  'best-vpn-services-2026': { search: 'vpn virtual private network', credit: 'VPN', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/VPN_icon_for_extensions_page.svg/1200px-VPN_icon_for_extensions_page.svg.png' },
  'best-webcams-2026': { search: 'webcam video camera', credit: 'Webcam', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/HD_Webcam_-_CrystalTec.jpg/1280px-HD_Webcam_-_CrystalTec.jpg' },
  'best-wireless-mice-2026': { search: 'wireless mouse', credit: 'Wireless Mouse', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mouse_G500_1.jpg/1280px-Mouse_G500_1.jpg' },
  
  // AI Tools
  'ai-automation-tools-2026': { search: 'automation robot process', credit: 'AI Automation', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Robot.svg/1200px-Robot.svg.png' },
  'ai-content-detection-tools': { search: 'ai content detection plagiarism', credit: 'AI Detection', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/AI_icon.svg/1200px-AI_icon.svg.png' },
  'ai-customer-support-tools': { search: 'customer support chatbot ai', credit: 'AI Support', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chatbot_icon.svg/1200px-Chatbot_icon.svg.png' },
  'ai-data-analysis-tools': { search: 'data analysis visualization', credit: 'Data Analysis', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Data_visualization.png/1280px-Data_visualization.png' },
  'ai-design-tools-creatives': { search: 'graphic design creative tools', credit: 'AI Design', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1280px-Cat03.jpg' },
  'ai-finance-tools-investing': { search: 'finance investing stock market', credit: 'AI Finance', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Stock_market_chart.png/1280px-Stock_market_chart.png' },
  'ai-for-accounting-finance': { search: 'accounting finance', credit: 'AI Accounting', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Finance_icon.png/1200px-Finance_icon.png' },
  'ai-for-data-science-2026': { search: 'data science machine learning', credit: 'Data Science', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Data_science.png/1280px-Data_science.png' },
  'ai-for-ecommerce-2026': { search: 'ecommerce online shopping', credit: 'AI E-commerce', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Online_shopping.jpg/1280px-Online_shopping.jpg' },
  'ai-for-email-marketing': { search: 'email marketing newsletter', credit: 'AI Email', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Email_icon.svg/1200px-Email_icon.svg.png' },
  'ai-for-food-industry': { search: 'food industry technology', credit: 'AI Food', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg' },
  'ai-for-hr-recruitment-2026': { search: 'human resources recruitment', credit: 'AI HR', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Networking_event.jpg/1280px-Networking_event.jpg' },
  'ai-for-marketing-2026': { search: 'digital marketing analytics', credit: 'AI Marketing', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Marketing_Icon.png/1200px-Marketing_Icon.png' },
  'ai-for-nonprofits-2026': { search: 'nonprofit charity technology', credit: 'AI Nonprofits', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Hands_holding_globe.jpg/1280px-Hands_holding_globe.jpg' },
  'ai-for-seo-2026': { search: 'search engine optimization', credit: 'AI SEO', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Search_engine_optimization_shrunk.svg/1200px-Search_engine_optimization_shrunk.svg.png' },
  'ai-for-small-business': { search: 'small business technology', credit: 'AI Small Business', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Small_business_owner.jpg/1280px-Small_business_owner.jpg' },
  'ai-for-sports-analytics': { search: 'sports analytics data', credit: 'AI Sports', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/CRICKET_Stumps.jpg/1280px-CRICKET_Stumps.jpg' },
  'ai-for-startups-2026': { search: 'startup technology entrepreneur', credit: 'AI Startups', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Startup_company.jpg/1280px-Startup_company.jpg' },
  'ai-for-students-guide': { search: 'student education learning', credit: 'AI for Students', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Students_in_the_classroom.jpg/1280px-Students_in_the_classroom.jpg' },
  'ai-for-teachers-education': { search: 'teacher education classroom', credit: 'AI for Teachers', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Classroom.jpg/1280px-Classroom.jpg' },
  'ai-for-translation-2026': { search: 'translation language multilingual', credit: 'AI Translation', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Google_Translate_logo.svg/1200px-Google_Translate_logo.svg.png' },
  'ai-for-travel-planning': { search: 'travel planning tourism', credit: 'AI Travel', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Machu_Picchu%2C_Peru.jpg/1280px-Machu_Picchu%2C_Peru.jpg' },
  'ai-for-voice-actors': { search: 'voice actor microphone recording', credit: 'AI Voice', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Condenser_microphone_%28KK%29.jpg/1280px-Condenser_microphone_%28KK%29.jpg' },
  'ai-healthcare-tools-2026': { search: 'healthcare medical technology', credit: 'AI Healthcare', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Medical_Free_Licence.jpg/1280px-Medical_Free_Licence.jpg' },
  'ai-image-generation-complete-guide': { search: 'artificial intelligence image generation', credit: 'AI Image Gen', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/AI_icon.svg/1200px-AI_icon.svg.png' },
  'ai-legal-tools-2026': { search: 'law legal justice', credit: 'AI Legal', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Scales_of_justice.svg/1200px-Scales_of_justice.svg.png' },
  'ai-music-generators-2026': { search: 'music generation artificial intelligence', credit: 'AI Music', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/MusicNotes.jpg/1280px-MusicNotes.jpg' },
  'ai-presentation-tools': { search: 'presentation slides business', credit: 'AI Presentations', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/PowerPoint_Icon.svg/1200px-PowerPoint_Icon.svg.png' },
  'ai-project-management-tools': { search: 'project management kanban', credit: 'AI Project Mgmt', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Kanban_board_example.png/1280px-Kanban_board_example.png' },
  'ai-research-tools-academic': { search: 'academic research paper', credit: 'AI Research', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Research_icon.svg/1200px-Research_icon.svg.png' },
  'ai-tools-podcasters-2026': { search: 'podcast recording microphone', credit: 'AI Podcasting', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Podcast_icon.svg/1200px-Podcast_icon.svg.png' },
  'ai-tools-remote-work-2026': { search: 'remote work home office', credit: 'AI Remote Work', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Home_office.jpg/1280px-Home_office.jpg' },
  'ai-tools-youtube-creators': { search: 'youtube video creator', credit: 'AI YouTube', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/YouTube_logo_%282017%29.svg/1200px-YouTube_logo_%282017%29.svg.png' },
  'chatgpt-complete-guide-2026': { search: 'chatgpt openai artificial intelligence', credit: 'ChatGPT', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png' },
};

const contentDir = path.join(process.cwd(), 'src', 'content');
const dirs = ['blog', 'reviews', 'ai-tools'];

let fixed = 0;
let skipped = 0;
let notFound = 0;

dirs.forEach(dir => {
  const dirPath = path.join(contentDir, dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx'));
  
  files.forEach(f => {
    const slug = f.replace('.mdx', '');
    const mapping = imageMap[slug];
    
    if (!mapping) {
      notFound++;
      return;
    }
    
    const filePath = path.join(dirPath, f);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    
    if (!mapping.url || mapping.url.length < 10) {
      skipped++;
      return;
    }
    
    // Update the image URL and credit
    data.image = mapping.url;
    data.imageCredit = `${mapping.credit} - Wikimedia Commons`;
    data.imageCreditUrl = `https://commons.wikimedia.org`;
    
    // Reconstruct the frontmatter
    const frontmatterStr = matter.stringify('', data, { excerpt: false });
    // matter.stringify adds a blank content, we need to prepend our actual content
    const newRaw = frontmatterStr.replace('---\n\n', '---\n') + content;
    
    fs.writeFileSync(filePath, newRaw);
    fixed++;
    console.log(`✅ ${dir}/${slug} -> ${mapping.credit}`);
  });
});

console.log(`\n📊 Summary:`);
console.log(`Fixed: ${fixed}`);
console.log(`Skipped (no URL): ${skipped}`);
console.log(`Not found in map: ${notFound}`);
