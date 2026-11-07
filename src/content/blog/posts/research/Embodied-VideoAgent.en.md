---
title: 'Paper Notes: Embodied VideoAgent — Persistent Object Memory for Dynamic 3D Scenes'
date: '2026-11-07'
summary: 'Embodied VideoAgent turns egocentric video, depth maps, and camera poses into an updatable 3D object memory. An LLM then queries the memory and invokes perception and action tools to understand and act in changing scenes. The key idea is to make past observations actionable through object states, spatial relations, action history, and VLM-based updates.'
tags: ['Embodied AI', 'Episodic Memory', 'Dynamic Scene Understanding', 'Video Understanding', '3D Vision']
category: 'research'
venue: 'arXiv 2025'
status: 'preprint'
year: 2025
arxiv: 'https://arxiv.org/abs/2501.00358'
project_page: 'https://embodied-videoagent.github.io/'
---

## Paper Info

- **Title**: Embodied VideoAgent: Persistent Memory from Egocentric Videos and Embodied Sensors Enables Dynamic Scene Understanding
- **Authors**: Yue Fan, Xiaojian Ma, Rongpeng Su, Jun Guo, Rujie Wu, Xi Chen, Qing Li
- **Year**: 2025
- **Type**: Research Paper
- **Version**: arXiv:2501.00358v2, January 9, 2025

## Core Framework: Turning Observations into Updatable Object Memory

The paper asks how an embodied agent can remember where an object was, what happened to it, and how to use that evidence after the object is moved or occluded. Long-video models are expensive and struggle to maintain object identity and 3D state; static scene graphs do not naturally represent action-induced changes.

Embodied VideoAgent builds on VideoAgent's memory-and-tool paradigm with two additions: persistent object memory that fuses RGB, depth, and camera 6D poses, and VLM-based updates that associate perceived actions with affected objects.

### 1. Three Memory Components

- **Temporal memory** splits a video into roughly two-second segments and stores captions, visual features, and caption embeddings for temporal retrieval.
- **Persistent object memory** gives each object an ID, category, state, related-object relations, a 3D bounding box, object features, and contextual features.
- **History buffers** record actions, timestamps, target IDs, current-frame features, visible objects, and 3D boxes. They supplement the current scene state with execution evidence.

This maps naturally to my current research distinction: the paper implements within-task object, state, and event memory, but does not yet turn those experiences into validated cross-task skills.

### 2. From RGB-D to 3D Object Entries

YOLO-World performs open-vocabulary detection, and 2D-to-3D lifting combines depth and camera pose to produce world-coordinate 3D bounding boxes. Object relations are derived from 3D boxes; the current implementation mainly handles `on/uphold` and `in/contain`.

To avoid duplicate entries, the system performs spatial and visual re-identification. Static objects rely mainly on Spatial IoU or MaxIoS. Dynamic objects can move, so re-ID combines bounding-box volume similarity with CLIP and DINOv2 appearance similarity. Object and context features are updated with moving averages.

The choice of 3D boxes over point clouds or voxels sacrifices detail but makes memory cheaper and easier to update, which is a reasonable representation for object-level queries and planning.

### 3. VLM-Based State Updates

When an object is occluded by a hand or another object, current detection alone may lose its identity. During an action, the system projects candidate memory boxes back into the current frame and asks a VLM which entry is the action target. It then updates the corresponding fields programmatically, for example changing a can's state to `in-hand`.

This separates semantic association from state mutation: the VLM identifies the action–object link, while code performs the update. The design is easier to audit than asking an LLM to rewrite the entire scene, although detector, projection, occlusion, and VLM errors can still propagate into memory.

### 4. Query Tools and Action Primitives

The agent does not read the whole database for every question. It invokes:

- `query_db` for object-memory and history retrieval;
- `temporal_loc` for relevant video moments;
- `spatial_loc` for 3D locations from object or environment descriptions;
- `vqa` for open-ended answers on selected frames.

