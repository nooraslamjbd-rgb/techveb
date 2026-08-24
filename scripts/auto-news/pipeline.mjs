import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { fetchAllNews, fetchTrendingTopics, selectTopArticles } from "./fetch-news.mjs";
import { enhanceAllArticles } from "./enhance.mjs";
import { processAllImages } from "./process-images.mjs";
import { writeArticles } from "./write-articles.mjs";
import { CONFIG } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const startTime = Date.now();
  console.log("========================================");
  console.log("  TechVeb Auto-News Pipeline");
  console.log(`  ${new Date().toISOString()}`);
  console.log("========================================\n`);

  try {
    // Step 1: Fetch news from all RSS sources
    const allItems = await fetchAllNews();
    if (allItems.length === 0) {
      console.log("\n[PIPELINE] No new articles found. Exiting.");
      return;
    }

    // Step 2: Check trending topics
    const trendingTopics = await fetchTrendingTopics();

    // Step 3: Select top 15 articles
    const selected = selectTopArticles(allItems, trendingTopics);
    if (selected.length === 0) {
      console.log("\n[PIPELINE] No articles selected. Exiting.");
      return;
    }

    // Step 4: Enhance articles via Gemini AI
    const enhanced = await enhanceAllArticles(selected);

    // Step 5: Process images with logo overlay
    const imagePaths = await processAllImages(enhanced);

    // Step 6: Write MDX files
    const written = writeArticles(enhanced, imagePaths);

    if (written === 0) {
      console.log("\n[PIPELINE] No new files to commit. Done.");
      return;
    }

    // Step 7: Rebuild search index
    console.log("\n[INDEX] Rebuilding search index...");
    try {
      execSync("node scripts/build-search-index.js", {
        cwd: path.join(__dirname, "..", ".."),
        stdio: "pipe",
      });
      console.log("[INDEX] Search index rebuilt.");
    } catch (err) {
      console.error("[INDEX] Search index rebuild failed:", err.message);
    }

    // Step 8: Git commit and push
    console.log("\n[PUSH] Committing and pushing...");
    const cwd = path.join(__dirname, "..", "..");
    const date = new Date().toISOString().split("T")[0];
    const commitMsg = `Auto-news: ${written} new articles (${date})`;

    try {
      execSync("git add src/content/news/ public/news/ public/search-index.json", { cwd, stdio: "pipe" });
      execSync(`git commit -m "${commitMsg}"`, { cwd, stdio: "pipe" });
      execSync("git push", { cwd, stdio: "pipe" });
      console.log("[PUSH] Pushed to GitHub successfully!");
    } catch (err) {
      console.error("[PUSH] Git push failed:", err.message);
      console.log("[PUSH] Files are saved locally. Push manually if needed.");
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n========================================`);
    console.log(`  Pipeline complete!`);
    console.log(`  Articles: ${written} new`);
    console.log(`  Time: ${elapsed}s`);
    console.log(`========================================`);

  } catch (err) {
    console.error("\n[PIPELINE] Fatal error:", err);
    process.exit(1);
  }
}

main();