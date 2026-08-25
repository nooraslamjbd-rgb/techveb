import { CONFIG, VALID_CATEGORIES } from "./config.mjs";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildPrompt(article, isUrdu) {
  const lang = isUrdu ? "Urdu (اردو)" : "English";
  const catList = VALID_CATEGORIES.join(", ");

  return `You are an expert SEO content editor for TechVeb (techveb.com), a technology news website.
Enhance this news article for: SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and LLM readability.

LANGUAGE: Generate ALL content in ${lang}. For Urdu, use proper Urdu script (اردو), not Roman Urdu.

Article Title: ${article.title}
Original Source: ${article.source}
Article Content: ${(article.readableContent?.text || article.description).substring(0, 2000)}

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "title": "Optimized title (max 60 chars, keyword-rich, compelling)",
  "description": "Meta description (max 160 chars, includes primary keyword, compelling)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "one of: ${catList}",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4", "takeaway 5"],
  "faq": [
    {"q": "Question 1?", "a": "Direct concise answer."},
    {"q": "Question 2?", "a": "Direct concise answer."},
    {"q": "Question 3?", "a": "Direct concise answer."}
  ],
  "enhancedContent": "Full enhanced article body with proper H2/H3 headings. Use ## for H2 and ### for H3. Keep paragraphs short (2-3 sentences). Include bullet points where appropriate. Make it scannable and LLM-friendly."
}

RULES:
- Title: max 60 chars, include primary keyword, no clickbait
- Description: max 160 chars, compelling, includes keyword
- Tags: 5-8 relevant tags, lowercase
- Key Takeaways: 5 concise bullet points (each max 15 words)
- FAQ: 3-5 question-answer pairs, questions are what people actually search for
- Enhanced Content: 200-400 words, proper heading hierarchy, factual, cite source
- Content must be original writing, not just a copy of the source
- For Urdu articles, write natural flowing Urdu, not translated-sounding text
- Output ONLY the JSON object, nothing else`;
}

export async function enhanceArticle(article, retryCount = 0) {
  const isUrdu = article.language === "ur";
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 30000;

  try {
    const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(article, isUrdu) }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const waitSec = RETRY_DELAY_MS / 1000 * (retryCount + 1);
      console.log(`\n    Rate limited. Waiting ${waitSec}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await sleep(RETRY_DELAY_MS * (retryCount + 1));
      return enhanceArticle(article, retryCount + 1);
    }

    if (!response.ok) {
      const err = await response.text();
      console.error(`    Gemini API error: ${response.status} - ${err.substring(0, 200)}`);
      return fallbackEnhance(article);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("    Gemini returned empty response");
      return fallbackEnhance(article);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON by finding matching braces
      const start = text.indexOf("{");
      if (start === -1) { console.error("    Could not parse Gemini response"); return fallbackEnhance(article); }
      let depth = 0;
      let end = -1;
      for (let i = start; i < text.length; i++) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
      }
      if (end === -1) { console.error("    Could not parse Gemini response"); return fallbackEnhance(article); }
      try {
        parsed = JSON.parse(text.substring(start, end + 1));
      } catch {
        console.error("    Could not parse Gemini response as JSON");
        return fallbackEnhance(article);
      }
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(parsed.category)) {
      parsed.category = article.category || "tech-news";
    }

    // Ensure arrays
    parsed.tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : article.tags;
    parsed.keyTakeaways = Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways.slice(0, 5) : [];
    parsed.faq = Array.isArray(parsed.faq) ? parsed.faq.slice(0, 5) : [];

    // Ensure required fields
    parsed.title = (parsed.title || article.title).substring(0, 60);
    parsed.description = (parsed.description || article.description).substring(0, 160);
    parsed.enhancedContent = parsed.enhancedContent || article.readableContent?.markdown || article.description;

    return {
      title: parsed.title,
      description: parsed.description,
      tags: parsed.tags,
      category: parsed.category,
      keyTakeaways: parsed.keyTakeaways,
      faq: parsed.faq,
      content: parsed.enhancedContent,
    };
  } catch (err) {
    console.error(`    Enhancement failed: ${err.message}`);
    return fallbackEnhance(article);
  }
}

function fallbackEnhance(article) {
  const isUrdu = article.language === "ur";
  const content = article.readableContent?.markdown || article.description;

  // Generate basic key takeaways from content
  const sentences = (article.readableContent?.text || article.description).split(/[.!?]+/).filter(s => s.trim().length > 30);
  const keyTakeaways = sentences.slice(0, 5).map(s => s.trim().substring(0, 150));

  return {
    title: article.title.substring(0, 60),
    description: article.description.substring(0, 160),
    tags: article.tags,
    category: article.category,
    keyTakeaways,
    faq: [
      { q: isUrdu ? `${article.title.substring(0, 50)}؟` : `What is ${article.title.substring(0, 40)}?`, a: article.description.substring(0, 200) },
    ],
    content,
  };
}

export async function enhanceAllArticles(articles) {
  console.log(`[ENHANCE] Enhancing ${articles.length} articles via Gemini API...`);
  const enhanced = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    process.stdout.write(`  [${i + 1}/${articles.length}] ${article.title.substring(0, 50)}...`);

    const result = await enhanceArticle(article);
    enhanced.push({ ...article, enhanced: result });
    console.log(` OK (${result.category})`);

    // Rate limit: 3s between calls, Gemini free tier = 15 RPM
    if (i < articles.length - 1) await sleep(3000);
  }

  console.log(`[ENHANCE] Done. ${enhanced.length} articles enhanced.`);
  return enhanced;
}
