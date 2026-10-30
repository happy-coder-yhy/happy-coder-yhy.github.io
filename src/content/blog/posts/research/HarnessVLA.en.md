---
title: 'Paper Notes: Harness VLA — Orchestrating Frozen VLAs with Memory-Guided Agents'
date: '2026-10-30'
summary: 'Harness VLA exposes a frozen vision-language-action policy as a retryable local contact primitive. A planner with task-specific and global memory handles semantic grounding, staging, transport, and recovery. Without changing deployment-time VLA weights, its main LIBERO-Pro result improves from 50.0% for the same backbone to 82.4%. These notes cover the method, kitchen and bimanual evaluations, Flash Mode, and the conditions behind the reported gains.'
tags: ['VLA', 'Embodied AI', 'Robot Manipulation', 'Agent Memory', 'Harness Engineering']
category: 'research'
venue: 'arXiv 2026'
status: 'preprint'
year: 2026
arxiv: 'https://arxiv.org/abs/2607.08448'
github: 'https://github.com/RLinf/RPent'
project_page: 'https://harnessvla.github.io/'
---

## Paper Info

- **Title**: Harness VLA: Steering Frozen VLAs into Reliable Manipulation Primitives via Memory-Guided Agents
- **Authors**: Yixian Zhang, Huanming Zhang, et al.; corresponding authors Wenbo Ding and Chao Yu
- **Year**: 2026
- **Type**: Research Paper
- **Version**: arXiv:2607.08448v5 in Zotero, dated September 24, 2026. These notes follow that PDF, including its tables and appendices.
- **Code**: [RPent](https://github.com/RLinf/RPent)

## Core Framework: Local Contact through a VLA, Task Organization through an Agent

Harness VLA addresses a common deployment problem: a robot may already know how to grasp objects and operate fixtures, yet follow a familiar training routine when the target changes, objects move, or short skills need a new composition. It exposes a frozen VLA as one tool in a fixed primitive library. A planner explicitly handles task semantics and spatial bindings, invoking the VLA from suitable local states.

The **harness** is the runtime between models and environment. It defines tool contracts, executes commands, returns observations, manages budgets and memory, and records outcomes. Much of the improvement comes from this organization around the policy.

![Harness VLA observations, planner, fixed primitives, and two memory layers](/images/blog/HarnessVLA/framework.png)

*Source: the framework portion of Figure 1. The planner receives RGB-D and robot state, consults both memories, and selects analytic control or the frozen VLA.*

### 1. A Fixed Interface for Analytic and Learned Control

The planner reads the language instruction, RGB-D observations, and robot proprioception, then emits one structured JSON command per turn. It does not directly predict joint actions or torques, or implement new skills at deployment.

- **Analytic primitives** include `MOVE_TO`, `MOVE_POSE`, `ROTATE_WRIST`, `ROTATE_PITCH`, `SET_GRIPPER`, and `RELEASE`. They handle movement, orientation, gripper control, and release through the environment's IK, servo, or motion solver.
- **The learned primitive, `VLA_ACT`**, wraps a pretrained VLA for contact-rich operations such as irregular grasping, constrained placement, button pressing, and drawer or faucet interaction.
- **Embodiment differences** are expressed through availability and arguments. RoboCasa365 adds `NAVIGATE_TO` and `MOVE_BASE`; RoboTwin binds calls to the left or right arm. The exposed subset varies by environment, while the vocabulary is fixed before evaluation.

A `VLA_ACT` call specifies a prompt, an action-chunk budget, and an early-return condition, such as stable object lifting or a local contact condition. Once it returns, the planner inspects observations and chooses transport, continuation, or re-staging and retry. A primitive's stopping condition only returns control; it does not substitute for the final task-success predicate.

### 2. Closed-Loop Execution: Ground, Act, and Check

The implementation uses a file-mediated REPL. The planner writes `command.json`, waits for execution, then reads refreshed state, logs, RGB-D, and per-pixel 3D coordinate maps, called world maps. Each action is followed by a new assessment.

Localization first identifies the target and pixels in RGB, then obtains metric coordinates using depth and camera calibration. The protocol samples multiple stable surface points, avoids boundaries, holes, and background, and re-localizes after relevant object, robot, or camera movement. The planner cannot query ground-truth simulator object poses.

For a task such as placing a bowl on a newly specified tray, the loop can be summarized as:

1. Identify the current bowl and tray from the instruction and observations.
2. Use analytic motion to establish a suitable pre-grasp configuration.
3. Invoke `VLA_ACT` for the local grasp.
4. Check whether the object actually rises with the gripper. After an empty grasp, re-localize, re-stage, and retry.
5. Once contact is stable, use analytic transport and release, then verify the task outcome.

The VLA supplies difficult-to-script contact behavior; the agent organizes that behavior around the current goal and geometry.

### 3. Two Memory Layers: Transfer Structure, Rebind Geometry

**Task Specific Memory** stores a successful solution from a reference instance. A JSONL command trace records what happened and in what order; a JSON summary explains why the strategy worked and what failed. Together they provide a procedural prior for grasping, transport, verification, and other transitions.

**Global Memory** stores cross-task operating rules and failure models: how to recognize an empty grasp, which staging choices are unstable, and why visual proximity alone does not establish success.

Old coordinates belong to the reference scene. At deployment, objects, destinations, fixtures, and target surfaces must be localized again before filling in current arguments. The main text describes parameterized traces; the appendix clarifies that even when reference numbers remain in a trace, they must not be replayed literally. The transferable content is the organization of actions.

### 4. Exploration Followed by Restricted Deployment

During **bootstrapping**, the agent explores reference seed `s0` for each task. It can reset the environment and test staging poses, invocation timings, and stopping rules, then store successful traces and failure knowledge. One reference seed does not imply only one attempt.

Evaluation retrieves this memory under new initial states, disables resets, and tightens the budget. LIBERO and LIBERO-Pro use ten held-out seeds per task; RoboCasa365 uses five. Reference seeds do not count toward reported evaluation.

“Frozen” also has a specific scope. LIBERO uses an RLinf-released π0.5-SFT checkpoint, RoboCasa365 uses RLDX-1, and RoboTwin uses LingBot-VLA after the authors' RoboTwin post-training. The checkpoints remain unchanged during deployment. The framework still relies on earlier training, data, and reference-seed exploration.

### 5. Flash Mode: Compile Successful Runs into Regroundable Task Cards

For tasks with a fixed subgoal order, Flash Mode compiles successful trajectories into task cards containing primitive order, VLA prompts, and non-spatial arguments. At runtime, a VLM identifies visual anchors, depth and calibration provide their positions, and anchor-relative waypoints are updated. Grasp checks and limited retries are predefined; there is no online agent planning.

This suits procedures with directly localizable objects and anticipated recovery cases. A long fixed routine can qualify, while a short task with a new subgoal order or unexpected failure may still require online planning. The LIBERO implementation in Appendix G mainly updates horizontal offsets near anchors, retaining recorded heights and non-spatial arguments; it is not a general 3D replanner.

## Personal Insight

### 1. What Problem Does the Paper Aim to Solve?

The central question for me is: **why does a VLA's local motor competence fail to translate into reliable task execution?**

A policy may grasp a milk carton yet ignore a different destination, or transport an object toward a familiar training location after the layout changes. These failures involve task binding, sequencing, and recovery. Harness VLA assigns those responsibilities explicitly to a planner and uses the policy under more familiar local contact conditions.

### 2. What Previous Work Exists, and What Are Its Pain Points?

- **End-to-end VLAs** directly generate actions from vision and language. They offer strong contact behavior, but entangle semantics, long-horizon organization, and motor execution, making distribution-shift failures difficult to diagnose and repair.
- **Programmatic robot agents**, including Code as Policies and ProgPrompt, compose perception and control APIs well. Purely hand-designed control remains brittle for complex grasping, fine insertion, and fixture manipulation.
- **Skill discovery and expanding libraries** enlarge capability by adding skills, with corresponding validation and maintenance costs. Harness VLA instead fixes the vocabulary and asks how far better memory-guided use of existing tools can go.

Its contribution connects contact control and task organization through an auditable interface, while preserving experience whose geometry can be bound again.

### 3. What Method Addresses These Pain Points?

I see three interdependent design choices:

- **Make local failure recoverable.** VLA execution can return early, be inspected, and restart after re-staging. An empty grasp need not invalidate the entire long-horizon rollout.
- **Handle deployment changes at the task level.** The planner resolves the current target and uses analytic motion to establish a VLA-compatible local state before delegating contact.
- **Store inspectable external experience.** Task traces preserve procedural structure; global memory preserves failure mechanisms. New execution can adapt to observations without writing all experience back into policy weights.

This extends a basic “LLM selects a skill” design by specifying starting conditions, stopping conditions, feedback, and recovery.

### 4. How Well Does It Work?

The most informative comparisons use the same frozen VLA directly and through the harness. Values below come from Tables 2, 3, 4, and 6. CC denotes Claude Code; Codex and CC are two planner implementations.

<div className="overflow-x-auto">

| Evaluation | Direct frozen VLA | Harness VLA | Success-rate change |
| --- | --- | --- | --- |
| Standard LIBERO | πRLinf: 95.3% | CC: 96.0% | +0.7 percentage points |
| LIBERO-Pro | πRLinf: 50.0% | Codex: 72.1%; CC: 82.4% | +32.4 points with CC |
| RoboCasa365 Target50 | RLDX-1: 30.0% | Codex: 57.2%; CC: 48.8% | +27.2 points with Codex |
| RoboTwin C2R | LingBot-VLA: 50.4% | Codex: 58.0%; CC: 58.4% | +8.0 points with CC |

</div>

**The evaluation conditions matter:**

- **Standard LIBERO:** CC succeeds on 384/400 trials, largely preserving the backbone's competence. AtomVLA reaches 97.0% in the same table, so this is not a universal lead.
- **LIBERO-Pro:** 800 trials cover instruction redirection (T) and position swapping (S) across four task families. The headline comparison is +38.6 points over RATS at 43.8%, but RATS reports only six cells excluding LIBERO-10, while the harness overall includes eight. The same-backbone 50.0% → 82.4% comparison more directly exposes the orchestration gain.
- **RoboCasa365:** the experiment covers Target50, with 50 tasks and 250 rollouts, rather than all 365 tasks. Codex reaches 92.2%, 61.3%, and 13.8% on Atomic-Seen, Composite-Seen, and Composite-Unseen. Unseen compositions remain difficult. The PDF abstract/prose gives 57.1% and 48.6%, while Tables 4 and 22 give 57.2% and 48.8%; these notes follow the tables.
- **RoboTwin C2R:** 50 tasks and 250 rollouts test transfer of clean-setting task memory to randomized scenes, with no further exploration or fine-tuning there. “Zero-shot” describes transfer into the randomized setting; it still uses clean task memory and differs from evaluation without memory retrieval.

**What happens without target-setting memory?** Table 5 tests LIBERO-Pro Goal without its target Task Specific Memory and corresponding Global Memory. CC reaches 79.0% for instruction redirection and 31.0% for position swapping, versus 87.0% on both with memory. Online reasoning retains substantial semantic rebinding, while spatial changes benefit from the reference solution's staging and invocation structure. This comparison does not independently isolate the two memory layers.

**Mechanism evidence** is consistent with the decomposition. Figure 4 caps VLA invocations per episode: success rises rapidly over the first few calls and then saturates. In Appendix F, `VLA_ACT` accounts for 15.8% of primitive calls in LIBERO, 35.3% in RoboCasa365, and 47.4% in RoboTwin. These are call-count shares, not shares of runtime or computation. The retry curve alone also cannot separate the effects of more attempts and better staging.

**Additional planner results:** Appendix H reports 92.63% on LIBERO-Pro (741/800) and 59.20% on RoboCasa365 (148/250) with GPT-6 Astra, including 42.50% on Composite-Unseen. Planner capability materially affects the outcome; comparisons should identify the planner, VLA checkpoint, and memory version together.

**Flash and hardware:** Flash Mode (max) reaches 72.63% (581/800), but card selection and reporting use the same seeds. It is a retrospective best-card result, not independent held-out evaluation. Table 7's Flash value of 56.17 seconds measures source-trajectory tool time; Codex's 529.23/344.17 seconds measures planner time. They cannot establish an end-to-end speedup. Dual-Franka recordings demonstrate redirection, visual sorting, missed-grasp recovery, bead pouring, and plate wiping, but provide qualitative cases rather than comparative success-rate estimates. Operators still participate in scene resets and success confirmation.

### 5. What Remains Unresolved?

The following separates the authors' limitations from my own research questions. My current interest is the chain from temporal evidence to reliable memory, experience, and skills. Harness VLA could serve as a fixed execution framework for studying how evidence constrains memory writes, failure attribution, and experience validation. These extensions remain research proposals.

- **High- and low-level coordination remains coarse.** The authors identify weak planner–VLA feedback coupling and the absence of joint optimization using environmental rewards or human preferences. Feedback at primitive boundaries helps; communicating fine-grained failures during execution remains an open problem.
- **Reference procedures differ from within-episode episodic memory.** Task Specific Memory mainly supplies a reference solution's procedural skeleton. It is not equivalent to a record of objects, states, and events in the current episode. I want to distinguish an issued grasp command, an inferred grasp, and an observation-supported grasp, retaining evidence provenance and validity times. Old observations remain historical evidence without indefinitely serving as current facts. These memory functions need separate ablations.
- **Costs need a complete accounting.** Frozen weights still require reference-seed exploration, retries, memory maintenance, VLM localization, and online inference. Flash also needs independent card-selection/test seeds and comparable timing definitions.
- **Temporal evidence should verify action consequences.** The authors identify limited structural reasoning in clutter. For my depth and optical-flow work, motion compensation, visibility, and gripper–object relative motion could help distinguish empty grasps, slips, and localization jumps. Such evidence could guide continuation, re-observation, escalation to slower reasoning, or deferral of state confirmation and memory writes. Only observations available at decision time may be used; temporal stability does not establish correctness, and confidence requires calibration.
- **Transferable skills need validation beyond a failure summary.** The paper already stores global success rules and failure models, so adding memory and retries is not itself a new contribution. A stronger question is how to retain supporting evidence, applicability conditions, and counterexamples for candidate experience, then keep, revise, or withdraw it after subsequent execution. A skill could initially be a parameterized observe–act–check procedure with conditional branches. Acquiring a contact behavior absent from the underlying policy requires additional policy learning.

The question I would most like to test is: **can better temporal evidence reduce erroneous memory and experience propagation, improving both current recovery and adaptation on later tasks?** An initial study could fix the planner, harness, and VLA, diagnose geometry, memory, and skill bottlenecks on a small set of occlusion, revisit, and recovery tasks, then compare ordinary reflection-based writes with evidence-supported candidate validation. Evaluation should distinguish within-episode retries, cross-task online updates, and testing with a frozen experience library. Retry and call budgets must be matched, while tracking false completion judgments, the persistence of incorrect memory, and negative transfer. Better individual grasps or higher final success alone would not establish effective memory and skill evolution.

## Further Reading

- [Harness VLA, arXiv v5](https://arxiv.org/abs/2607.08448v5): Section 2 for the method, Section 3 for experiments, Appendices A/E for memory and interaction, Appendix G for Flash evaluation, and Appendix H for additional planners.
- [Harness VLA project page](https://harnessvla.github.io/)
- [RPent repository](https://github.com/RLinf/RPent): distinguish its evolving implementation and results from this paper version.
- [Code as Policies](https://code-as-policies.github.io/): related work on composing perception and control through programs.
- [Earlier notes: Externalization in LLM Agents](/en/blog/externalization-llm-agents): a complementary perspective on memory, skills, and harnesses.
- [Earlier notes: World-Action Models Survey](/en/blog/world-action-models-survey): a different route toward control through joint prediction and action modeling.
