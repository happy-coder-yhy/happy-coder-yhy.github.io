/**
 * AI-based paper relevance filter.
 *
 * Uses an LLM to score each paper against the user's research interests.
 * Only papers scoring >= config.minRelevanceScore are kept.
 */

import OpenAI from 'openai';
import config from './config.js';
import { retry } from './retry-utils.js';

let _client = null;

function getClient() {
  if (!_client) {
    const opts = { apiKey: config.openaiApiKey };
    if (config.openaiBaseUrl) opts.baseURL = config.openaiBaseUrl;
    if (config.openaiOrgId) opts.organization = config.openaiOrgId;
    _client = new OpenAI(opts);
  }
  return _client;
}

const FILTER_SYSTEM_PROMPT = `You are a research paper curator. Your task is to evaluate the relevance of academic papers to a specific set of research interests.

Rate each paper on a scale of 1-10 based on:
- How closely its topic aligns with the given research interests
- The significance and novelty of its approach
- Whether it introduces breakthrough methods or ideas

Be selective but fair. Return ONLY a valid JSON array — no extra text, no markdown fences.`;

/**
 * Filter papers by relevance score using AI.
 *
 * @param {Array<object>} papers - Paper objects from fetcher
 * @returns {Promise<Array<object>>} Papers with `relevanceScore` added, sorted by score desc
 */
export async function filterPapers(papers) {
  if (!papers.length) return [];

  console.log(`🔍 Filtering ${papers.length} papers with AI (model: ${config.filterModel})…`);

  const batchSize = 10;
  const scored = [];

  for (let i = 0; i < papers.length; i += batchSize) {
    const batch = papers.slice(i, i + batchSize);
    console.log(`   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(papers.length / batchSize)} (${batch.length} papers)`);

    const results = await retry(() => scoreBatch(batch), {
      label: `filter batch ${Math.floor(i / batchSize) + 1}`,
    });

    for (let j = 0; j < batch.length; j++) {
      if (results[j]) {
        scored.push({ ...batch[j], relevanceScore: results[j].score, relevanceReason: results[j].reason });
      }
    }
  }

  // Filter by minimum score and sort
  const filtered = scored
    .filter((p) => p.relevanceScore >= config.minRelevanceScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(`   Kept ${filtered.length} papers (score >= ${config.minRelevanceScore})`);
  return filtered;
}

/**
 * Score a batch of papers via the AI model.
 */
async function scoreBatch(batch) {
  const client = getClient();

  const paperListText = batch
    .map(
      (p, i) =>
        `\n--- Paper ${i} ---\nTitle: ${p.title}\nAbstract: ${p.abstract}\nCategories: ${p.categories.join(', ')}\nAuthors: ${p.authors.slice(0, 5).join(', ')}`
    )
    .join('\n');

  const userPrompt = `Research interests:
${config.researchInterests.map((s) => `- ${s}`).join('\n')}

Papers to evaluate:
${paperListText}

Return a JSON array with one object per paper. Each object must have:
- "score": integer 1-10 (relevance to research interests)
- "reason": brief one-sentence explanation (in Chinese)

Example: [{"score":8,"reason":"提出了基于GRPO的图谱演化范式，与GraphRAG和强化学习高度相关"},{"score":3,"reason":"偏向硬件优化，与当前关注方向关联较弱"}]

Return ONLY the JSON array, no other text:`;

  const response = await client.chat.completions.create({
    model: config.filterModel,
    messages: [
      { role: 'system', content: FILTER_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });

  const raw = response.choices[0]?.message?.content?.trim() || '[]';
  return parseJsonResponse(raw, batch.length);
}

/** Safely parse the AI's JSON response, with fallback. */
function parseJsonResponse(raw, expectedLength) {
  // Try direct parse first
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) { /* fall through */ }

  // Try extracting JSON from markdown code fences
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch (_) { /* fall through */ }
  }

  // Fallback: empty scores
  console.warn('   ⚠️  Could not parse filter response, skipping batch');
  return new Array(expectedLength).fill(null);
}
