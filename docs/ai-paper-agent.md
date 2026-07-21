# AI paper agent

This repository contains an arXiv paper-curation agent that fetches recent video/multimodal/agent-related papers, filters them with an OpenAI-compatible model, generates summaries, writes Markdown posts, and opens a pull request through GitHub Actions.

## Entry points

Root package commands:

```bash
npm run agent
npm run agent:run
npm run agent:test
```

Script package commands:

```bash
cd scripts
npm install
npm run agent
```

Main implementation:

```text
scripts/agent/
├── config.js
├── fetcher.js
├── filter.js
├── summarizer.js
├── generator.js
├── writer.js
├── retry-utils.js
└── main.js
```

Workflow:

```text
.github/workflows/fetch-papers.yml
```

## Local run

```bash
cd scripts
npm install
OPENAI_API_KEY=<OPENAI_API_KEY> npm run agent
```

For fetch-only smoke testing from the root package:

```bash
npm run agent:test
```

## GitHub Actions schedule

The workflow currently runs twice daily:

- UTC 20:00 / Beijing 04:00
- UTC 08:00 / Beijing 16:00

It can also be triggered manually from the GitHub Actions page.

## Required secret

```text
OPENAI_API_KEY
```

## Optional secrets

```text
OPENAI_BASE_URL
OPENAI_ORG_ID
AI_FILTER_MODEL
AI_SUMMARIZE_MODEL
MIN_RELEVANCE_SCORE
MAX_PAPERS_PER_DAY
GENERATE_ENGLISH
LOG_LEVEL
VERBOSE
```

These are configured in GitHub repository Settings → Secrets and variables → Actions.

## Output

Generated posts are intended for:

```text
src/content/blog/posts/daily-papers/
```

The workflow creates a pull request rather than committing directly to `main`, so paper quality and summary accuracy can be reviewed before publication.

## Review checklist for generated PRs

- Paper relevance to video understanding, MLLM, agents, or Qianke's active research lines
- Summary factuality and no hallucinated claims
- Correct arXiv URL / PDF URL / authors / date
- Correct bilingual generation if English output is enabled
- No duplicated paper already present in the blog
- Markdown frontmatter parses correctly
- `npm run build` passes

## Configuration notes

The canonical code config is `scripts/agent/config.js`.

Avoid hard-coding private keys or provider-specific credentials. Prefer environment variables and GitHub Actions secrets.

The previous documentation mentioned older model defaults and cost-optimization suggestions. For this repository, model choices should follow the configured environment and quality needs; do not downgrade models solely for cost without explicit instruction.

## Failure handling

If the workflow fails:

1. Inspect the GitHub Actions logs.
2. Check whether secrets are configured.
3. Run `npm run agent:test` locally to isolate arXiv fetching.
4. Run `cd scripts && npm run agent` locally with an explicit API key to isolate model/provider issues.
5. Fix code/config, then verify with root `npm run lint` and `npm run build` if generated content changed.