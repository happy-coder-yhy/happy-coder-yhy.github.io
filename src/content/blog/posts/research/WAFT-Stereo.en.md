---
title: 'Paper Notes: WAFT-Stereo — Replacing Cost Volumes with Warping for Stereo Matching'
date: '2026-08-28'
summary: 'Introduces WAFT-Stereo, a stereo matching framework that does not rely on cost volumes. The paper shows that high-resolution feature warping plus iterative updates can replace the cost-volume designs used by many leading stereo methods. With a classification-before-regression initialization strategy for large disparities, WAFT-Stereo reaches SOTA or Pareto-frontier performance on ETH3D, KITTI, and Middlebury while running 1.8 to 6.7 times faster than strong baselines such as FoundationStereo and S2M2-XL.'
tags: ['Stereo Matching', 'Depth Estimation', 'Binocular Vision', 'Warping', 'Computer Vision']
category: 'research'
venue: 'arXiv 2026'
status: 'preprint'
year: 2026
arxiv: 'https://arxiv.org/abs/2603.24836'
github: 'https://github.com/princeton-vl/WAFT-Stereo'
---

## Paper Info

- **title**: WAFT-Stereo: Warping-Alone Field Transforms for Stereo Matching
- **author**: Yihan Wang, Jia Deng
- **year**: 2026
- **type**: Research Paper
- **version**: arXiv:2603.24836v3, 2026-06-30

## Core Framework: Replacing Cost Volumes with Feature Warping

WAFT-Stereo starts from a simple claim: strong stereo matching does not necessarily require a cost volume. Many leading methods construct a full or local cost volume between the left and right images, then refine disparity in a RAFT-style recurrent loop. Cost volumes work well, but their memory and computation grow with disparity range or lookup radius, so they are often built at low resolution, which can hurt fine details.

WAFT-Stereo adapts the idea behind WAFT for optical flow: instead of explicitly enumerating matching costs, each iteration uses the current disparity estimate to backward-warp right-view features into the left-view coordinate system. The updater then receives left-view features, warped right-view features, and a hidden state to predict the next disparity update.

### 1. Input Encoder

- **Input**: rectified stereo image pairs.
- **Feature extraction**: pretrained visual backbones extract left and right image features. Benchmark submissions use DepthAnythingV2-L.
- **Lightweight adaptation**: instead of adding the small side-tunable U-Net used in the original WAFT, WAFT-Stereo freezes the main backbone, tunes it with LoRA, and upsamples features through a DPT head.

This shifts the architecture away from specialized cost-volume processing and toward reusable pretrained features plus efficient warping.

### 2. Iterative Updates with Warping

At iteration t, the model uses the current disparity \(d_t\) to sample the right-view feature map \(F_R\) from the left-view coordinate system:

- For a left-view pixel \(p=(p_h,p_w)\), the corresponding right-view location is approximately \((p_h,p_w-d_t(p))\).
- Bilinear sampling produces the warped right-view feature.
- The recurrent updater reads the left feature, the warped right feature, and its hidden state, then predicts the next disparity increment.

This gives warping two important advantages:

- **Memory does not grow linearly with disparity range**: the model samples from the current estimate instead of storing a table of candidate disparities.
- **Higher-resolution indexing becomes practical**: this helps with edges, small structures, and local texture.

### 3. Classification Before Regression

Naively turning WAFT into a 1D stereo regressor does not work well. In optical flow, motion between adjacent video frames is often small; in high-resolution stereo, disparity can span hundreds of pixels. Starting recurrent regression from zero disparity makes these large displacements hard to recover.

WAFT-Stereo solves this with a first-step discrete disparity classifier followed by regression refinement:

- **Classification stage**: split the maximum disparity \(D_{max}\) into B bins and predict a probability distribution over bins for every pixel.
- **Soft-target supervision**: construct a soft distribution from the distance between the ground-truth disparity and each bin, and train with soft cross-entropy.
- **Soft-argmax initialization**: convert the predicted distribution into an initial disparity \(d_0\).
- **Regression refinement**: subsequent recurrent steps refine residual disparity with a Mixture-of-Laplace loss.

The key finding is that faster convergence comes mainly from the classification formulation, not from cost volumes. WAFT-Stereo obtains the benefit with warped features and standard ViT/DPT modules.

### 4. Architecture Improvements

WAFT-Stereo modifies the original WAFT architecture in several stereo-friendly ways:

- **LoRA replaces the side U-Net adapter** to reduce latency.
- **High-resolution ResNet blocks** replace the high-resolution hidden-state skip connection, improving detail accuracy.
- **ViT-S + DPT updater** is used for both the classification module and regression updater.
- **Mixture-of-Laplace loss** improves iterative refinement compared with the common L1 regression loss.

## Personal Insight

### 1. What problem does the paper aim to solve?

**Core Problem**: The strongest stereo matching systems often treat cost volumes as a default component, but cost volumes are expensive in both memory and computation, especially for high-resolution inputs and large disparity ranges. That cost pushes matching to lower resolutions and can lose boundary/detail information.

WAFT-Stereo asks a more fundamental question: **does stereo matching truly need explicit cost volumes, or can simpler feature warping plus iterative updates reach the same or better level?**

Specific objectives include:

