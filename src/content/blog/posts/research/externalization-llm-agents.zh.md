---
title: '论文笔记：Externalization in LLM Agents — 记忆、技能、协议与 Harness 工程统一综述'
date: '2026-07-20'
summary: '系统梳理 LLM Agent 知识外化的四大维度：记忆系统（Memory）、技能编排（Skills）、通信协议（Protocols）与 Harness 工程。本文构建了一个统一的分析框架，帮助理解 Agent 系统的设计与评估。'
tags: ['LLM Agent', '知识外化', '记忆系统', '综述', 'Harness']
category: 'research'
venue: '2026'
status: 'published'
year: 2026
---

## 论文信息

- **标题**：Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering
- **作者**：Zhou 等
- **年份**：2026
- **类型**：综述（Review）

## 核心框架：四维知识外化

本文提出了 LLM Agent 中知识外化的统一框架，包含四个核心维度：

### 1. 记忆系统（Memory）

Agent 的记忆管理是知识外化的基础，主要包括：
- **短期记忆**：上下文窗口内的信息维护
- **长期记忆**：跨会话的知识持久化与检索
- **工作记忆**：当前任务执行过程中的临时状态

### 2. 技能编排（Skills）

Agent 如何组织和调用其能力：
- **工具使用（Tool Use）**：调用外部 API 和工具
- **技能组合（Skill Composition）**：将多个技能串联为复杂工作流
- **能力发现（Capability Discovery）**：动态识别和获取新技能

### 3. 通信协议（Protocols）

Agent 内部及 Agent 间的通信机制：
- **MCP（Model Context Protocol）**：标准化的工具接入协议
- **Agent 间通信**：多 Agent 协作的消息传递
- **人机交互**：Agent 与用户的交互接口

### 4. Harness 工程

Agent 系统的工程化基础设施：
- **实验平台**：统一的实验管理与追踪
- **评估框架**：多维度 Agent 性能评测
- **部署运维**：Agent 系统的生产化部署

## 个人思考

1. **知识外化是 Agent 能力的放大器**：LLM 本身的知识局限于训练数据，外化机制让 Agent 能够利用外部记忆、工具和协作来突破这一限制。

2. **MCP 协议的重要性**：作为标准化的工具接入协议，MCP 大大降低了 Agent 工具集成的复杂度，是实现可扩展 Agent 系统的关键基础设施。

3. **从单 Agent 到多 Agent 系统**：通信协议维度的引入标志着 Agent 研究从单体智能向群体智能的演进。

4. **工程化是落地关键**：Harness 工程维度提醒我们，Agent 系统不仅仅是算法问题，实验追踪、评估体系和生产部署同样重要。

## 与 Zata 数采平台 Agent 的关联

本文的框架与我在 Zata 数采平台中构建的 Agent 系统高度相关：
- 使用 MCP Tools 实现标准化的工具接入
- 基于 Harness Agent 范式进行任务编排
- 支持多角色（管理员、采集员）的协作模式

## 延伸阅读

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [AutoGPT: Autonomous Task Management with LLMs](https://github.com/Significant-Gravitas/AutoGPT)
