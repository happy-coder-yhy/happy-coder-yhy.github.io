---
title: 'Paper Notes: StereoVLA — Stereo Matching Features for Robot Actions'
date: '2026-11-14'
summary: 'StereoVLA fuses a filtered FoundationStereo cost volume with left-image semantics and trains its action policy with interaction-region depth and camera-parameter supervision. These notes distinguish stereo geometry, viewpoint robustness, and long-horizon state maintenance.'
tags: ['Stereo Vision', 'Vision-Language-Action Models', 'Robot Manipulation', 'Viewpoint Robustness']
category: 'research'
venue: 'RSS 2026'
status: 'published'
year: 2026
arxiv: 'https://arxiv.org/abs/2512.21970v2'
github: 'https://github.com/shengliangd/StereoVLA'
project_page: 'https://shengliangd.github.io/StereoVLA-Webpage/'
---

## Paper Info

- **Title:** StereoVLA: Enhancing Vision-Language-Action Models with Stereo Vision
- **Authors (attached v2):** Shengliang Deng, Mi Yan, Yixin Zheng, Jiayi Su, Wenhao Zhang, Yitao Zeng, Xiaoguang Zhao, Heming Cui, Zhizheng Zhang, and He Wang. The RSS proceedings entry does not list Yitao Zeng; the list here follows the version read.
- **Type and version:** Research paper published at [RSS 2026](https://roboticsproceedings.org/rss22/p088.html). The method and results below follow the attached [arXiv:2512.21970v2](https://arxiv.org/abs/2512.21970v2), revised June 26, 2026.

## Core Framework: Geometry and Semantics in the Same Visual Tokens

### 1. GeoSem: Use a Cost Volume Without First Decoding Depth

The inputs are synchronized stereo RGB and a language instruction. The geometric branch takes FoundationStereo's filtered cost volume, skipping its correlation-volume branch and iterative disparity refinement. The semantic branch runs SigLIP and DINOv2 on the left image only, providing language alignment and visual detail. Spatial pooling aligns the feature grids, then the model concatenates channels and projects them through an MLP. Fusion adds features at each position without lengthening the token sequence. The cost volume is an input representation, not a calibrated range-confidence estimate.

### 2. Auxiliary Training: Geometry Near Contact and Action Across Frames

Both auxiliary tasks are formulated as text generation. Interaction-region depth estimation samples points mainly inside the target and gripper boxes and supervises metric depth. Camera parameter estimation supervises camera-to-robot extrinsics and camera intrinsics. The objectives encourage features that retain local geometry and information about the camera viewpoint. At deployment, the controller does not have to receive decoded depth or calibration parameters first.

### 3. From Current Observations to Action Chunks

InternLM-1.8B processes visual and language tokens. A roughly 300M-parameter action expert consumes intermediate vision-language features and uses flow matching to generate chunks of delta end-effector poses. Target boxes and the next keyframe end-effector pose provide intermediate supervision. Synthetic data cover tabletop Franka and humanoid platforms, with high-fidelity rendering and camera and scene randomization. The pretrained vision encoders stay frozen. The policy repeatedly acts on current observations and does not maintain long-term memory across steps.

## Personal Insight

### 1. What Problem Does the Paper Aim to Solve?

A grasp instruction still refers to the same object when the camera is repositioned. A single RGB image may suffice to recognize it but leave the target-to-gripper distance ambiguous. The paper asks how to give the action model fine spatial evidence while preserving the grounding between the instruction and target.

### 2. What Previous Work Exists, and What Are Its Pain Points?

RGB-D provides explicit depth, but transparent surfaces can defeat sensors, and ideal simulated depth differs from real sensor noise. A wrist view clarifies local relations but can suffer from occlusion and limited coverage. Extra side cameras improve coverage, yet independent image encoding does not guarantee that the policy uses cross-view correspondences. The paper compares architectures under shared stereo input as well as whole systems with different sensors and policies.

### 3. What Method Addresses These Pain Points?

The central decision is to preserve candidate matches in the stereo feature representation and let semantic features distinguish which object to grasp. Interaction-region depth supervision focuses learning on task-relevant geometry. Camera-parameter supervision gives the model information related to the camera–robot transform, though the paper does not verify that the model learns an explicit, readable transform internally.

### 4. How Well Does It Work?

- **Real-world viewpoint tests (Table I):** StereoVLA achieves **77.2%, 62.2%, 53.9%, and 52.2%** under small, medium, large, and moving-camera conditions. Front-plus-wrist π0.5 achieves 65.6%, 51.7%, 42.2%, and 39.4%. Each rate is based on 180 trials (3 groups × 6 tasks × 10 trials). Training data volumes are matched, but the policies and sensor configurations differ. The moving-camera test keeps the gripper and targets in view.
- **Ablations (Tables II and IV):** In simulation, the filtered cost volume with semantics reaches 77.0%, versus 51.0% for the same volume alone. In the cumulative ablation, adding camera-parameter supervision raises the large and moving results from 30.2% and 27.1% to 54.1% and 52.3%. These effects apply to the tested configurations and need not add independently.
- **Simulation and cross-hardware transfer (Tables VI and III):** Without LIBERO fine-tuning, StereoVLA scores 65.8% / 59.2% / 51.8% / 38.8% at four angles from 0° to 135° on the modified LIBERO-MV-R benchmark (500 trials per angle, category-level success criteria). In fine-tuned humanoid tests, pretraining raises Cleaning and Laundry from 26.6% and 13.3% to 73.3% and 53.3% (15 trials per task). These are short, single-arm adaptation tasks.
- **Latency (Section IV-G and Table V):** On an H800, filtered cost-volume extraction takes 14 ms and full FoundationStereo depth inference takes 68 ms. The full policy is reported at 168 ms. The 14 ms figure is for the geometric branch, not the control cycle.

### 5. What Remains Unresolved?

The authors identify 224 × 224 input resolution and missing long-horizon temporal dependencies as limitations. Success with a moving camera supports current-frame robustness to viewpoint changes. It does not directly establish how the agent maintains identity through occlusion and reappearance, verifies a grasp, or chooses to observe again after failure. The synthetic training mainly uses quasi-static grasping; complex contact, different stereo baselines, and fisheye imaging require separate evaluation.

A follow-up could hold the semantic branch, action model, and observation budget fixed and compare single-step stereo features, explicit depth, and temporal fusion using only frames already available. First separate camera motion from real object motion, then test occlusion and empty grasps. Measure target confusion, premature closure, and recovery delay alongside success. To isolate memory, let the same execution framework consume timestamped geometric evidence with visibility information and retain a no-memory control. This is a proposal, not a reported result.

## Further Reading

- [Project and demos](https://shengliangd.github.io/StereoVLA-Webpage/) · [Official code](https://github.com/shengliangd/StereoVLA)
- [WAFT-Stereo notes](/en/blog/WAFT-Stereo): a comparison point for compute trade-offs in stereo representations.
- [Embodied VideoAgent notes](/en/blog/Embodied-VideoAgent): a comparison point for writing geometric observations into object memory.
