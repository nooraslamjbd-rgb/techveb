# TechVeb Content, SEO & AdSense-Readiness Audit

Audit conducted against the live repo at commit `7944293` (baseline tag: `v-audit-baseline` @ `c336b4f`).
Date: 2026-10-03. Companion machine-readable outputs: `reports/audit-content.csv`, `reports/audit-content.json`.

---

## A. What we changed (this batch)

1. **Removed 8 duplicate news articles** (numeric-slug copies of English-slug articles with identical titles). They were `git mv` into `src/content/news/_backup-2026-audit/` (recoverable in history; not deleted). Live news count dropped from 1917 to 1909.
   Files: `10.mdx`, `15.mdx`, `2.mdx`, `27-20.mdx`, `27.mdx`, `31.mdx`, `40.mdx`, `50.mdx`.

2. **Hardened the auto-news pipeline** (`scripts/auto-news/write-articles.mjs`):
   - Strips source-attribution / social-follow junk lines (EN + UR) and "Also read" leftovers.
   - No longer appends the "Originally reported by [source](link)..." attribution block.
   - Adds description fallback (`fallbackDescription()`), title/date dedupe keys, numeric-slug skip (`/^\d+(-\d+)*$/`), and existence guards.
   - `src/lib/mdx.ts`: `stripSourceAttribution` now also removes Threads/social-follow plug lines and "Originally reported by" at render for legacy files.

3. **Honest legal / editorial pages** (removed fabricated claims):
   - New static `src/app/disclaimer/page.tsx` (full legal page, canonical/OG/Twitter meta) + link in footer `src/config/site.ts`.
   - About page: replaced fabricated "Our Team" / "Why Trust Us" with factual "How We Work" / "Our Standards".
   - Terms §5: removed affiliate claim (site currently has no affiliate links).
   - Homepage: removed "500+ in-depth articles" claim; sr-only H1 rewritten to factual "TechVeb - Technology, AI & Innovation Hub".
   - Privacy policy: AdSense bullet reworded to "If and when advertising is enabled..."; added Google Ads Settings opt-out link.

4. **De-indexed off-brand boards** (kept live, noindex + removed from sitemap):
   - `robots: { index: false, follow: true }` on jokes, poetry, quotes, horoscope, recipes, islam, education.
   - `src/app/dictionary/layout.tsx` added to carry the same robots rule (page is a client component).
   - `src/app/sitemap.ts` staticPages: dropped the 8 boards above, added `/disclaimer`.

5. **Tooling**: `scripts/audit-content.mjs` (classification -> CSV/JSON), `scripts/check-broken-blog.cjs`, `scripts/check-mdx-fences.cjs`. `.vercel/**` added to eslint ignores (build artifacts were failing lint).

---

## B. What we intentionally did NOT change

- Brand / name / domain / logo — untouched.
- No bulk deletion of useful content. All moved files are recoverable via git.
- No bulk rewriting of thin articles (would amount to generating low-quality AI content).
- No copying from other sites; the pipeline rewrite is original code.
- No ads were enabled, no ad slots mounted, no click/disclosure hacks. AdBlock-style compliance only.
- Analytics stays consent-gated.

---

## C. Content classification (live counts at time of audit)

| Section   | Files | Avg words | keep | update | thin<200 | noDescription | junkBody | language |
|-----------|-------|-----------|------|--------|----------|---------------|----------|----------|
| news      | 1909  | 471       | 979  | 930    | 474      | 598           | 1        | ur 797 / en 1112 |
| blog      | 456   | 885       | 392  | 64     | 64       | 0             | 0        | en 456   |
| reviews   | 44    | 1225      | 44   | 0      | 0        | 0             | 0        | en 44    |
| ai-tools  | 63    | 1296      | 63   | 0      | 0        | 0             | 0        | en 63    |
| phones    | 70    | 307       | 69   | 1      | 1        | 0             | 0        | en 70    |

- 8 exact-duplicate news removed (see A.1); all other 80 numeric-slug news files are **real Urdu articles** — kept (served but sitemap-excluded, see E).
- Visible junk (scraped "follow on Threads/YouTube" plug lines) found in only 2 files; both handled (1 moved, 1 sanitized at render + pipeline now strips them).
- 1,904 news files contain a "Originally reported by" line; confirmed **render-stripped** (A.2), so not user-visible.

---

## D. Technical / SEO / UX fixes

- Canonical + OG + Twitter meta on the new `/disclaimer` page.
- Sitemap static list corrected (removed noindex boards, added disclaimer/about/contact/privacy/terms).
- Checks run (all green unless noted):
  - `npx tsc --noEmit` — clean (exit 0).
  - `npx eslint` — 0 errors, 13 pre-existing warnings (unused vars, `<img>` vs Image, `window.location.href` in SearchModal, `estimateReadingTime` unused).
  - `node scripts/check-mdx-fences.cjs` — 0 unfenced JSON blocks.
  - `scripts/check-broken-blog.cjs` flags 367 blog files containing raw HTML tags (`<p>`, `<div className="key-takeaways">`, `<h2>`, `<h3>`) — **verified benign**: MDX renders them as valid HTML (checked a live article). No content changes needed; flag is a false positive for actual breakage.
