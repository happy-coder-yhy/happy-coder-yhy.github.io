# Repository Guidelines

## Project role

This repository is Qianke Meng's public personal homepage, blog, research portfolio, and AI paper-curation workflow.

The live site is statically exported with Next.js and deployed to GitHub Pages at:

```text
https://qiankemeng.github.io/
```

小秘 is allowed to maintain this repository directly after normal verification. Do not push unless the task explicitly requires it or Qianke asks for it.

## Read first

Before changing code or content, read:

1. `README.md` — human entrypoint and current project shape
2. `AGENTS.md` — this maintenance contract
3. relevant docs under `docs/`
4. current git status and diff

For CMS changes, read `docs/cms.md`.
For the arXiv paper agent or GitHub Actions paper workflow, read `docs/ai-paper-agent.md`.

## Project structure

- `src/app/` — Next.js App Router pages; Chinese root routes and `/en` English routes
- `src/components/` — shared UI components
- `src/sections/` — page sections and listing blocks
- `src/content/` — localized JSON content, project/research data, blog posts
- `src/config/` — site metadata and global config
- `src/lib/` — content loaders, RSS/sitemap helpers, utilities
- `src/hooks/` — React hooks
- `src/types/` — TypeScript types
- `public/` — static assets, papers, resume, CMS entry
- `scripts/` — content utilities and AI paper agent
- `docs/` — canonical operational docs
- `.github/workflows/` — GitHub Pages deploy and paper-agent workflows

## Commands

Install:

```bash
npm ci
```

Develop:

```bash
npm run dev
```

Validate before commit:

```bash
npm run lint
npm run build
```

Content helpers:

```bash
npm run create-post
npm run import-paper
```

AI paper agent:

```bash
npm run agent
npm run agent:run
npm run agent:test
```

## Coding style

- TypeScript for application code.
- Component files: PascalCase when creating new standalone components; preserve existing filenames when editing.
- Hooks start with `use`.
- Locale data files use `*.zh.json` / `*.en.json`.
- Use two-space indentation.
- Prefer named exports except for Next.js route/page components.
- Do not manually fight formatting; keep ESLint/Prettier-compatible code.

## Content rules

- Keep Chinese and English pages semantically aligned.
- Public personal information, paper status, affiliations, project status, and CV links must be accurate.
- Blog posts use `{slug}.zh.md` and `{slug}.en.md` when bilingual.
- Static PDFs/images belong under `public/`, but do not commit private drafts or large temporary artifacts.
- If an academic status is uncertain, mark it conservatively rather than overstating it.

## Environment and secrets

- Never commit `.env.local`, real API keys, OAuth secrets, CMS tokens, private cookies, or generated credentials.
- Add new environment variables to `.env.example` with placeholders only.
- GitHub Actions secrets live in repository settings only.
- `.env.example` may include public `NEXT_PUBLIC_*` values but must not include real private secrets.

## Git and verification discipline

Before edits:

```bash
git status --short --branch
git diff --stat
```

After edits:

```bash
npm run lint
npm run build
git diff --check
```

Commit policy:

- Use Conventional Commits, e.g. `docs: consolidate project documentation`.
- Commit verified maintenance changes directly when the repository is under 小秘 maintenance.
- Do not push by default.
- Do not leave unrelated generated files staged.

## Documentation policy

Canonical docs are intentionally minimal:

- `README.md` — main project entrypoint
- `AGENTS.md` — maintenance contract
- `docs/cms.md` — CMS usage and troubleshooting
- `docs/ai-paper-agent.md` — paper agent and workflow setup

Do not recreate deleted legacy top-level docs unless Qianke explicitly asks. Merge useful information into the canonical docs instead.

## Known gaps

- No test suite is wired yet; lint and build are the current quality gates.
- Dependency audit currently reports zero vulnerabilities; keep dependency upgrades verified with lint/build.
- CMS production OAuth is not the default path; local CMS mode is the maintained default unless a remote editing workflow is explicitly needed.