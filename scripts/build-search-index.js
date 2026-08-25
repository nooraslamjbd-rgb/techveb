const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.join(__dirname, "..", "src", "content");
const outDir = path.join(__dirname, "..", "public");

const dirs = ["blog", "reviews", "ai-tools", "news"];
const articles = [];

dirs.forEach((dir) => {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) return;

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));
  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");

    if (!data.title || !data.date) return;

    articles.push({
      slug,
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      tags: data.tags || [],
      date: data.date || "",
      dir: dir,
      featured: !!data.featured,
    });
  });
});

articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const now = new Date();
const oneDayMs = 86400000;
const filtered = articles.filter(a => {
  const d = new Date(a.date);
  return !isNaN(d.getTime()) && d.getTime() - now.getTime() < oneDayMs;
});

const outPath = path.join(outDir, "search-index.json");
fs.writeFileSync(outPath, JSON.stringify(filtered), "utf-8");
console.log(`Built search index: ${filtered.length} articles (filtered ${articles.length - filtered.length} future-dated) -> ${outPath}`);
