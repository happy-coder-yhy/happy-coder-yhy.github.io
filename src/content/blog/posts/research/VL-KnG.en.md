---
title: 'Paper Notes: VL-KnG — Remembering a Tour with a Spatiotemporal Knowledge Graph'
date: '2026-11-13'
summary: 'VL-KnG builds a graph offline from monocular egocentric video, associates objects across chunks, and retrieves evidence for QA and historical goal frames. Its main limitation is state maintenance in changing scenes: recording an object in multiple frames does not establish reliable current memory when objects move, change state, or are replaced.'
tags: ['Embodied Question Answering', 'Scene Memory', 'Spatiotemporal Knowledge Graphs', 'Dynamic Scenes']
category: 'research'
venue: 'arXiv'
status: 'preprint'
year: 2026
arxiv: 'https://arxiv.org/abs/2510.01483v3'
---

## Paper Info

- **Title**: Spatiotemporal Knowledge Graphs as Persistent Scene Memory for Embodied Question Answering
- **Authors**: Mohamad Al Mdfaa, Svetlana Lukina, Timur Akhtyamov, Arthur Nigmatzyanov, Dmitrii Nalberskii, Sergey Zagoruyko, Gonzalo Ferrer
- **Type and version**: Research paper; [arXiv:2510.01483v3](https://arxiv.org/abs/2510.01483v3), revised July 20, 2026; v1 first appeared in 2025.
- **Resources**: The v3 paper states that code and benchmark release is planned upon acceptance. These notes do not treat that plan as a release.

## Core Framework: Build Once from a Tour, Retrieve Evidence for Each Query

### 1. Build Local Graphs from Monocular RGB

The system chunks sampled egocentric video, using eight frames per chunk in the main experiments. A multi-image VLM extracts object instances, categories, colors, materials, sizes, affordances, and per-frame 2D boxes, as well as spatial relations. Nodes record frames in which the object was seen; edges record frames supporting the relation. Graph construction requires no depth sensing, 3D reconstruction, or task-specific training. Its location evidence is frame-level and relational.

### 2. STOA: Associate Object Identities Across Chunks

Spatiotemporal Object Association gives an LLM the incoming chunk graph and the accumulated graph. It uses categories, descriptions, and relational context to reuse an ID or create a node, even when no continuous visual track connects the observations. The implementation favors reuse in ambiguous cases, which can reduce duplicates but can also merge distinct lookalikes. A successfully associated moving object can retain its ID and acquire a different 2D box in later frames.

### 3. GER: Find Frames, Then Read Local Relations

Graph retrieval (GR) ranks frames by lexical overlap between the question and object descriptions. It supplies full local subgraphs for candidate frames to an LLM, which answers and reranks evidence frames. Graph-Enhanced Retrieval (GER) supplements candidates by matching the query against precomputed SigLIP2 object-crop embeddings. This avoids re-encoding the raw video per question; the object index still grows with the observation history.

The robot experiment retrieves the highest-ranked goal frame and sends its stored SLAM pose to the ROS navigation stack. The pose is where the camera observed the object during the tour. It is not the object's current 3D location. The use of SLAM poses for navigation is distinct from the monocular semantic graph construction.

## Personal Insight

### 1. What Problem Does the Paper Aim to Solve?

After a tour, a robot may be repeatedly asked where it saw something or what stood near an entrance. VL-KnG pays the perception cost once and turns each question into retrieval and reasoning over a small set of evidence. The protocol is post-tour episodic QA, with no revisiting the environment to collect fresh evidence at question time.

### 2. What Previous Work Exists, and What Are Its Pain Points?

A VLM reading the video directly may process the same frames for each question. Frame and topological memories help recall visited places but do not necessarily expose object relations. Metric 3D scene graphs provide explicit geometry at the cost of additional geometric input or reconstruction. VL-KnG uses object instances and frame-local relations to balance coverage and retrieval cost.

### 3. What Method Addresses These Pain Points?

Two interfaces stand out: a persistent ID connects separated observations, and a local subgraph ties an answer back to specific frame evidence. GER helps recover targets missed by textual descriptions, but visual retrieval does not establish object identity or verify a current state.

### 4. How Well Does It Work?

- **WalkieKnowledge (Tables 3 and 8):** Eight trajectories and 193 manually annotated questions. GER-G reaches 65.80% Retrieval Acc.@1 and 52.33% answer accuracy at about 0.8 seconds per query; Gemini 2.5 Pro reaches 68.91% and 61.63% at about 24 seconds. Answer accuracy is 37.2% for CwGR without cross-chunk association and 50.0% for GR with it. The latency comparison is at query time; initial graph construction is separate.
- **OpenEQA (Table 5):** In EM-EQA with 32 sampled frames per episode, GER-L scores 55.2 on LLM-Match (0–100) at about 0.8 seconds per question, versus 76.8 and 10.5 seconds for Gemini 3 Flash. This is an accuracy–latency trade-off, and LLM-Match is not exact answer accuracy.
- **NaVQA (Table 6):** Descriptive QA accuracy rises from 32.4% for GR to 66.2% for GER-G; the table reports 67.2% for DAAAM.
- **Office robot (Table 7):** Both VL-KnG and Gemini 2.5 Pro report 77.27% navigation success and 76.92% answer accuracy. Success requires reaching the goal pose with the object visible. It does not establish recovery when an object has been relocated after the tour.

### 5. What Remains Unresolved?

**The main gap is maintaining state in dynamic scenes.** Section 4.2 allows an associated object to receive a new box in later frames; the conclusion explicitly notes that STOA assumes objects seldom change state or location. A timestamped observation can answer where something was. The paper does not specifically evaluate which relations remain valid now, when they should be retired, or when uncertainty warrants another observation.

Suppose a red cup was on the table, was later moved into a cabinet, and an identical cup took its place. The system must tell whether the old cup moved, whether the new cup is a separate instance, and when the old table relation ceased to hold. If the move occurred out of view, the last sighting remains a fact while the current state is unknown. Neither a persistent ID nor a high-scoring retrieved frame can settle those questions alone.

A follow-up could maintain **identity, timestamped observations with provenance, and current-state hypotheses** separately. Visibility, short-term tracking, depth, or optical flow after ego-motion compensation could support motion and reappearance hypotheses. Conflicting evidence could preserve the historical record and defer an update until it can be checked. With the detector, QA model, and retrieval budget fixed, compare original STOA, latest-observation overwrite, and evidence-gated updates. Separate camera-view changes from actual object motion, add occlusion, replacement, and open/closed state changes, and measure ID errors, stale-relation use, and update delay. Then test last-seen and current-location questions separately. This is a proposed experiment, not a result reported by the paper.

## Further Reading

- [VL-KnG, arXiv v3](https://arxiv.org/abs/2510.01483v3)
- [Embodied VideoAgent notes](/en/blog/Embodied-VideoAgent): depth, pose, and action evidence for updating object memory, a useful comparison for dynamic scenes.
