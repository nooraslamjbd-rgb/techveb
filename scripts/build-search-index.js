const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.join(__dirname, "..", "src", "content");
const outDir = path.join(__dirname, "..", "public");

const categoryDirMap = {
  ai: "ai-tools",
  "product-reviews": "reviews",
  reviews: "reviews",
};

function getDir(category) {
  return categoryDirMap[category] || "blog";
}

const dirs = ["blog", "reviews", "ai-tools"];
const articles = [];

dirs.forEach((dir) => {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) return;

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));
  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");
    const catDir = getDir(data.category);

    articles.push({
      slug,
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      tags: data.tags || [],
      date: data.date || "",
      dir: catDir,
      featured: !!data.featured,
    });
  });
});

articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const outPath = path.join(outDir, "search-index.json");
fs.writeFileSync(outPath, JSON.stringify(articles), "utf-8");
console.log(`Built search index: ${articles.length} articles -> ${outPath}`);
