---
title: 'Paper Notes: VideoAgent — Long-Video Understanding through Unified Memory and Tools'
date: '2026-11-10'
summary: 'VideoAgent converts long videos into temporal memory and object memory, then lets an LLM answer questions through segment localization, caption retrieval, visual QA, and object-database queries. Its central idea is to use a minimal but sufficient structured memory and tool loop instead of asking one end-to-end model to retain every event, object, and temporal relation.'
tags: ['Video Understanding', 'Multimodal Agent', 'Long-term Memory', 'Tool Use', 'Embodied AI']
category: 'research'
venue: 'ECCV 2024'
status: 'published'
year: 2024
arxiv: 'https://arxiv.org/abs/2403.11481'
project_page: 'https://videoagent.github.io/'
---

## Paper Info

- **Title**: VideoAgent: A Memory-augmented Multimodal Agent for Video Understanding
- **Authors**: Yue Fan, Xiaojian Ma, Rujie Wu, Yuntao Du, Jiaqi Li, Zhi Gao, Qing Li
- **Year**: 2024
- **Type**: Research Paper
- **Version**: arXiv:2403.11481v2, July 15, 2024; published at ECCV 2024
- **Resources**: [Paper](https://arxiv.org/abs/2403.11481) · [Project page and demo](https://videoagent.github.io/)

## Core Framework: A Queryable Unified Memory for Long Videos

VideoAgent addresses the cost and attention limits of end-to-end long-video processing with an offline memory construction stage and an online tool-use loop. The input video is converted into two memories; an LLM chooses tools, reads their results, and iterates toward an answer.

### 1. Temporal Memory: Global Event Context

The video is sliced into segments of about two seconds. LaViLa generates an event caption for each segment, ViCLIP extracts video features, and `text-embedding-3-large` embeds the captions. Each temporal-memory entry therefore contains a caption, a visual feature, and a text feature.

Temporal memory is useful for activity context, event order, and coarse temporal localization. It is cheaper to query than raw video, but captions can omit fine visual details.

### 2. Object Memory: Persistent Object Occurrences

Object memory consists of a feature table and an SQL database. RT-DETR and ByteTrack discover and track objects; CLIP and DINOv2 similarities merge multiple tracking IDs into one object ID.

- The feature table supports free-form retrieval such as “red cup.”
- The SQL table stores object ID, category, and the segments in which the object appears.
- Re-identification maintains identity across discontinuous appearances and pose changes.

This separates “what the object looks like” from “where it appears in the video,” which makes later relational queries possible.

### 3. A Minimal Tool Set

VideoAgent centers its pipeline on four tools:

- `caption_retrieval` reads captions between two time steps;
- `segment_localization` returns the top five segments for a text query;
- `visual_question_answering` checks fine visual details in a short segment;
- `object_memory_querying` retrieves object candidates and lets the LLM write SQL for the desired relation.

At every turn, the LLM chooses a tool from the question and the accumulated history, appends the result, and stops when it has enough evidence. Caption retrieval is capped at 15 segments per call to control context length.

### 4. From Question to Answer

The agent first decides whether a question needs global events, a time window, object identity, or local visual evidence. For example, it can locate segments where a boy and adults co-occur, inspect those segments with VQA, and combine the results into an answer.

The LLM handles decomposition, tool selection, and aggregation. Captioning, retrieval, tracking, SQL, and VQA each handle a narrower and more inspectable subproblem.

## Personal Insight

### 1. What Problem Does the Paper Aim to Solve?

The central question is: **how can existing vision, language, and video models cooperate on long videos instead of forcing one end-to-end model to remember every event, object, and relation?**

The paper targets long-range event order, object continuity, and multi-step questions rather than single-frame recognition. It reframes video understanding as memory construction, evidence retrieval, and tool-based reasoning.

### 2. What Previous Work Exists, and What Are Its Pain Points?

- **End-to-end multimodal LLMs** are unified but expensive on long videos and vulnerable to missed long-range relations.
- **General multimodal agents** can call detection and VQA tools, but without video-specific memory they repeatedly inspect frames and struggle with object identity.
- **Narration or key-frame approaches** reduce cost but can discard local evidence, event order, and object-count information.

VideoAgent argues that a small, stable memory-and-tool interface may be more useful than simply increasing context or tool count.

### 3. What Method Addresses These Pain Points?

1. **Unified memory** combines event-level temporal memory with object-level memory for global context and persistent object detail.
2. **Object re-identification** merges tracking IDs with CLIP/DINOv2 features so the same object is not counted repeatedly.
3. **A minimal tool set** combines temporal retrieval, visual verification, and SQL object queries for iterative evidence gathering.
4. **Training-free agent orchestration** reuses existing video models, VLMs, embeddings, and GPT-4's zero-shot tool-use ability.

### 4. How Well Does It Work?

- **EgoSchema:** 60.2% on the full 5,031-question test set and 62.8% on the official 500-question subset, close to Gemini 1.5 Pro and above Video-LLaVA and SeViLA baselines.
- **Ego4D NLQ:** the Ego4D-caption plus ViCLIP variant reaches R1@0.3=17.39 and R1@0.5=7.47 in zero-shot localization. It remains below supervised GroundNLQ but beats several zero-shot alternatives.
- **WorldQA:** 32.53% on open-ended QA and 39.28% on multiple-choice QA. Structured memory helps multiple-choice retrieval, while open-ended generation remains weaker than GPT-4V.
- **NExT-QA:** on a randomly sampled 600-question subset, Temporal, Causal, and Descriptive accuracy are 60.0%, 76.0%, and 76.5%, for a 70.8% average. This subset should not be compared directly with full validation-set scores.
- **Ablations:** caption retrieval alone reaches 40.7% average accuracy; adding database, localization, and VQA raises it to 74.7%. Removing re-ID gives 48.7%, and removing the database gives 62.7%, supporting the importance of identity continuity and local visual verification.

These results support the memory-and-tool design, but the datasets use different models, subsets, and protocols, so the percentages do not form one unified leaderboard.

### 5. What Remains Unresolved?

- **Memory is mostly offline:** the video is sliced, captioned, tracked, and re-identified before answering. Streaming updates and latency are not established.
- **Stored state is not physical state:** object occurrence history does not reliably represent contact, post-action location, or occlusion-induced changes.
- **Captions and re-ID are error sources:** incorrect captions affect localization, while visual similarity can confuse same-category objects; query transparency does not guarantee factual correctness.
- **Tool cost and privacy are underreported:** multiple external models, OpenAI embeddings, and GPT-4 introduce latency, cost, and data-transfer constraints.
- **Training-free does not mean tuning-free:** re-ID weights are grid-searched on EgoObjects, and prompts, tools, and model choices affect results.
- **Distance from embodied memory:** Embodied VideoAgent later adds depth, camera poses, and VLM state updates for dynamic 3D scenes; this paper is the temporal/object-memory foundation.

### 6. Relation to My Research Direction

VideoAgent is a clear early interface for within-task episodic memory: timestamps, object IDs, occurrence segments, and tool results. It does not yet solve evidence lifecycle questions: when to write, when memory expires, how to separate model inference from observed consequences, or how to validate a reusable cross-task skill.

A natural follow-up is to fix the video agent or embodied harness and compare ordinary caption/object memory, memory with depth and temporal evidence, and memory with re-observation gates. Evaluation should track incorrect-memory lifetime, correction delay, false completion judgments, and later transfer rather than final QA accuracy alone.

## Limitations and Open Questions

- Offline preprocessing moves cost from inference to memory construction.
- Text memory improves retrieval but can hide uncertainty in the original visual evidence.
- SQL object relations represent occurrence history well but not dynamic 3D geometry, contact, or causal events.
- The tool loop produces answers but lacks an independent state verifier or failure-recovery mechanism.

## Further Reading

- [VideoAgent, arXiv](https://arxiv.org/abs/2403.11481)
- [Project page and demo](https://videoagent.github.io/)
- [Embodied VideoAgent notes](/en/blog/Embodied-VideoAgent), the follow-up with depth, camera pose, and dynamic state updates
- [Harness VLA notes](/en/blog/HarnessVLA), on frozen-policy execution and recoverable embodied composition
