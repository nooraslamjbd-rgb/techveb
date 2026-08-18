const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "src", "content");

// Image pools by topic (Wikimedia Commons images)
const CYBER_IMAGES = [
  { url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Internet_Security_Padlock_for_VPN_%26_Online_Privacy.jpg", credit: "mikemacmarketing, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Internet_Security_Padlock_for_VPN_%26_Online_Privacy.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Security_lock_symbol-blue.svg", credit: "NikolasKHF, CC0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Security_lock_symbol-blue.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Binary_Code.jpg", credit: "Cncplayer, CC BY-SA 3.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Binary_Code.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/3/38/Firewall_%28networking%29.png", credit: "Luis F. Gonzalez, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Firewall_(networking).png" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/8/80/CBC_encryption.svg", credit: "WhiteTimberwolf, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:CBC_encryption.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Firewall.png", credit: "Bruno Pedrozo, CC BY-SA 3.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Firewall.png" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Example_phishing_email.svg", credit: "Isochrone, CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Example_phishing_email.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/0/06/Password_hacking_illustration.jpg", credit: "Santeri Viinamäki, CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Password_hacking_illustration.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Site-to-site_VPN-en.svg", credit: "Michel Bakni, CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Site-to-site_VPN-en.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Colonial-Pipeline-Ransomware.jpg", credit: "Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Colonial-Pipeline-Ransomware.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/2/22/SOC_Security_Monitors.jpg", credit: "UMD-Eskin, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:SOC_Security_Monitors.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/9/92/ComputerSecurityTriad.svg", credit: "JohnManuel, CC BY-SA 3.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:ComputerSecurityTriad.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/5/53/Conficker.svg", credit: "Gppande, CC BY-SA 3.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Conficker.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/6/60/CloudComputingStack.svg", credit: "Sam Johnston, CC0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:CloudComputingStack.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Ransomware-pic.jpg", credit: "Motormille2, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Ransomware-pic.jpg" },
];

const CLOUD_IMAGES = [
  { url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Server_Room_%2822397102849%29.jpg", credit: "CLender, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Server_Room_(22397102849).jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Cloud_computing.svg", credit: "Sam Johnston, CC BY-SA 3.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Cloud_computing.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Docker_Logo.svg", credit: "Docker Inc., Apache 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Docker_Logo.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/6/67/Kubernetes_logo.svg", credit: "The Linux Foundation / CNCF, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Kubernetes_logo.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", credit: "Amazon.com Inc. via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Amazon_Web_Services_Logo.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Continuous_Integration.jpg", credit: "CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Continuous_Integration.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Web_API.png", credit: "CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Web_API.png" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Erd-entity-relationship-example1.png", credit: "Bigsmoke, CC BY-SA via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Erd-entity-relationship-example1.png" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Server_Rack_with_Spaghetti-Like_Mass_of_Network_Cables.jpg", credit: "Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Server_Rack_with_Spaghetti-Like_Mass_of_Network_Cables.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Edge_computing_paradigm%2C_2019-07-03.svg", credit: "CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Edge_computing_paradigm,_2019-07-03.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Devops-toolchain.svg", credit: "CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Devops-toolchain.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg", credit: "Jason Long, CC BY 3.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Git-logo.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Microservices_app_example_v0.4.png", credit: "CC BY-SA 4.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Microservices_app_example_v0.4.png" },
];

const AI_IMAGES = [
  { url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Artificial_neural_network.svg", credit: "Cburnett, GFDL via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Artificial_neural_network.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Nonlinear_SVM_example_illustration.svg", credit: "Machine Learner via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Nonlinear_SVM_example_illustration.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/1/17/Marketing_dashboard.png", credit: "HelicalInsight OpenSourceBI via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Marketing_dashboard.png" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg", credit: "Python Software Foundation via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Python_logo_and_wordmark.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Quantum_Computer_(3796519198).jpg", credit: "Steve Jurvetson, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Quantum_Computer_(3796519198).jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/0/09/Oculus-Rift-CV1-Headset-Front.jpg", credit: "Evan-Amos, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Oculus-Rift-CV1-Headset-Front.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Valkyrie-robot-3.jpg", credit: "NASA/Bill Stafford, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Valkyrie-robot-3.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/3/32/Renewable_energy_park.jpg", credit: "hpgruesen, CC0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Renewable_energy_park.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Starlink_Mission_(47926144123).jpg", credit: "Official SpaceX Photos, CC BY-NC 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Starlink_Mission_(47926144123).jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Tesla_Model_S_%26_X_side_by_side_at_the_Gilroy_Supercharger.jpg", credit: "Steve Jurvetson, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Tesla_Model_S_%26_X_side_by_side_at_the_Gilroy_Supercharger.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Brain-computer_interface_(schematic).jpg", credit: "Carmena et al., CC BY 2.5 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Brain-computer_interface_(schematic).jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Samsung_Gear_3_Frontier_(32550534290).jpg", credit: "Kārlis Dambrāns, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Samsung_Gear_3_Frontier_(32550534290).jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/9/97/DNA_Double_Helix.png", credit: "NHGRI, Public Domain via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:DNA_Double_Helix.png" },
];

const GENERAL_IMAGES = [
  { url: "https://upload.wikimedia.org/wikipedia/commons/1/16/ESL_Pro_League_S7_Finals_Dallas_-_20180520_132417_(42601976142).jpg", credit: "Esports Kingdom, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:ESL_Pro_League_S7_Finals_Dallas_-_20180520_132417_(42601976142).jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Internet_of_Things.jpg", credit: "Wilgengebroed, CC BY 2.0 via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Internet_of_Things.jpg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg", credit: "Anthropic via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Claude_AI_logo.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", credit: "OpenAI via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:OpenAI_Logo.svg" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta-Logo.png", credit: "Meta Platforms via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Meta-Logo.png" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Google_Gemini_logo_2025.svg", credit: "Google via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Google_Gemini_logo_2025.svg" },
];

// Category to image pool mapping
function getImagePool(category, tags) {
  const tagStr = (tags || []).join(" ").toLowerCase();
  
  if (category === "cybersecurity") return CYBER_IMAGES;
  if (category === "cloud") return CLOUD_IMAGES;
  if (category === "ai") return AI_IMAGES;
  if (category === "tutorials" || category === "coding") return CLOUD_IMAGES;
  if (category === "gaming") return GENERAL_IMAGES;
  if (category === "emerging-tech") return AI_IMAGES;
  return GENERAL_IMAGES;
}

// Deterministic hash from string (for consistent image assignment)
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  
  // Skip if already has an image
  if (raw.includes("image: ") && raw.includes("unsplash")) {
    // This is an Unsplash image - we'll replace it
  } else if (raw.includes("image: ") && !raw.includes("unsplash")) {
    return { action: "skip", reason: "already has non-unsplash image" };
  }
  
  // Parse frontmatter
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { action: "skip", reason: "no frontmatter" };
  
  const frontmatter = match[1];
  
  // Extract fields
  const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?\s*$/m);
  const categoryMatch = frontmatter.match(/category:\s*["']?(.*?)["']?\s*$/m);
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/m);
  
  const title = titleMatch ? titleMatch[1] : "";
  const category = categoryMatch ? categoryMatch[1] : "blog";
  const tags = tagsMatch ? tagsMatch[1].split(",").map(t => t.trim().replace(/["']/g, "")) : [];
  
  // Get image pool and pick deterministic image
  const pool = getImagePool(category, tags);
  const idx = hashString(title) % pool.length;
  const image = pool[idx];
  
  // Remove existing image lines from frontmatter
  let newFrontmatter = frontmatter
    .replace(/image:\s*["']https?:\/\/[^"']*["']\n?/g, "")
    .replace(/imageCredit:\s*["'].*?["']\n?/g, "")
    .replace(/imageCreditUrl:\s*["'].*?["']\n?/g, "");
  
  // Add new image lines before closing ---
  newFrontmatter += `\nimage: "${image.url}"\nimageCredit: "${image.credit}"\nimageCreditUrl: "${image.creditUrl}"`;
  
  const newRaw = raw.replace(match[1], newFrontmatter);
  fs.writeFileSync(filePath, newRaw);
  
  return { action: "replaced", title, category };
}

// Process all MDX files
const dirs = ["blog", "reviews", "ai-tools"];
let totalReplaced = 0;
let totalSkipped = 0;
const stats = { replaced: 0, skipped: 0, errors: 0 };

for (const dir of dirs) {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(dirPath)) continue;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".mdx"));
  
  for (const file of files) {
    try {
      const result = processFile(path.join(dirPath, file));
      if (result.action === "replaced") {
        stats.replaced++;
        if (stats.replaced <= 5) {
          console.log(`[REPLACED] ${file}: ${result.title} (${result.category})`);
        }
      } else {
        stats.skipped++;
      }
    } catch (err) {
      stats.errors++;
      console.error(`[ERROR] ${file}: ${err.message}`);
    }
  }
}

console.log(`\n=== IMAGE REPLACEMENT COMPLETE ===`);
console.log(`Replaced: ${stats.replaced}`);
console.log(`Skipped (no unsplash): ${stats.skipped}`);
console.log(`Errors: ${stats.errors}`);
console.log(`Total processed: ${stats.replaced + stats.skipped + stats.errors}`);
