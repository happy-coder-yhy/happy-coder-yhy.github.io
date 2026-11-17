---
title: 'Paper Note: VideoARM — Query-Guided Review of Long Videos with Hierarchical Memory'
date: '2026-11-17'
summary: 'VideoARM separates observations, tool results, and reasoning traces so a multimodal agent can narrow its search and examine the local evidence behind an answer. These notes cover missed events, cost measurements, and what would change in online embodied memory.'
tags: ['Long-Form Video Understanding', 'Multimodal Agents', 'Hierarchical Memory', 'Temporal Evidence']
category: 'research'
venue: 'CVPR 2026'
status: 'published'
year: 2026
arxiv: 'https://arxiv.org/abs/2512.12360v2'
github: 'https://github.com/MILVLG/videoarm'
project_page: 'https://milvlg.github.io/videoarm/'
---

## Paper Information

- **Title** — VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding
- **Authors** — Yufei Yin, Qianke Meng, Minghao Chen, Jiajun Ding, Zhenwei Shao, and Zhou Yu
- **Publication and version** — Research paper published at [CVPR 2026](https://openaccess.thecvf.com/content/CVPR2026/html/Yin_VideoARM_Agentic_Reasoning_over_Hierarchical_Memory_for_Long-Form_Video_Understanding_CVPR_2026_paper.html). The methods and numbers below follow the attached [arXiv:2512.12360v2](https://arxiv.org/abs/2512.12360v2) (March 30, 2026).

## Core Framework — Narrowing the Search around a Question

### 1. HM³ stores observations, evidence, and search history separately

- **Sensory Memory** — The long-term pool caches sampled frames from the broad interval currently in focus. The short-term pool temporarily holds frames and audio for a smaller clip and is cleared after analysis. Here, “long-term” refers to the search scope within one question.
- **Result Memory** — Stores the iteration, frame interval, and tool output, such as a scene summary, transcript, or answer and confidence score for a subquestion. The controller can see which intervals have evidence and which warrant another look.
- **Working Memory** — Records the controller’s reasoning traces and objectives before tool calls. Tool context can be cleared after a call while the reason for inspecting a clip remains available to later steps.

### 2. Temporal scoping and multimodal inspection

The Interval Localizer selects a broad candidate interval and a frame count, samples that many evenly spaced frames, and updates the long-term pool with 3 × 2 grids labeled with frame indices. The Scene Snapper summarizes that interval. The Clip Explorer samples a short interval around the current focus and leaves the long-term pool in place. The Audio Transcriber can then use whisper-1 to transcribe local audio, or the Clip Analyzer can inspect local frames and return a subanswer with a confidence score. Scoping tools define what the agent can inspect next, and understanding tools turn those observations into semantic evidence that can be revisited.

### 3. The controller chooses the next step from the evidence

The controller observes, reasons, calls a tool, and writes to memory. It uses existing clues to choose a tool, interval, and subquestion, and can answer early. The default budget is 10 steps, and the framework requires no additional fine-tuning. In Figure 3, the agent uses a scene summary to find an archaeological investigation, then transcribes audio near a lab scene. The kinds of crops mentioned in a dental plaque analysis support the answer about Maya plantation owners.

## Personal Reflections

### 1. What problem does the paper address?

Long-video QA requires switching between scales. Finding the part about an experiment takes an overview, while identifying what it found may take a single sentence. Analyzing the entire recording at a uniform density can spend much of the budget on unrelated clips. VideoARM uses the question to decide where to look first and what evidence to gather next.

### 2. How did prior work approach it?

Processing the full video is constrained by visual tokens and context. Retrieval systems such as DVD first segment the recording densely, generate captions and embeddings, and reuse the index across later questions. The first query still bears the preprocessing cost. VideoTree narrows the search hierarchically. VideoARM also lets the controller choose the next interval and tool based on what it has already found.

### 3. What is the main contribution?

Coarse localization sets the search scope, short clips test local hypotheses, and intermediate evidence is written to memory with its time interval. A reusable design choice is to keep track of which clip supports a judgment and retain a way to revisit the original observation. The Clip Analyzer’s confidence comes from the model and would need calibration before it could govern when to stop or inspect another clip.

### 4. How well does it work?

- **Main results (Table 1)** — With o3 + GPT-4.1, VideoARM scores **75.3%** on Video-MME long without subtitles, 8.0 percentage points above DVD’s 67.3%. With GPT-4o for the understanding tools, VideoARM scores **81.2%** on the same long subset, **82.8%** on Video-MME overall, and **78.0%** on LongVideoBench overall. The o3 + GPT-4.1 setup scores 78.2%, 81.2%, and 79.7% on EgoSchema, MLVU, and LVBench, respectively.
- **Ablations (Tables 3–6)** — The full configuration scores **76.5%** on the stratified Video-MME long subset. Removing the long-term perception pool yields 67.0%, removing the short-term pool yields 72.5%, and removing audio transcription yields 70.5%. Increasing the budget from 3 to 10 steps raises the long-video score from 72.0% to 76.5% and lowers the short-video score from 87.5% to 84.0%. These figures come from the ablation subsets.
- **Cost (Table 7)** — Across 10 videos averaging 41.3 minutes and 30 questions, the paper reports **1.89 million tokens** for VideoARM and 64.21 million for DVD, a ratio of about 1 to 34. A separate estimate for one question on a 30-minute video gives about 1 to 50 under the paper’s sampling and step budgets. Reuse across queries, API cost, and end-to-end latency require separate measurements.

### 5. What are the limitations and open questions?

Sparse sampling can miss a brief action. Once the first localization goes wrong, the controller lacks an explicit mechanism to detect the miss and redirect the search to other intervals. In the supplementary carousel example, it repeatedly narrows the window and still struggles to identify the correct level of the balance boards. Performance also depends on the controller. In Table 2, keeping GPT-4.1 for the understanding tools and switching the controller and temporal scoping from o3 to Qwen3-VL moves the long-video ablation score from 76.5% to 54.9%.

#### From clip retrieval to online embodied memory

VideoARM can revisit a recording that is already available. A robot can use only the observations that have arrived so far, and its actions change the scene. HM³ could organize evidence within a single task. Sensory memory could retain brief observations with timestamps, result memory could retain object IDs and state judgments with their sources, and working memory could record why a check or repeat observation was requested. For example, a gripper closing establishes that a grasp was attempted. Seeing the cup leave the table and continue moving with the gripper supports “picked up.” During occlusion, the memory can retain the last confirmation time. If the cup later slips, the agent can update its current judgment while keeping the record of the earlier lift. This preserves the difference between what happened then and what still holds now.

With the perception model and review budget held fixed, an experiment could compare ordinary clip retrieval with object-state memory that includes timestamps and links to source observations. Short occlusions and dropped grasps would let us measure state error rates, correction delays, and the cost of reviewing evidence. This is an extension of the paper’s approach to organizing evidence.

## Further Reading

- [Project and demos](https://milvlg.github.io/videoarm/) · [Official code](https://github.com/MILVLG/videoarm)
- [VideoAgent notes](/en/blog/VideoAgent) · [Embodied VideoAgent notes](/en/blog/Embodied-VideoAgent)
