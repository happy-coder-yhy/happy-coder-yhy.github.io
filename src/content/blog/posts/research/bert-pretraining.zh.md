---
title: '论文笔记：BERT — 深度双向 Transformer 预训练'
date: '2026-07-10'
summary: 'BERT 通过掩码语言模型（MLM）和下一句预测（NSP）两个预训练任务，首次实现了真正的双向上下文建模，刷新了 11 项 NLP 基准。本文剖析其设计哲学与技术细节。'
tags: ['BERT', '预训练', 'NLP', 'Transformer', '经典论文']
category: 'research'
venue: 'NAACL 2019'
status: 'published'
year: 2019
arxiv: 'https://arxiv.org/abs/1810.04805'
---

## 论文信息

- **标题**：BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
- **作者**：Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI)
- **会议**：NAACL 2019
- **引用量**：80,000+

## 动机

在 BERT 之前，语言模型预训练主要有两种范式：

1. **自回归（AR）**：如 GPT，从左到右预测下一个词，只能利用单向上下文
2. **自编码（AE）**：如 ELMo，使用独立的左右 LSTM 分别建模再拼接

BERT 的核心洞察：**单向性**是限制预训练表示能力的关键瓶颈。如果能设计一个真正双向的预训练目标，就能获得更强大的语言表示。

## 核心方法

### 预训练任务一：Masked Language Model (MLM)

随机遮盖 15% 的输入 token，让模型基于双向上下文预测被遮盖的词：

```
Input:  The man went to the [MASK] to buy some milk.
Output: The man went to the store to buy some milk.
```

**技巧**：为避免预训练-微调不匹配（微调时没有 [MASK] token），被选中的 15% token 中：
- 80% 替换为 `[MASK]`
- 10% 替换为随机词
- 10% 保持不变

### 预训练任务二：Next Sentence Prediction (NSP)

判断两个句子是否是连续的：

```
Input:  [CLS] the man went to the store [SEP] he bought a gallon of milk [SEP]
Output: IsNext
```

**后续争议**：后来的工作（如 RoBERTa）发现 NSP 的作用有限，移除 NSP 有时甚至能提升性能。

### 输入表示

每个 token 的输入 = Token Embedding + Segment Embedding + Position Embedding

- `[CLS]`：用于分类任务的聚合表示
- `[SEP]`：分隔两个句子

### 微调

BERT 在 11 项 NLP 任务上微调，涵盖四类：
- **句对分类**：MNLI, QQP, QNLI, STS-B, MRPC, RTE, SWAG
- **单句分类**：SST-2, CoLA
- **问答**：SQuAD v1.1, v2.0
- **序列标注**：NER (CoNLL-2003)

## 关键创新点

1. **真正的双向上下文建模**：MLM 让模型同时利用左右两侧信息
2. **统一的预训练-微调范式**：同一架构适应几乎所有 NLP 任务
3. **"大力出奇迹"的早期证明**：足够大的模型 + 足够多的数据 = 强大的通用表示

## 个人思考

1. BERT 开启了 NLP 的 "ImageNet 时刻"——预训练大模型 + 下游微调成为标准范式
2. MLM 的 15% 遮盖率是一个经验性的选择，需要权衡训练效率与任务难度
3. BERT 的局限性也很明显：不能生成文本（因为是双向的），不适合自回归任务
4. 理解 BERT 与 GPT 的区别（Encoder-only vs Decoder-only）是理解后续 LLM 发展的关键

## 延伸阅读

- [RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692)
- [ALBERT: A Lite BERT for Self-supervised Learning](https://arxiv.org/abs/1909.11942)
- [ELECTRA: Pre-training Text Encoders as Discriminators](https://arxiv.org/abs/2003.10555)
