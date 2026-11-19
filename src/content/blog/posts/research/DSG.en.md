---
title: 'Paper Note: DSG — Checking Renderings to Remove Outdated Objects from Dynamic Scene Graphs'
date: '2026-11-19'
summary: 'DSG checks object changes with optimized current-view and virtual-view renderings, then infers spatial relations from object and surrounding-region descriptions. These notes connect the method to temporal evidence, relation confirmation, and online embodied memory.'
tags: ['Dynamic Scene Graphs', '3D Gaussian Splatting', 'Embodied Memory', 'Temporal Geometry']
category: 'research'
venue: 'arXiv'
status: 'preprint'
year: 2026
arxiv: 'https://arxiv.org/abs/2609.00619v1'
---

## Paper Info

- **Title** — DSG: Dynamic 3D Scene Graph Construction for Embodied Agents in Changing Indoor Environments
- **Authors** — Ming Liao, Chao Ye, Jianing Fei, and Weiyang Lin
- **Type and version** — Method paper, read from the attached [arXiv:2609.00619v1](https://arxiv.org/abs/2609.00619v1), dated September 1, 2026. The verified arXiv record lists v1 as of November 19, 2026, so these notes record it as a preprint.
- **Resources** — The attachment and verified arXiv page provide no official code or Dyn-THOR download link. Reproduction access and additional temporal annotations need confirmation.

## Core Framework — Check Object Changes, Then Reconstruct Spatial Relations

### 1. Maintain an object-level Gaussian map from RGB-D and camera poses

The input is a posed RGB-D sequence. GroundingDINO detects objects, SAM extracts instance masks, and CLIP encodes object semantics. Detections are greedily associated with map objects using the sum of projected-mask IoU and semantic similarity. Matched features are fused, and unmatched detections initialize new objects. Each object consists of Gaussian primitives sharing an ID. An image rendering loss optimizes their positions, colors, scales, rotations, and opacities.

### 2. Optimize the map before checking whether old objects remain in place

Comparing a poorly optimized rendering with a real image can turn rendering artifacts into apparent object disappearance. DSG optimizes the Gaussians first. Within the current camera frustum, it compares rendered objects with corresponding RGB regions and uses channel-averaged SSIM to classify them as stable, uncertain, or missing. The experimental high and low thresholds are 0.9 and 0.3. These thresholds apply to image similarity, while practical relation judgments must also account for occlusion and reconstruction errors.

### 3. Optimize a virtual viewpoint for uncertain objects

DSG optimizes a virtual camera pose to bring uncertain objects into view, close to the image center, and across a larger image area. It renders both historical and current maps from that pose. Objects whose rendering similarity falls below the threshold are classified as missing, and the others as stable. Association can initialize Appeared nodes, while outdated object Gaussians are removed.

The optimized camera is a **rendering camera**. It changes how existing maps are inspected. Moving a physical robot to gather another observation requires an additional action policy and new data.

### 4. Combine object appearance, surrounding context, and geometry for relations

For each object, DSG selects the observation with the largest image footprint. The Describe Anything Model describes the instance region and a surrounding region expanded by a factor of 2.5. A language model organizes the object label and context. Candidate relations are filtered using 3D box IoU and point-cloud overlap, and pairs with zero box IoU are discarded. Geometry, labels, and descriptions then support relation inference for the surviving pairs. Experiments use Qwen3-VL-Plus for relation reasoning and an RTX 3090 workstation. The paper describes a system built from pretrained perception and language models plus geometric optimization.

## Personal Insight

### 1. What Problem Does the Paper Aim to Solve?

A cup has moved, but the map still places it at the old location. That outdated object can mislead subsequent search and planning. DSG targets these residual geometries and nodes and reconstructs relations after cleaning them up. It extends incremental graph construction toward maintaining a representation that reflects a changed environment.

### 2. What Previous Work Exists, and What Are Its Pain Points?

Methods such as ConceptGraphs fuse object observations and semantics across frames, and their static assumptions can leave outdated nodes behind. DynamicGSG already detects missing objects through rendering comparisons, but a single viewpoint and insufficient Gaussian optimization can distort that decision. Relation prediction also depends on its inputs. Labels and box locations may provide too little evidence about contact, support, or surrounding layout. DSG adds change verification and local visual context to address these issues. Dynamic deletion, geometric counterevidence, and relation reconstruction therefore already have direct baselines.

### 3. What Method Addresses These Pain Points?

The useful design is to **improve the representation used for comparison before deciding to remove an old node**. Uncertain objects receive an additional virtual-view check to reduce difficulties caused by incomplete current views. For relations, observed surroundings supplement object descriptions, while geometric filtering still determines candidate edges. These components affect object retention and relation prediction separately and deserve separate diagnostics.

### 4. How Well Does It Work?

Dyn-THOR contains 20 sequences and 3,326 keyframes with RGB-D and ground-truth poses. Each sequence has two stages. Up to ten objects are relocated in the second stage, and both stages use identical camera trajectories. Node evaluation uses Hungarian matching on 3D box IoU followed by semantic verification. Missing Residual Rate, or MRR, measures the proportion of ground-truth missing objects that remain in the map. Lower is better.

| Dyn-THOR node evaluation, Table I | Precision ↑ | Recall ↑ | F1 ↑ | MRR ↓ |
| --- | ---: | ---: | ---: | ---: |
| ConceptGraphs | 33.3% | 26.0% | 28.3% | 14.9% |
| DynamicGSG | 44.8% | 29.5% | 35.2% | 3.0% |
| DSG without object removal | 49.5% | 34.7% | 40.4% | 9.3% |
| DSG with single-view removal | 52.8% | 33.7% | 40.7% | 2.6% |
| DSG with dual-view removal, full | 51.0% | 33.9% | 40.3% | 2.1% |

Dual-view checking reduces missing-object residue by 0.5 percentage points relative to single-view checking and lowers F1 by 0.4 points. This shows a tradeoff between removing outdated objects and retaining valid ones. The 3RScan evaluation uses only five reference–rescan pairs, totaling 1,866 keyframes. In Table II, DSG achieves 22.8% F1 versus DynamicGSG's 11.7%, with substantial reconstruction and matching difficulty remaining.

In Table III, an edge is evaluable only when both endpoint objects have been matched. Adding visual context raises average predicted edges from 13.6 to 15.5. Evaluable edges remain at 4.2, coarse matches increase from 1.4 to 1.8, and exact subject–predicate–object matches remain at 0.8. These are average counts. More predicted relations require a corresponding check of exact triple quality. An additional 831-frame D455 recording provides qualitative real-world examples. The paper reports no confirmation latency or end-to-end throughput for continuous interactions.

### 5. What Remains Unresolved?

**The dynamic evaluation primarily examines scenes before and after relocation.** Two-stage scans with matched trajectories help test outdated-node removal. Continuous picking, handovers, and placement require additional evaluation of when a relation change is confirmed and whether brief events are preserved. Relation validity intervals, late evidence revision, and skill verification need further mechanisms and tests.

Both virtual-view renderings depend on map quality, so uncertainty from occlusion and unobserved regions still matters. Association uses projected overlap and greedy semantic matching, making persistent identity after a large relocation another question to test. Overlap-based relation filtering may discard meaningful relations between more distant objects. Robustness of SSIM thresholds across materials, lighting, and pose errors, alongside the cost of mapping, description, and reasoning, also affects online deployment.

#### Connection to My Research Direction

Following the research discussion draft dated November 18, 2026, I would use DSG as a **direct baseline for maintaining world state after a change**. It already removes old objects and reconstructs relations. Further contributions need evidence about when a particular physical relation can be confirmed and how late results remain useful for the current state. The following extensions are research proposals awaiting experiments.

**An adaptive short-term window could operate at the observation input.** Camera-compensated relative motion, occlusion, and semantic continuity could select the history needed for the current perception call from observations that have already arrived. A camera turn with stable object relations could use a shorter window, while ongoing manipulation or identity association could require more history. First hold the geometry frontend and long-term update rules fixed and measure current relation recognition, missed interaction cues, and input cost. DSG's virtual-view verification could remain available as a map inspection tool.

**Long-term updates need separate decisions for ending an old relation and establishing a new one.** Clear cup–table separation can end the validity interval of “on the table,” while an occluded holder leaves “held by whom” pending. Geometric evidence, video hypotheses, and attribute volatility priors could enter the candidate probability model TypeSafe Jev with observation times, sources, and missing-value indicators. Independent calibration and comparisons with rules and Bayesian state models would test its value. Multiple renderings of the same map share errors, so evidence fusion must account for that dependence.

**Late refinement and brief events require explicit temporal memory.** Fast depth, flow, and tracking can supply current cues, while BiDA refines an already-arrived window in the background. If a cup has been picked up and returned, late grasp evidence can complete the event history, while the current graph retains the latest valid state. Working memory holds candidate evidence, episodic memory preserves the lift, and world memory maintains current relations. Skill memory additionally requires independent execution validation. One confirmed lift can supply outcome evidence.

A first experiment could fix the perception window, objects, candidate relations, evidence outputs, and result availability times, then compare DSG-style threshold decisions with candidate commitment rules. Extensions for relation validity must be labeled as adaptations. A separate experiment could fix inference and commitment rules while comparing current depth, simple smoothing, and temporal geometry, measuring geometric quality against processing delay. Adaptive windows and long-term updates could then be combined. Evaluation should cover erroneous-relation duration, false commitments, separate confirmation delays for ending old and establishing new relations, unknown-state coverage, brief-event recall, and total computation. Independent annotations and source-sequence splits would control leakage. Dyn-THOR's before–after relocation tests provide an initial check, while continuous interactions and precise relation boundaries need additional data.

## Further Reading

- [DSG paper v1](https://arxiv.org/abs/2609.00619v1)
- [VL-KnG notes](/en/blog/VL-KnG) · [Embodied VideoAgent notes](/en/blog/Embodied-VideoAgent)
- [VideoARM notes](/en/blog/VideoARM) · [StereoVLA notes](/en/blog/StereoVLA)
