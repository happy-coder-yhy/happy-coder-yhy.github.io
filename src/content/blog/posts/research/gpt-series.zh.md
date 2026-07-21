---
title: '论文笔记：GPT 系列 — 从生成式预训练到大语言模型'
date: '2026-07-05'
summary: '梳理 GPT 系列从 GPT-1 到 GPT-4 的技术演化路线，重点关注各代模型的架构选择、训练策略和规模化规律。'
tags: ['GPT', '大语言模型', '生成式AI', 'OpenAI', '经典论文']
category: 'research'
status: 'published'
year: 2018
venue: 'OpenAI Technical Report'
---

## GPT 系列演化概览

| 模型 | 时间 | 参数量 | 关键技术 | 论文 |
|------|------|--------|---------|------|
| GPT-1 | 2018.06 | 117M | 生成式预训练+微调 | Improving Language Understanding by Generative Pre-Training |
| GPT-2 | 2019.02 | 1.5B | Zero-shot 迁移 | Language Models are Unsupervised Multitask Learners |
| GPT-3 | 2020.05 | 175B | In-context Learning | Language Models are Few-Shot Learners |
| GPT-4 | 2023.03 | 未公开 | 多模态+对齐 | GPT-4 Technical Report |

## GPT-1：范式开创

### 核心思想

两阶段训练：
1. **无监督预训练**：在大规模文本语料上训练自回归语言模型
2. **有监督微调**：在特定任务数据上微调

### 架构

- 12 层 Transformer **Decoder**（仅保留 Decoder，不使用 Encoder）
- 单向（从左到右）的自回归预测
- 与 BERT 的核心区别：GPT 用 Decoder-only，BERT 用 Encoder-only

## GPT-2：Zero-shot 迁移

### 核心发现

**大模型 + 大数据 = Zero-shot能力**

- 1.5B 参数，在 40GB 的 WebText 数据集上训练
- 不需要微调，仅通过提示（prompt）即可完成多种下游任务

### 重要技术细节

- LayerNorm 移到每个子层的输入处（Pre-LN）
- 在最后的 Self-Attention 层后添加额外的 LayerNorm
- 词汇量扩展到 50,257

## GPT-3：In-context Learning

### 规模化

- 175B 参数，训练数据 ~570GB
- 发现模型在足够大时出现涌现能力（Emergent Abilities）

### In-context Learning

给定一些示例（few-shot），模型可以在不更新参数的情况下完成新任务：

```
将英文翻译成中文：
sea otter => 海獭
peppermint => 薄荷
plush girafe =>
```

GPT-3 直接输出 "长颈鹿玩偶"，无需任何梯度更新。

## GPT-4：多模态与对齐

### 主要进展

- 支持图文多模态输入
- 通过 RLHF 显著提升有用性和安全性
- 在多项专业考试中达到人类水平

## 个人思考

1. GPT 系列的成功验证了 **Scaling Law** — 模型性能与参数量、数据量、计算量呈幂律关系
2. Decoder-only 架构最终成为了 LLM 的主流选择（GPT, LLaMA, PaLM 等）
3. In-context Learning 是一种全新的范式，它模糊了训练和推理的边界
4. 从 GPT-3 到 GPT-4 的跃迁表明，**对齐（Alignment）** 与 **规模化** 同样重要

## 延伸阅读

- [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Training language models to follow instructions (InstructGPT)](https://arxiv.org/abs/2203.02155)
- [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971)