- Show that a fully warping-based stereo architecture can reach SOTA accuracy.
- Preserve high-resolution feature processing while avoiding cost-volume memory overhead.
- Fix the large-disparity convergence issue of pure regression updates.
- Achieve strong accuracy, efficiency, and zero-shot generalization on public benchmarks.

### 2. What previous work exists, and what are the pain points?

**Previous Work**:

- **Classical and early deep stereo**: rely on explicit matching costs, aggregation, and refinement.
- **RAFT-Stereo-style methods**: build multi-level or local cost volumes and recurrently refine disparity.
- **Recent systems such as FoundationStereo, S2M2, and MonSter++**: combine large backbones, mixed data training, and cost-volume or matching-probability modeling.
- **WAFT for optical flow**: shows that high-resolution feature warping can replace cost volumes for optical flow.

**Pain Points**:

- Cost-volume memory and computation scale with disparity range or lookup radius.
- Many strong methods include architecture pieces specialized for cost-volume processing, increasing engineering complexity.
- Pure recurrent regression from zero initialization struggles with hundreds-of-pixels stereo disparities.
- Common zero-shot settings such as SceneFlow-only can be biased and may not reflect true generalization.

### 3. What innovative method does the paper use to address these pain points?

**Innovative Approach**: Replace “cost volume + cost lookup” with “classification initialization + warping-based recurrent regression.”

- **Warping-alone stereo**: each iteration backward-warps right-view features using the current disparity estimate, without constructing candidate-disparity cost volumes.
- **Classification handles large disparity**: a discrete disparity classifier gives the regression stage a coarse but stable \(d_0\), avoiding the hardest part of starting from zero.
- **Classification gains do not require cost volumes**: a cost-volume classification variant brings no clear improvement, suggesting that the formulation matters more than the volume.
- **Standard building blocks**: ViT, DPT, ResNet blocks, LoRA, and MoL loss form a simpler pipeline with fewer stereo-specific modules.
- **Scalability**: larger backbones and broader synthetic training data continue to improve WAFT-Stereo.

### 4. What are the effects?

**The results are strong: WAFT-Stereo reaches SOTA or frontier accuracy while being much faster than several strong baselines.**

- **ETH3D zero-shot**: trained only on synthetic data, WAFT-Stereo ranks first on ETH3D BP-0.5 and BP-2-all. The DAv2L-5 model reaches BP-0.5-noc 0.89 and BP-0.5-all 0.97; compared with the strongest established zero-shot baseline, BP-0.5 drops by 61% and BP-1 by 81%.
- **KITTI-2012/2015**: after fine-tuning, it ranks first on KITTI-2012 BP-2 and KITTI-2015 D1, reducing error by 13% and 6% over prior SOTA. It also improves zero-shot KITTI-2015 D1 by about 9%.
- **Middlebury**: it achieves the best RMSE, with RMSE-noc 5.61 and RMSE-all 7.02, reducing error by 6% and 5%. However, average BP-2 is still behind S2M2-XL and a few others, largely due to hard illumination differences in Classroom2E.
- **Speed and compute**: on 540p input with BF16 on an NVIDIA L40, DAv2L-5 runs at about 106ms and DAv2S-4 at about 47ms, with the small model reaching 21 FPS. The paper reports 1.8 to 6.7x speedups over methods such as S2M2-XL and FoundationStereo.
- **Training-data ablations**: under the same or fewer training data, WAFT-Stereo remains comparable or better than strong baselines; SceneFlow-only training, however, overfits dataset bias and generalizes poorly.
- **Architecture ablations**: B=40 disparity bins, the classification+regression combination, high-resolution ResNet blocks, and the MoL loss all contribute meaningfully.

### 5. What are the limitations and future directions?

Based on the paper's experiments and my observations:

- **Rectification quality still matters**: the method assumes rectified stereo pairs; in real dual-fisheye systems, calibration, synchronization, and distortion-correction errors can directly harm warping alignment.
- **Illumination differences remain difficult**: Middlebury's Classroom2E case suggests that strong left-right appearance changes can still hurt a pure warping pipeline.
- **Training data strategy is critical**: SceneFlow-only training overfits, so zero-shot generalization depends heavily on diverse synthetic coverage.
- **Latency still grows with iterations**: WAFT-Stereo needs fewer iterations than many recurrent methods, but additional steps reduce parallelism. More parallel or fewer-step update designs remain open.
- **Large backbones still cost compute**: DAv2L gives the best accuracy, but DAv2S/B/L must be chosen according to deployment constraints.
- **Real robotic/fisheye deployment needs system evaluation**: public benchmarks are mostly standard rectified datasets; dual-fisheye video, motion blur, low texture, and real-time depth-video workflows still need engineering validation.

## Further Reading

- [arXiv: WAFT-Stereo: Warping-Alone Field Transforms for Stereo Matching](https://arxiv.org/abs/2603.24836)
- [WAFT-Stereo GitHub](https://github.com/princeton-vl/WAFT-Stereo)
- [WAFT: Warping-Alone Field Transforms for Optical Flow](https://arxiv.org/abs/2504.00174)
- [RAFT-Stereo: Multilevel Recurrent Field Transforms for Stereo Matching](https://arxiv.org/abs/2109.07547)
- [FoundationStereo](https://arxiv.org/abs/2501.09898)
