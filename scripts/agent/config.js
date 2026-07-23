/**
 * Configuration management for the AI paper agent.
 *
 * Priority: environment variable > default value.
 * In GitHub Actions, secrets are injected as env vars.
 * Locally, dotenv loads the root .env file.
 */

import { config as loadDotenv } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load root .env for local development (no-op in CI where vars are already set)
loadDotenv({ path: resolve(__dirname, '../../../.env') });

const config = {
  // ---- OpenAI / AI provider ----
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || '',
  openaiOrgId: process.env.OPENAI_ORG_ID || '',

  // ---- AI models ----
  filterModel: process.env.AI_FILTER_MODEL || 'gpt-5-mini',
  summarizeModel: process.env.AI_SUMMARIZE_MODEL || 'gpt-5.2-thinking',

  // ---- Filter settings ----
  minRelevanceScore: parseInt(process.env.MIN_RELEVANCE_SCORE || '6', 10),
  maxPapersPerDay: parseInt(process.env.MAX_PAPERS_PER_DAY || '5', 10),

  // ---- Output settings ----
  generateEnglish: process.env.GENERATE_ENGLISH !== 'false',

  // ---- Logging ----
  logLevel: process.env.LOG_LEVEL || 'info',
  verbose: process.env.VERBOSE === 'true',

  // ---- arXiv API settings ----
  arxiv: {
    baseUrl: 'http://export.arxiv.org/api/query',
    maxResults: 50,
    lookbackDays: 3,
    categories: [
      'cs.AI',   // Artificial Intelligence
      'cs.CL',   // Computation and Language
      'cs.IR',   // Information Retrieval
      'cs.LG',   // Machine Learning
      'cs.MA',   // Multi-Agent Systems
      'cs.CV',   // Computer Vision (multimodal)
    ],
  },

  // ---- Output directories ----
  outputDir: resolve(__dirname, '../../../src/content/blog/posts/daily-papers'),

  // ---- Research interests (used in filter prompt) ----
  researchInterests: [
    'GraphRAG / Graph-based Retrieval-Augmented Generation',
    'Knowledge Graphs for LLMs and reasoning',
    'LLM Agents and Multi-Agent Systems',
    'Retrieval-Augmented Generation (RAG) and its variants',
    'Reinforcement Learning for LLMs (RLHF, GRPO, etc.)',
    'Multimodal AI / Vision-Language Models',
    'Self-evolving / self-improving AI systems',
    'Efficient LLM inference and training',
    'Foundation models and pre-training',
    'Video understanding and generation',
  ],
};

// ---- Derived helpers ----

/** Whether an OpenAI-compatible API key is available. */
config.hasApiKey = () => Boolean(config.openaiApiKey);

export default config;
