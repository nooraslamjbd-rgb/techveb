import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src", "content");
const MAP_FILE = path.join(process.cwd(), "scripts", "cloudinary", "upload-map.json");
const CLOUD = "https://res.cloudinary.com/buccb3t4/image/upload";

const DIRS = ["blog", "news", "ai-tools", "reviews", "phones"];

function cleanUrl(url) {
  const m = url.match(/\/image\/upload\/(?:v\d+\/)?(.+)$/);
  return m ? `${CLOUD}/${m[1]}` : url;
}

function main() {
  const mapping = JSON.parse(fs.readFileSync(MAP_FILE, "utf-8"));
  const cleanMap = {};
  for (const [k, v] of Object.entries(mapping)) {
    cleanMap[k] = cleanUrl(v);
  }

  let updated = 0;

  for (const dir of DIRS) {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
    console.log(`${dir}/ (${files.length} files)`);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      let content = fs.readFileSync(filePath, "utf-8");
      const original = content;

      for (const [local, url] of Object.entries(cleanMap)) {
        const escaped = local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (dir === "phones") {
          // _image_: "/phones/xxx.jpg" OR _image_: /phones/xxx.jpg
          const re = new RegExp(`(_image_:\\s*)["']?${escaped}["']?`, "g");
          content = content.replace(re, `$1"${url}"`);
        } else {
          // image: "/heroes/blog/xxx.webp" OR image: /heroes/blog/xxx.webp
          const re = new RegExp(`(image:\\s*)["']?${escaped}["']?`, "g");
          content = content.replace(re, `$1"${url}"`);
        }
      }

      if (content !== original) {
        fs.writeFileSync(filePath, content);
        updated++;
      }
    }
  }

  console.log(`\nUpdated: ${updated} files`);
}

main();
