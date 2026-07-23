/**
 * arXiv paper fetcher.
 *
 * Queries the arXiv API for recent papers in configured categories,
 * returning a deduplicated list of paper metadata.
 *
 * Can be run standalone for smoke testing:
 *   node agent/fetcher.js
 */

import { fileURLToPath } from 'url';
import config from './config.js';

const FETCH_TIMEOUT_MS = 30000; // 30-second timeout for arXiv API

/**
 * Build the arXiv search query string.
 * Searches for recent papers across all configured categories.
 */
function buildSearchQuery() {
  const cats = config.arxiv.categories.map((c) => `cat:${c}`).join('+OR+');
  return `(${cats})`;
}

/**
 * Fetch recent papers from arXiv.
 *
 * @returns {Promise<Array<{arxId, title, abstract, authors, categories, published, pdfUrl, arxivUrl}>>}
 */
export async function fetchRecentPapers() {
  const query = buildSearchQuery();
  const params = new URLSearchParams({
    search_query: query,
    start: '0',
    max_results: String(config.arxiv.maxResults),
    sortBy: 'submittedDate',
    sortOrder: 'descending',
  });

  const url = `${config.arxiv.baseUrl}?${params.toString()}`;
  console.log(`📡 Fetching papers from arXiv…`);
  console.log(`   URL: ${url}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      headers: { 'Accept': 'application/atom+xml' },
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`arXiv API request timed out after ${FETCH_TIMEOUT_MS / 1000}s`);
    }
    throw new Error(`arXiv API request failed: ${err.message || err.cause || String(err)}`);
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`arXiv API returned HTTP ${response.status}`);
  }

  const xml = await response.text();
  const papers = parseArxivAtom(xml);
  console.log(`   Received ${papers.length} papers from arXiv`);
  return papers;
}

/**
 * Parse arXiv Atom XML response into paper objects.
 */
function parseArxivAtom(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const e = match[1];
    const id = extractTag(e, 'id');
    const arxId = id.replace(/^https?:\/\/arxiv\.org\/abs\//, '').trim();

    entries.push({
      arxId,
      title: cleanText(extractTag(e, 'title')),
      abstract: cleanText(extractTag(e, 'summary')),
      authors: extractAllTags(e, 'name'),
      categories: extractAllTags(e, 'category').map((c) =>
        c.replace(/^http:\/\/arxiv\.org\/schemas\/atom/, '').trim()
      ),
      published: extractTag(e, 'published'),
      updated: extractTag(e, 'updated'),
      pdfUrl: `https://arxiv.org/pdf/${arxId}`,
      arxivUrl: `https://arxiv.org/abs/${arxId}`,
    });
  }

  return entries;
}

/** Extract the text content of the first matching XML tag. */
function extractTag(str, tag) {
  const m = str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : '';
}

/** Extract all text contents of a repeating XML tag. */
function extractAllTags(str, tag) {
  const results = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
  let m;
  while ((m = re.exec(str)) !== null) {
    results.push(m[1].trim());
  }
  return results;
}

/** Collapse whitespace and strip newlines from text. */
function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// ---- Standalone smoke-test entry point ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchRecentPapers()
    .then((papers) => {
      console.log(`\n✅ Fetched ${papers.length} papers:\n`);
      papers.slice(0, 10).forEach((p, i) => {
        console.log(`${i + 1}. [${p.arxId}] ${p.title}`);
        console.log(`   Authors: ${p.authors.slice(0, 3).join(', ')}${p.authors.length > 3 ? ' et al.' : ''}`);
        console.log(`   URL: ${p.arxivUrl}`);
        console.log();
      });
    })
    .catch((err) => {
      console.error('❌ Failed to fetch papers:', err.message);
      console.error('');
      console.error('💡 Note: arXiv API may not be accessible from your network.');
      console.error('   The GitHub Actions workflow runs on US servers and should work fine.');
      process.exit(1);
    });
}
