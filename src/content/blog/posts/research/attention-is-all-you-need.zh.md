---
title: '论文笔记：Attention Is All You Need (Transformer)'
date: '2026-07-15'
summary: 'Transformer 架构的提出标志着 NLP 领域的范式转变。本文详细解读其核心组件——Self-Attention、Multi-Head Attention、Positional Encoding，并分析为何它取代 RNN/LSTM 成为主流。'
tags: ['Transformer', '注意力机制', '深度学习', 'NLP', '经典论文']
category: 'research'
venue: 'NeurIPS 2017'
status: 'published'
year: 2017
arxiv: 'https://arxiv.org/abs/1706.03762'
---

## 论文信息

- **标题**：Attention Is All You Need
- **作者**：Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
- **会议**：NeurIPS 2017
- **引用量**：100,000+（截至 2026 年，史上最高引论文之一）

## 动机

在 Transformer 提出之前，序列建模的主流方法是 RNN/LSTM/GRU。这些模型的主要问题：

1. **顺序计算**：RNN 每一步依赖前一步的隐藏状态，无法并行化训练
2. **长程依赖**：虽然 LSTM/GRU 缓解了梯度消失问题，但在非常长的序列上仍然困难
3. **路径长度**：信息在序列中传递的路径长度为 O(n)，n 为序列长度

## 核心方法

### Self-Attention（自注意力）

自注意力机制的核心公式：

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

三个关键设计：
- **Q（Query）**：当前词想要查询什么
- **K（Key）**：当前词能提供什么信息
- **V（Value）**：当前词实际的内容

通过 Q·K^T 计算任意两个位置之间的关联度，使得每个位置的输出可以直接关注到序列中的所有位置。

### Multi-Head Attention（多头注意力）

将 Q、K、V 分别投影到 h 个不同的子空间，在每个子空间独立计算注意力，最后拼接结果：

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

好处：让模型从不同的表示子空间学习不同类型的注意力模式。

### Positional Encoding（位置编码）

由于 Self-Attention 本身是置换等变的（对输入顺序不敏感），需要加入位置信息：

```
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

### 整体架构

- **Encoder**：6 层，每层 = Multi-Head Self-Attention + FFN，两个子层都有残差连接和 LayerNorm
- **Decoder**：6 层，每层 = Masked Multi-Head Self-Attention + Cross-Attention + FFN
- **FFN**：两层全连接，中间使用 ReLU 激活

## 关键创新点

1. **完全并行化**：训练时所有位置同时计算，不需要等待前一步的结果
2. **恒定路径长度**：任意两个位置之间的信息传递路径长度为 O(1)
3. **可解释性**：注意力权重可以可视化，直观展示模型关注的内容

## 个人思考

1. Transformer 的成功不仅仅是工程上的胜利，更是对"上下文建模"这一本质问题的优雅解法
2. 后续的 BERT、GPT 系列本质上是对 Transformer 不同部分（Encoder/Decoder）的极致利用
3. 理解 Self-Attention 的 O(n²) 复杂度是理解后续 Longformer、BigBird 等高效 Transformer 变体的基础

## 延伸阅读

- [BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805)
- [GPT: Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)（强烈推荐的可视化教程）