It also exposes `search`, `goto`, `open`, `close`, `pick`, and `place`. The LLM decomposes requests and coordinates feedback, while tools handle concrete perception or control.

### 5. Two Agents for Embodied Interaction Data

One LLM simulates a user and another Embodied VideoAgent acts as the assistant in Habitat. The user proposes tasks from a partial scene graph, and the assistant queries memory and executes actions. This offers a way to generate embodied interaction data, but it is still a simulated data-generation protocol rather than evidence of long-term real-robot learning.

## Personal Insight

### 1. What Problem Does the Paper Aim to Solve?

The central question is: **when objects are moved, occluded, or rearranged, how can an agent turn past observations into spatial and state evidence that remains useful for current action?**

Rather than training a larger end-to-end video model, the paper makes “what to remember, how to query it, and when to update it” explicit. This is a practical choice for embodied systems that need to decide what to observe, which object to move, and whether an action has actually changed the world.

### 2. Previous Work and Pain Points

- Long-video VLMs can consume many frames but become expensive and are not naturally reliable at maintaining object identity and 3D locations.
- Static 3D scene graphs represent relations well but do not naturally record who moved what, when, and with what result.
- VideoAgent already uses temporal memory, object memory, and tool calls, but its video-oriented memory is less precise for dynamic 3D positions and action-induced state changes.
- End-to-end multimodal models can answer questions without exposing which frame, action, or geometric evidence supports the answer.

### 3. What Is Innovative?

I see three main contributions:

1. **Ground object memory in 3D** using depth and camera pose, so memory supports localization, relations, and manipulation planning rather than only visual recall.
2. **Use a VLM for action–object association and code for field updates**, enabling relatively cheap updates during grasping, placing, and occlusion.
3. **Put memory queries and action primitives in one agent loop**, allowing past information to guide search, obstacle removal, navigation, and retrieval of occluded objects.

### 4. How Well Does It Work?

- **Ego4D-VQ3D:** Embodied VideoAgent (image) reaches 85.37% Succ and 92.07% QwP on validation, versus 80.49% Succ and 82.32% QwP for EgoLoc. Its more aggressive open-vocabulary candidates improve coverage, while Succ* and L2 are slightly less favorable.
- **OpenEQA:** on the hard subset, the GPT-4o variant reaches 46.0% on ScanNet and 48.2% on HM3D, above Video-LLaVA's 32.9% and 27.8%. Temporal localization and object memory reduce the burden of direct long-video QA.
- **EnvQA:** it reaches 25.91, 68.00, and 35.50 on Events, Orders, and States, compared with VideoAgent's 5.54, 65.5, and 12.5. The action buffer and VLM update are especially useful for event questions, while 3D relations help recover final object states.
- **Robot demonstration:** a Franka robot observes an apple that is later occluded by a box; the agent retrieves the apple's remembered location, moves the box, and completes the pick. This is qualitative evidence that memory can affect action, not a large-scale real-robot success-rate evaluation.

The paper also reports gains with estimated poses from COLMAP or DUSt3R, suggesting some redundancy across memory and tools. This should not be read as calibrated geometric uncertainty; error propagation from depth, pose, and re-ID still needs task-level evaluation.

### 5. Connection to My Research Direction

This paper is a useful implementation of **within-task episodic memory**. It already stores object states, actions, timestamps, spatial relations, and visual evidence, but leaves several questions open:

- **When is evidence sufficient to write memory?** An issued action, a VLM inference, and an observation-supported outcome should be separate records. Depth, optical flow, visibility, and gripper–object motion can provide later verification.
- **When does memory expire?** An old position is historical evidence, not an indefinitely valid current state. Occlusion, depth holes, and re-ID conflicts should trigger re-observation.
- **How can experience become a skill?** The paper maintains task memory, not validated cross-task skills. A procedure such as “grasp → lift slightly → check relative motion → re-localize on failure” could be stored with applicability conditions, then retained only after later execution validates it.
- **How should bottlenecks be separated?** Geometry error, memory contamination, planning error, and low-level action failure should be measured separately. Adding depth alone does not prove that temporal geometry improves memory or long-horizon success.

