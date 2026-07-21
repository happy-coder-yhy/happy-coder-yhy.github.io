# 袁皓宇的知识 Wiki

基于 Next.js 15 的个人知识库网站，静态导出并部署到 GitHub Pages。

- 在线地址：https://happy-coder-yhy.github.io/
- 仓库：https://github.com/happy-coder-yhy/happy-coder-yhy.github.io
- 维护者：袁皓宇（Haoyu Yuan）

## 关于我

- **姓名**：袁皓宇（Haoyu Yuan）
- **硕士**：杭州电子科技大学，计算机技术，2026 级
- **本科**：中国民航大学，计算机科学与技术，2022 - 2026
- **研究方向**：LLM Agent 系统、知识外化与智能体协作
- **GitHub**：[happy-coder-yhy](https://github.com/happy-coder-yhy)

## 功能特性

- 🏠 个人主页（关于我、学习经历、项目经历、联系方式）
- 📝 论文笔记 Wiki（Markdown/MDX 内容，支持标签筛选）
- 🌓 深色/浅色主题切换
- 🌐 中英双语支持
- 📡 RSS 订阅（/feed.xml）
- 🗺️ 自动生成站点地图（/sitemap.xml）
- 🚀 GitHub Actions 自动部署

## 项目结构

```text
.
├── src/
│   ├── app/                  # Next.js App Router 页面
│   ├── components/           # 共享组件
│   ├── sections/             # 首页区块
│   ├── content/              # 双语内容、博客文章、项目与经历数据
│   ├── config/               # 站点配置
│   ├── hooks/                # React hooks
│   ├── lib/                  # 内容读取、工具函数
│   └── types/                # TypeScript 类型
├── public/
│   └── images/               # 图片资源
├── .github/workflows/        # GitHub Actions 部署
└── README.md
```

## 快速开始

```bash
npm ci
npm run dev
```

访问 http://localhost:3000

## 常用命令

```bash
npm run dev        # 本地开发
npm run build      # 静态构建，输出到 out/
npm run lint       # ESLint 检查
```

## 内容维护

- 主页/项目/研究/经历数据：`src/content/`
- 博客文章：`src/content/blog/posts/{research,tutorials,notes,others}/`
- 站点元信息：`src/config/site.ts`

博客文件命名：`{slug}.zh.md` / `{slug}.en.md`

## 部署

`.github/workflows/deploy.yml` 在 `main` 分支 push 后自动：构建 → 上传 `out/` → 部署到 GitHub Pages。
