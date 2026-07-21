# 孟乾轲个人主页与博客系统

[![Deploy](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/deploy.yml)
[![Fetch Papers](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/fetch-papers.yml/badge.svg)](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/fetch-papers.yml)

基于 Next.js 15 的双语个人主页、博客与论文展示系统，静态导出并部署到 GitHub Pages。

- 在线地址：https://qiankemeng.github.io/
- 仓库：https://github.com/qiankemeng/qiankemeng.github.io
- 维护者：乾轲 / 小秘

## 当前能力

- 中英文双语主页与内容页
- 响应式布局与暗黑模式
- 静态导出，部署到 GitHub Pages
- Markdown/MDX 博客系统
- 研究项目、论文、经历与联系方式展示
- Decap CMS 本地内容管理入口
- GitHub Actions 自动部署
- arXiv 论文自动抓取、筛选、总结与 PR 创建流程

## 项目结构

```text
.
├── src/
│   ├── app/                  # Next.js App Router 页面
│   ├── components/           # 共享组件
│   ├── sections/             # 首页和列表页区块
│   ├── content/              # 双语内容、博客文章、项目和经历数据
│   ├── config/               # 站点配置
│   ├── hooks/                # React hooks
│   ├── lib/                  # 内容读取、工具函数、RSS/sitemap 逻辑
│   └── types/                # TypeScript 类型
├── public/
│   ├── admin/                # Decap CMS 配置与入口
│   ├── images/               # 图片与二维码
│   ├── papers/               # 论文 PDF
│   └── resume.pdf            # 简历/CV
├── scripts/
│   ├── agent/                # arXiv paper agent
│   ├── create-post.js        # 手动创建博客文章
│   └── import-paper.js       # 导入论文内容
├── docs/
│   ├── ai-paper-agent.md     # 自动论文 agent 说明
│   └── cms.md                # CMS 使用与故障排查
├── .github/workflows/        # GitHub Actions
├── AGENTS.md                 # Agent/维护规则
└── README.md                 # 项目入口
```

## 快速开始

要求：Node.js 20+，npm，Git。

```bash
npm ci
npm run dev
```

访问：

- 主站：http://localhost:3000
- CMS：http://localhost:3000/admin

## 常用命令

```bash
npm ci                  # 安装锁定依赖
npm run dev             # 本地开发
npm run lint            # ESLint / Next.js 检查
npm run build           # 静态构建，输出到 out/
npm run export          # build alias
npm run create-post     # 交互式创建博客文章
npm run import-paper    # 导入论文
npm run agent           # 运行 arXiv paper agent
npm run agent:run       # agent alias
npm run agent:test      # 测试 arXiv fetcher
```

维护提交前至少运行：

```bash
npm run lint
npm run build
```

## 内容维护

核心内容路径：

- 主页/项目/研究/经历数据：`src/content/`
- 博客文章：`src/content/blog/posts/{research,tutorials,notes,others}/`
- 站点元信息：`src/config/site.ts`
- 静态资源：`public/images/`、`public/papers/`、`public/resume.pdf`

博客文件命名：

```text
{slug}.zh.md
{slug}.en.md
```

frontmatter 最小格式：

```markdown
---
title: "文章标题"
date: "2026-04-30"
summary: "简短摘要"
tags: ["tag1", "tag2"]
---

正文内容...
```

## CMS

当前 CMS 默认使用本地开发模式，适合个人维护，不依赖生产 OAuth。

```bash
npx decap-server
npm run dev
```

然后访问：http://localhost:3000/admin

详见：`docs/cms.md`

## AI paper agent

自动论文流程由 `.github/workflows/fetch-papers.yml` 定时触发，也可本地运行：

```bash
cd scripts
npm install
npm run agent
```

必需环境变量：`OPENAI_API_KEY`。

详见：`docs/ai-paper-agent.md`

## 环境变量

参考 `.env.example`。不要提交 `.env.local` 或任何真实密钥。

常用变量：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `AI_FILTER_MODEL`
- `AI_SUMMARIZE_MODEL`

GitHub Actions secrets 仅在仓库 Settings 中配置，不写入源码。

## 部署

`.github/workflows/deploy.yml` 在 `main` 分支 push 后自动：

1. 使用 Node.js 20 安装依赖；
2. 执行 `npm run build`；
3. 上传 `out/`；
4. 部署到 GitHub Pages。

## 当前维护重点

- 保持主页内容、论文、项目、CV 与真实学术状态同步；
- 保持中英文内容一致；
- 维护 lint/build 绿色；
- 逐步处理 `npm audit` 漏洞，保持静态导出可构建；
- 避免恢复旧的重复文档。