A natural follow-up is to fix the VLA and harness, then compare ordinary memory writes, evidence-driven writes, re-observation gates, and a validated experience library on occlusion, revisit, state-change, and recovery tasks. In addition to task success, record false completion judgments, incorrect-memory lifetime, correction delay, retry cost, and negative transfer.

## Limitations and Open Questions

- **Coarse object representation:** 3D boxes support localization and relations but not detailed shape, contact regions, or fine affordances.
- **Limited relation vocabulary:** `on/uphold` and `in/contain` do not cover contact, support, occlusion, opening degree, or causal changes comprehensively.
- **Dependency on perception and VLM updates:** wrong action association, projection, or re-ID can write incorrect states into persistent memory.
- **Depth and pose remain external prerequisites:** robustness to noisy poses does not establish calibrated memory reliability.
- **Simulation is not continual real deployment:** two-agent data generation and one robot example do not show that memory remains clean across long, multi-task operation.
- **No closed loop from memory to validated skill:** state maintenance is demonstrated, but experience abstraction, applicability conditions, and negative transfer remain open.

### Geometric Filtering with Fisheye Cameras

In Appendix B, the paper sorts object surface points by their distance to the camera, removes the nearest and farthest 10%, and computes the 3D bounding box from the remainder. This is a cheap heuristic when foreground and background errors mainly occupy the two extremes. A fisheye transfer requires separating two questions: whether the distance measure is appropriate, and whether a fixed trimming ratio is appropriate.

The paper uses `distances to the camera`, meaning Euclidean camera distance

`d = sqrt(X² + Y² + Z²)`

rather than optical-axis depth \(d_z=Z\). They satisfy \(d=Z/\cos\theta\). With a narrow field of view the difference may be modest; in a fisheye image, points near the image boundary can have much larger Euclidean distance even when they share the same Z-depth plane. Correct fisheye back-projection still makes Euclidean distance geometrically valid, but it no longer directly represents front-to-back surface order.

The object geometry itself is also more spread out across a large field of view. A tabletop, for example, may cross from near-axis regions to large-angle regions, so its true distance distribution can overlap the distances of erroneous foreground or background points. Removing 10% at each end may therefore delete valid surface points. The issue is not only distortion; it is the overlap between the object's geometry distribution and the outlier distribution.

Changing 10% to 5% or 15% is therefore not the main research question. Candidate alternatives include adaptive percentile selection, Z-depth filtering for front/back reasoning, 3D spatial clustering, and multi-view consistency. The most promising direction is temporal or multi-view consistent point filtering: for an object observed at consecutive times, test whether a point has a corresponding structure from another view, satisfies reprojection geometry, and follows the object's temporal motion. A point confidence could combine

`C(pᵢ) = λ₁ C_depth(pᵢ) + λ₂ C_multi-view(pᵢ) + λ₃ C_temporal(pᵢ)`

This would combine depth reliability, cross-view geometry, and temporal motion evidence instead of discarding a fixed fraction of points. It also gives my research direction a concrete interface: pass calibrated geometric confidence to object memory and action planning, rather than treating a depth map as sufficient evidence by itself.

## Further Reading

- [Embodied VideoAgent, arXiv](https://arxiv.org/abs/2501.00358)
- [Project page](https://embodied-videoagent.github.io/)
- [VideoAgent](https://arxiv.org/abs/2403.11441), the base framework
- [Harness VLA notes](/en/blog/HarnessVLA), on frozen VLA execution, memory, and recoverable composition
- [Research idea: temporal evidence-driven embodied memory and skill evolution](https://chatgpt.com/s/t_6aef20f8a7bc81919339804d49ce77a6)