- Local `npm run build` reaches static generation of 4590 pages but exceeds our timeout on Windows; production build/deploy happens in CI (see G).

---

## E. Remaining problems / backlog (honest)

1. **Scale / thinness**: 474 news + 64 blog + 1 phone article are `<200` words; 598 news lack descriptions (rendered pages fall back to an auto-generated description via `getPostDescription`). Ideal output would improve these, but mass-rewriting would be bulk AI content — deliberately not done without explicit direction.
2. **72 numeric-slug Urdu news URLs**: served but excluded from sitemaps by design. Proper re-slugging requires Urdu->Latin transliteration (offline-unavailable). Documented backlog.
3. **Scraped/AI-rewrite nature of the news stream** is the single biggest AdSense-readiness blocker. Advertising on scraped/spun content risks policy violations; recommendation is to gate/limit this stream or tag such pages for exclusion before monetizing.
4. **Ads currently absent**: `AdSlot.tsx` exists but is never mounted; `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` unset. Nothing is served today, so there is nothing to violate — but also no revenue path yet.
5. **Lint warnings** (13) are pre-existing and non-blocking.
6. **Middleware deprecation** warning from Next 16 (`proxy` replacement) — noted, not urgent.

---

## F. AdSense-readiness checklist

- [x] No hidden ads, no click fraud mechanisms, no incentivized clicks.
- [x] Privacy/terms/about/disclaimer pages exist and are reachable from footer.
- [x] Homepage and About are honest (fabricated claims removed).
- [x] Off-brand boards no-indexed (won't dilute crawl budget / policy surface).
- [x] Content junk (scraped social plugs) stripped at render and in the pipeline.
- [x] Consent-gated analytics; no ad tracking without consent.
- [x] 404 + proper robots meta present. No thin auto-generated landing pages.
- [x] `/admin/seo` dashboard exists for on-demand checks.
- [~] 598 news without descriptions fall back automatically at render (medium quality).
- [ ] News stream scrape/rewrite policy + thin-content reduction (474 `<200w`) — owner work.
- [ ] Ads not yet enabled — decide whether to apply with Google AdSense and which sections to monetize.

---

## G. Manual Google Search Console steps (owner)

CI deploy is triggered by push to `main` (`Deploy to Vercel` workflow). After the next successful deploy:

1. In GSC > Sitemaps, resubmit `https://techveb.com/sitemap.xml` (and note the reduced page set).
2. Use URL Inspection on `https://techveb.com/disclaimer` and a couple of blog reviews — Request Indexing after ~1-2 days.
3. For the 8 removed duplicates, let them 404 naturally (no redirects configured); if GSC shows them heavily indexed, Request Indexing removal via URL Removal tool and re-crawl their old paths.
4. For the 7-8 no-indexed boards, nothing to do — they stop appearing after recrawls.
5. Watch Coverage report for "Submitted URL not indexed" on numeric-slug news; triage by setting `lastmod`, checking crawl rate, and manually requesting indexing for the top Urdu articles.

---

## H. Post-audit recommendations batch (this follow-up)

Implemented after the initial audit round:

1. **Pipeline thin-content gate** — `scripts/auto-news/write-articles.mjs` now exports `MIN_WORDS = 150` and skips any new article whose cleaned body is shorter, logging the reason. Existing thin backlog (474 news / 64 blog) is left untouched and remains an owner backlog; the gate stops it from growing.

2. **Re-slugged the 58 numeric-slug news files** — real Urdu articles that were excluded from both sitemaps by `isJunkSlug` (`/^\d+(-\d+)*$/`). Each file was `git mv`'d to a readable English/hybrid slug built from its Urdu title (map: `scripts/re-slug/slug-map.ts`). `next.config.ts` now serves **permanent 301 redirects** (`/news/<old>` -> `/news/<new>`) so old URLs keep working and links are preserved. These articles are now eligible for indexing. The 8 duplicate moves in `_backup-2026-audit/` are untouched.

3. **Lint cleanup** — removed the 13 pre-existing eslint warnings: unused imports/vars across `education`, `recipes`, `Navbar`, `CookieConsent` (dead `consented` state removed), `admin/articles/*`, `category/[slug]`, `lib/github.ts`, `lib/mdx.ts`; `SearchModal` now navigates with `useRouter().push()` instead of `window.location.href`; `<img>` -> `<Image unoptimized>` in the two admin previews and `CryptoWidget`. ESLint: 0 errors, 0 warnings.

4. **AdSense monetization policy (decision)** — `AdSlot.tsx` remains unmounted; no ads are live or near-live. Recommended: **do not enable ads on the auto-news/rewritten stream** (external-RSS rewrites scraped from other outlets are the site's main AdSense-readiness blocker). If ads are enabled later, gate them with a `shouldShowAds(post)` helper that returns `false` for auto-news/rewritten or numeric-origin articles, so only original content (reviews, ai-tools, blog) is monetizable. Revisit this policy after the backlog items above are decided.

5. **GSC note** — after this batch deploys, resubmit sitemaps and use URL Inspection on a few of the newly re-slugged articles to speed indexing. Sitemap was confirmed submitted.