/**
 * AI Paper Agent — Main Orchestrator
 *
 * Pipeline:
 *   1. Fetch recent papers from arXiv
 *   2. Filter by relevance using AI
 *   3. Generate detailed Chinese (and optionally English) summaries
 *   4. Write markdown files to the daily-papers directory
 *
 * Usage:
 *   node agent/main.js
 */

import config from './config.js';
import { fetchRecentPapers } from './fetcher.js';
import { filterPapers } from './filter.js';
import { summarizePaperZh, summarizePaperEn } from './summarizer.js';
import { writePaperZh, writePaperEn } from './writer.js';

async function main() {
  console.log('╔════════════════════════════════════╗');
  console.log('║   🤖 AI Paper Agent               ║');
  console.log('╚════════════════════════════════════╝');
  console.log();

  // ---- Validate configuration ----
  if (!config.hasApiKey()) {
    console.error('❌ OPENAI_API_KEY is not set. Aborting.');
    console.error('   Set it via environment variable or in the root .env file.');
    process.exit(1);
  }

  console.log('⚙️  Configuration:');
  console.log(`   Filter model:     ${config.filterModel}`);
  console.log(`   Summarize model:  ${config.summarizeModel}`);
  console.log(`   Min relevance:    ${config.minRelevanceScore}/10`);
  console.log(`   Max papers/day:   ${config.maxPapersPerDay}`);
  console.log(`   Generate English: ${config.generateEnglish}`);
  console.log(`   Output dir:       ${config.outputDir}`);
  console.log();

  // ---- Step 1: Fetch papers ----
  console.log('━'.repeat(50));
  console.log('Step 1/4: Fetching recent papers from arXiv');
  console.log('━'.repeat(50));

  let papers;
  try {
    papers = await fetchRecentPapers();
  } catch (err) {
    console.error(`❌ Failed to fetch papers: ${err.message}`);
    process.exit(1);
  }

  if (!papers.length) {
    console.log('ℹ️  No new papers found. Exiting.');
    process.exit(0);
  }

  // ---- Step 2: Filter by relevance ----
  console.log();
  console.log('━'.repeat(50));
  console.log('Step 2/4: Filtering papers by relevance');
  console.log('━'.repeat(50));

  let relevant;
  try {
    relevant = await filterPapers(papers);
  } catch (err) {
    console.error(`❌ Failed to filter papers: ${err.message}`);
    process.exit(1);
  }

  if (!relevant.length) {
    console.log('ℹ️  No papers met the relevance threshold. Exiting.');
    process.exit(0);
  }

  // Show filtered results
  console.log();
  console.log('📋 Relevant papers:');
  relevant.slice(0, config.maxPapersPerDay).forEach((p, i) => {
    console.log(`   ${i + 1}. [${p.relevanceScore}/10] ${p.title.slice(0, 70)}…`);
    console.log(`      ${p.arxivUrl}`);
  });
  console.log();

  // ---- Step 3: Summarize ----
  console.log('━'.repeat(50));
  console.log('Step 3/4: Generating summaries');
  console.log('━'.repeat(50));

  const topPapers = relevant.slice(0, config.maxPapersPerDay);
  const summaries = [];

  for (let i = 0; i < topPapers.length; i++) {
    const paper = topPapers[i];
    console.log(`\n📄 Paper ${i + 1}/${topPapers.length}: ${paper.title.slice(0, 60)}…`);

    try {
      // Generate Chinese summary
      const zhResult = await summarizePaperZh(paper);

      // Optionally generate English summary
      let enResult = null;
      if (config.generateEnglish) {
        enResult = await summarizePaperEn(paper);
      }

      summaries.push({ paper, zh: zhResult, en: enResult });
    } catch (err) {
      console.error(`   ❌ Failed to summarize: ${err.message}`);
      // Continue with next paper
    }
  }

  // ---- Step 4: Write files ----
  console.log();
  console.log('━'.repeat(50));
  console.log('Step 4/4: Writing output files');
  console.log('━'.repeat(50));

  let newCount = 0;
  for (const { paper, zh, en } of summaries) {
    if (zh && zh.content) {
      const result = await writePaperZh(paper, zh.content);
      if (result.isNew) newCount++;
    }
    if (en && en.content) {
      await writePaperEn(paper, en.content);
    }
  }

  // ---- Summary ----
  console.log();
  console.log('╔════════════════════════════════════╗');
  console.log('║   ✅ Done!                        ║');
  console.log('╚════════════════════════════════════╝');
  console.log();
  console.log(`   Papers fetched:    ${papers.length}`);
  console.log(`   Papers relevant:   ${relevant.length}`);
  console.log(`   Summaries written: ${newCount} new (${summaries.length} total attempted)`);
  console.log();
}

main().catch((err) => {
  console.error('\n❌ Unexpected error:', err);
  process.exit(1);
});
