/**
 * Ad monetization policy.
 *
 * Ads are only shown on original editorial content (blog, reviews, ai-tools).
 * The auto-news stream is largely sourced/summarized from external feeds and is
 * deliberately excluded, so third-party ads never sit on externally-sourced
 * briefs. This keeps the site inside Google AdSense's content policies.
 */
export function shouldShowAds(dir?: string): boolean {
  return dir === "blog" || dir === "reviews" || dir === "ai-tools";
}
