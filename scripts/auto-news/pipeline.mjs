import { fetchAllNews, fetchTrendingTopics, selectTopArticles } from "./fetch-news.mjs";
import { enhanceAllArticles } from "./enhance.mjs";
import { processAllImages } from "./process-images.mjs";
import { writeArticles } from "./write-articles.mjs";
import { CONFIG } from "./config.mjs";

async function main() {
  const startTime = Date.now();
  console.log("========================================");
  console.log("  TechVeb Auto-News Pipeline");
  console.log(`  ${new Date().toISOString()}`);
  console.log("========================================\n");

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