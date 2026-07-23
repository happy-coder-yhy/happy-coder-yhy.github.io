/**
 * AI-based paper summarizer.
 *
 * Generates detailed paper summaries in the project's canonical format
 * (structured frontmatter + core framework + personal reflections + further reading).
 * Supports both Chinese and English output.
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

/**
 * Generate a Chinese paper summary in the canonical blog-post format.
 *
 * @param {object} paper - Paper object with at least {title, abstract, authors, arxivUrl, published}
 * @returns {Promise<{content: string, metadata: object}>}
 */
export async function summarizePaperZh(paper) {
  console.log(`   📝 Summarizing [ZH]: ${paper.title.slice(0, 60)}…`);
  return summarizePaper(paper, 'zh');
}

/**
 * Generate an English paper summary.
 */
export async function summarizePaperEn(paper) {
  if (!config.generateEnglish) return null;
  console.log(`   📝 Summarizing [EN]: ${paper.title.slice(0, 60)}…`);
  return summarizePaper(paper, 'en');
}

/**
 * Core summarization logic.
 */
async function summarizePaper(paper, lang) {
  const client = getClient();

  const langLabel = lang === 'zh' ? 'Chinese' : 'English';
  const langInstruction = lang === 'zh'
    ? '请用中文撰写'
    : 'Please write in English';

  const systemPrompt = `You are an AI research scientist writing structured paper-notes for a personal knowledge wiki. ${langInstruction}.

You MUST follow the exact format below. Be thorough, critical, and informative. Write as if you are taking notes for your own research — highlight what matters, be honest about limitations, and connect ideas across the literature.

FORMAT (must follow exactly):

---
title: '論文筆記：<Paper Short Title>'   [use Chinese for zh, English for en]
date: '<today YYYY-MM-DD>'
summary: '<2-3 sentence summary capturing the core contribution and result>'
tags: ['<tag1>', '<tag2>', '<tag3>', '<tag4>', '<tag5>']
category: 'research'
venue: '<year or conference>'
status: 'published'
year: <year_number>
---

## 论文信息  [use "## Paper Information" for English]

- **标题**：<Full paper title in original language>  [use **Title** for English]
- **作者**：<Authors>  [use **Authors**]
- **年份**：<Year>  [use **Year**]
- **类型**：研究论文（Research Paper）  [use "Research Paper"]

## 核心框架：<One-line framework description>  [use "## Core Framework: ..." for English]

Brief intro paragraph (2-3 sentences).

### 1. <Component 1 Name>

Detailed explanation.

### 2. <Component 2 Name>

Detailed explanation.

### 3. <Component 3 Name>  [Add more components as needed]

Detailed explanation.

## 个人思考  [use "## Personal Reflections" for English]

### 1. 论文想解决什么问题？  [use "## 1. What problem does this paper solve?" for English]

### 2. 前人已有哪些工作，痛点是什么？  [use "## 2. What prior work exists and what are the pain points?"]

### 3. 本文用了什么创新方法解决了前人的痛点？  [use "## 3. What innovative methods does this paper introduce?"]

### 4. 效果怎么样？  [use "## 4. How well does it perform?"]

### 5. 还有什么不足之处（未来继续深挖的点有哪些）？  [use "## 5. What are the limitations and future directions?"]

## 延伸阅读  [use "## Further Reading"]

- [Related Paper Title 1](URL)
- [Related Paper Title 2](URL)
- [Related Paper Title 3](URL)
- [Related Paper Title 4](URL)

IMPORTANT:
- Write substantive, accurate content for every section. Do not leave placeholders.
- For the "Further Reading" section, suggest 3-5 genuinely related papers with their real arXiv URLs.
- Tags should reflect the paper's core topics (5 tags).
- Do NOT wrap the output in markdown code fences — output raw markdown.
- Make sure the frontmatter is valid YAML inside --- delimiters.`;

  const userPrompt = `Please generate a detailed paper note for the following paper:

Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Abstract: ${paper.abstract}
arXiv ID: ${paper.arxId}
Published: ${paper.published}
URL: ${paper.arxivUrl}

Today's date: ${new Date().toISOString().slice(0, 10)}`;

  const content = await retry(
    async () => {
      const response = await client.chat.completions.create({
        model: config.summarizeModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });

      let text = response.choices[0]?.message?.content?.trim() || '';

      // Strip leading/trailing code fences if present
      text = text.replace(/^```(?:markdown|md)?\s*\n?/, '').replace(/\n?```\s*$/, '');

      return text;
    },
    { label: `summarize ${lang} - ${paper.arxId}`, retries: 3 }
  );

  return { content, paper };
}
