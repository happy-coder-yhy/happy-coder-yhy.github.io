---
title: 'Survey Notes: World-Action Models — From Future Prediction to Robot Control'
date: '2026-10-26'
summary: 'A reading map of World-Action Models organized around how future prediction helps robots act. Covers conceptual boundaries, joint prediction and inverse dynamics, shared-backbone and dual-system architectures, and the path from video priors to action grounding. Separates predictive quality from control evidence across manipulation, navigation, and driving, then examines open questions in geometry, memory, neural simulation, and inference efficiency.'
tags: ['World-Action Models', 'World Models', 'Robot Learning', 'Embodied AI', 'VLA', 'Survey']
category: 'research'
venue: 'arXiv 2026'
status: 'preprint'
year: 2026
arxiv: 'https://arxiv.org/abs/2609.16074'
project_page: 'https://rcl-robotics.github.io/Awesome-World-Action-Models/'
---

## Paper Info

- **Title**: World-Action Models for Robot Learning and Control: A Survey
- **Authors**: Zuxing Lu, Hongjia Zhai, Guanzhi Wang, Huajian Zeng, Jiaqi Yang, Jingyu Liu, Lei Cheng, Yuantai Zhang, Yuheng Qiu, Zezhou Cheng, Ivan Laptev, Danfei Xu, Benjamin Riviere, Giuseppe Loianno, Eric Xing, Xingxing Zuo
- **Type**: Survey Paper
- **Version read**: arXiv:2609.16074v1, September 13, 2026, 19 pages
- **Publication status**: arXiv preprint. The LaTeX journal-template text in the PDF header is not publication metadata.
- **Resources**: [Paper](https://arxiv.org/abs/2609.16074v1) · [Project page and paper library](https://rcl-robotics.github.io/Awesome-World-Action-Models/)

These notes follow a survey structure: **scope → taxonomy → comparison of approaches → evaluation evidence → open questions → personal assessment**. The main account follows the PDF above; additional checks against representative papers and evaluation protocols are linked where used. Experimental ideas in “Personal Insight” are my own extrapolations.

## Reading Summary: What Does This Survey Establish?

**A World-Action Model (WAM) connects future-world prediction with executable action generation, allowing a robot to act according to anticipated consequences.** That connection can operate during training, inference, or policy improvement. The prediction target can be images, features, geometric states, or latent variables.

Three points stand out to me:

1. **Classify the prediction–action relationship, architecture, and deployment behavior separately.** A jointly trained model may decode actions directly or generate futures first. A shared backbone can also implement an inverse-dynamics interface.
2. **Video priors and action grounding supply different supervision.** Large video collections provide motion and interaction experience; robot trajectories with action labels connect that experience to the control space of particular hardware.
3. **Evaluation ultimately has to establish control utility.** Video realism, trajectory error, task success, and feedback latency answer different questions and need to be considered together.

The survey contributes an account of these design relationships and their application contexts. It does not provide a unified reranking of all methods retrained with identical data, compute, and tasks. Main sources: Sec. II–V of the paper.

## 1. Scope: Which Research Threads Do WAMs Connect?

Robots operate under partial observability. Cameras cannot fully reveal internal object states, occluded information, or contact forces, and a current observation may not identify task progress. A locally plausible action can make a later goal unreachable. This motivates the survey’s move from reactive policies toward predictive control.

Sec. II and Fig. 2 identify four foundational threads:

<div className="overflow-x-auto">

| Research thread | Main learning target | Contribution and boundary |
| --- | --- | --- |
| World models and model-based RL (MBRL) | Predict subsequent states, latents, or rewards given states and actions | Supply dynamics, imagined rollouts, and planning tools; policies and world models can also be trained separately |
| Video generative models (VGMs) | Generate future observations from visual history and text | Supply temporal priors and visual plans; an action interface must connect those plans to a robot |
| Latent action pretraining (LAPA) | Infer compact behavior representations from changes between observations | Makes action-free video usable; latent actions still need alignment with physical controls |
| Vision-Language-Action models (VLAs) | Predict actions or action chunks from vision, language, and history | Supply a general policy interface; the basic formulation does not explicitly predict future state trajectories |

</div>

Under this survey’s working definition, a WAM connects future-state modeling and action generation within a shared learning or inference process. Useful questions to ask of any system are: **What is predicted? How does prediction affect action? How are actions executed? How do execution outcomes feed back?**

This is a broad robotics-control perspective. The survey covers unified video–action models, world-model-guided external planning, and imagined policy learning. Each method’s concrete control interface still matters when interpreting the umbrella term.

## 2. Method Map: Locate a WAM Along Five Axes

Sec. III organizes methods by components, transition modeling, architecture, training pipeline, and data modality and scale. The first three axes are explained here; training and data follow in the next section.

### 2.1 Components: How Does a World Representation Become a Control Signal?

A WAM can be decomposed into four functional modules:

- **Language encoder**: CLIP, T5, or an autoregressive language model converts instructions into task conditioning.
- **Visual encoder**: Image/video VAEs, representation encoders such as DINO or SigLIP, and point-cloud, occupancy, or multi-view encoders determine the space in which the model predicts the world.
- **Predictive backbone**: A multimodal Transformer trained from scratch, or a pretrained video generator adapted with robot data, models temporal evolution.
- **Action decoder**: Discrete action tokens, latent action models, or continuous diffusion/flow heads convert internal representations into control outputs.

Two choices directly affect control. First, pixel and video-latent spaces make generative priors easier to reuse, while geometric and feature spaces may better expose task-relevant state. Second, action tokens suit sequence modeling but introduce quantization error; continuous sampling heads represent multimodal action distributions at a sampling cost. Latent actions provide an intermediate interface across data sources, but decoding them for a particular robot still requires grounding.

### 2.2 Transition Modeling: Joint Prediction and Inverse Dynamics

To simplify the notation in Sec. II-C, let `h` denote observation history, `l` the language instruction, `O` a future observation sequence, and `A` a future action chunk.

**Joint prediction** models:

```text
p_joint(O, A | h, l)
```

Futures and actions are learned within a shared generative process. Predictive supervision can encourage action representations to retain task progress and interaction information. GR-1, GR-2, and UWM are among the survey’s examples. The important questions are how visual prediction is balanced against action accuracy and where the benefit of joint training comes from.

**Inverse dynamics (IDM)** uses a plan-then-act decomposition:

```text
O ~ p_plan(O | h, l)
A ~ p_idm(A | h, O)
```

The first step describes an intended visual or state change; the second maps that change to actions. This interface can transfer motion experience from video pretraining to different robots. Its difficulties include the reachability of predicted targets and the reliability of converting future states into controls.

The two categories overlap. A joint distribution admits conditional factorization, and a single network can implement IDM through attention masks or modality-specific noise conditions. **Joint prediction describes coupling in learning and generation; inverse dynamics describes an interface for inferring actions from state changes.** Classifying a method requires examining both its training objective and its inference procedure.

### 2.3 Architecture: Shared Backbone and Dual Systems

![Two axes of WAM architecture: shared or separate backbones, and joint prediction or inverse-dynamics interfaces](/images/blog/world-action-models-survey/architecture-taxonomy.png)

*Source: Lu et al., Fig. 5, p. 7; surrounding text cropped. The four designs illustrate combinations of the two axes. [Source PDF](https://arxiv.org/pdf/2609.16074v1#page=7).*

<div className="overflow-x-auto">

| Architecture | Joint-prediction interface | Inverse-dynamics interface |
| --- | --- | --- |
| **End-to-end / shared backbone** | Couple future and action generation within one model | Use conditioning and information-flow design to map futures to actions within the same model |
| **Dual system / separate experts** | Coordinate visual and action experts through shared attention, MoT, or related mechanisms | A world module supplies predictions and an action module decodes controls through an explicit interface |

</div>

End-to-end designs support shared representations and unified pretraining, while requiring coordination of modality alignment and training objectives. Dual systems make visual-prior reuse, action-space adaptation, and different execution frequencies easier to organize, at the cost of interface errors and scheduling complexity.

Also record **whether inference explicitly generates a future**. The survey describes Fast-WAM and GigaWorld-Policy as more implicit interfaces: they retain the world–action training connection while allowing direct action decoding at deployment. This choice affects latency and cannot be inferred from the WAM label or architecture diagram alone.

## 3. Training and Data: From Video Experience to Action Grounding

### 3.1 Pretraining: Learn Time, Actions, and Their Correspondence

Sec. III-D separates pretraining into spatiotemporal representation learning, action representation learning, and video–action alignment.

- **Spatiotemporal representations**: Learn object motion, interaction, and scene evolution from large video collections. Prediction can also operate in a JEPA-style feature space to reduce pixel-reconstruction demands.
- **Action representations**: Discretize or continuously parameterize recorded controls, or learn latent actions from action-free video.
- **Video–action alignment**: Combine policy generation, forward dynamics, inverse dynamics, and video-generation objectives to connect visual changes with controls.

[UWM](https://arxiv.org/abs/2504.02792) makes these four interfaces concrete. It assigns independent diffusion timesteps to video and actions; different conditioning configurations represent a policy, forward dynamics, inverse dynamics, and a video generator. This also illustrates how a model’s capabilities depend on the conditioning combinations encountered during training.

### 3.2 Post-Training: Adaptation, Synthetic Data, and Policy Improvement

Post-training follows three main routes:

1. **Policy fine-tuning** adapts sensing, action spaces, and deployment conditions with robot demonstrations. LoRA, adapters, and residual action heads can limit the scope of updates. IDM pipelines must also reduce mismatch between visual plans and action execution.
2. **Data augmentation** changes appearance, lighting, or scenes, or generates new trajectories and adds pseudo-action labels. The former requires checking that original action labels remain valid; the latter depends on IDM or latent-action accuracy.
3. **Reinforcement learning and imagined improvement** optimize policies in simulation, real environments, or learned world models. World models can reduce physical interaction, but policies may exploit accumulated prediction errors and reward-model bias.

### 3.3 The Data Pyramid: Scale and Control Supervision Have Different Roles

![WAM data modalities and data pyramid: internet video, egocentric demonstrations, and robot trajectories provide different priors and action-grounding signals](/images/blog/world-action-models-survey/data-pyramid.png)

*Source: Lu et al., Fig. 7, p. 9; surrounding text cropped. The pyramid illustrates data roles conceptually; it is not a fitted scaling law. [Source PDF](https://arxiv.org/pdf/2609.16074v1#page=9).*

<div className="overflow-x-auto">

| Data layer | Main supervision | What still needs to be resolved |
| --- | --- | --- |
| Internet video | Broad motion, object-interaction, and scene priors | Camera motion, editing, and object motion are mixed; robot action labels are usually absent |
| Egocentric / human demonstrations | Task-relevant procedures, intent, and hand–object interaction | Human and robot morphology, coordinate frames, and control spaces differ |
| Embodied robot trajectories | Directly paired observations, proprioception, actions, and physical outcomes | Collection is expensive and task/hardware coverage is limited |

</div>

The survey also discusses language, multi-view vision, 3D geometry, touch/audio, and proprioception. They expose different state variables: vision reveals object positions, touch can reveal contact or slip, and proprioception supplies robot pose under occlusion. Data mixtures should reflect the task; total hours or trajectory counts alone do not establish supervision quality. The scaling discussion in Sec. III-E primarily organizes data roles and does not establish a universal quantitative scaling law for WAMs.

## 4. Comparing Approaches: Where Does Prediction Add Value?

Sec. IV and Table I cover manipulation, navigation, and autonomous driving. When comparing methods, I first record where prediction contributes to the system.

<div className="overflow-x-auto">

| Where prediction is used | Examples discussed in the survey | Intended benefit | Evidence to check |
| --- | --- | --- | --- |
| Predictive representations during training | GR-1/GR-2, VLA-JEPA, LAWM | Shape representations needed for action | Does predictive supervision improve generalization with data and model budgets fixed? |
| Online future and action generation | DreamZero, Cosmos Policy, WorldVLA | Support action generation or candidate selection with future states | Are predictions executable, and does extra sampling improve task outcomes? |
| World modeling in training, direct actions at test time | Fast-WAM, GigaWorld-Policy | Retain training benefits while reducing online generation cost | Which tasks retain performance without explicit imagination, and which suffer? |
| World-model-assisted external planning | Pathdreamer, DreamWalker, navigation forward-dynamics models | Supply candidate views, latent states, paths, or failure estimates | Path efficiency, failure rate, and recovery under matched budgets |
| Policy optimization in imagined environments | World4RL, World-VLA-Loop, WMPO | Improve policies with synthetic experience | Do improvements in imagination transfer to physical execution? |
| Structured-state prediction | OccWorld, PointWorld, ManiGaussian++ | Preserve occupancy, geometry, or interaction-relevant information | Does state consistency improve collision, contact, and control outcomes? |

</div>


These uses can coexist. [Cosmos Policy](https://arxiv.org/abs/2601.16163) generates actions, future states, and value estimates and supports test-time planning. [Fast-WAM](https://arxiv.org/abs/2603.16666) separates video co-training from explicit test-time imagination through controlled variants; its results support retaining the former while skipping the latter on the evaluated tasks. Both motivate asking exactly where prediction is useful.

Application constraints also differ:

- **Manipulation** requires fine interaction state for contact, occlusion, deformable objects, and bimanual coordination. Visually plausible changes still need physical validation.
- **Navigation** depends on long-horizon spatial reasoning, traversability, and memory. Latent states or semantic maps can directly support waypoint selection.
- **Autonomous driving** adds multi-view consistency, other traffic participants, collision avoidance, and real-time requirements. Video generation, occupancy prediction, planning, and data synthesis serve different roles.

## 5. Evaluation Evidence: What Supports the Claim That Prediction Helps Control?

### 5.1 Separate Datasets, Benchmarks, and Simulators

Sec. V and Tables II–III emphasize that evaluation resources serve different purposes.

- **Pretraining and adaptation data**: DROID, BridgeData V2, and Open X-Embodiment supply robot trajectories; Ego4D, EgoDex, and HowTo100M supply human activity and interaction video. Dataset size alone does not establish control ability.
- **Manipulation benchmarks**: LIBERO, CALVIN, RoboTwin, RoboCasa, and ManiSkill cover different task compositions, long-horizon chains, scenes, and control conditions. Success rates require the corresponding protocol.
- **Navigation environments and tasks**: Matterport3D and Habitat provide environments, while R2R/RxR and their continuous-environment variants define tasks such as instruction following.
- **Driving resources**: Recorded datasets such as nuScenes support prediction and offline evaluation. CARLA, Bench2Drive, and NAVSIM provide different forms of planning evaluation; their feedback and traffic-interaction assumptions need to be specified individually.
- **Foundational RL benchmarks**: Atari, DMControl, and Procgen help diagnose dynamics learning and sample efficiency. Contact, sensing, and hardware constraints still require robot evaluation.

**Additional protocol check: qualify “closed loop” for NAVSIM.** The survey discusses it alongside closed-loop planning resources. The [official NAVSIM traffic-policy documentation](https://github.com/autonomousvision/navsim/blob/main/docs/traffic_agents.md) states that v2 can make surrounding vehicles react to the ego vehicle, but the ego planner still commits to one plan without receiving environment updates for replanning. Scores therefore require a version and protocol description; they do not directly establish driving with continuous perception and replanning.

### 5.2 What Does Each Metric Establish?

<div className="overflow-x-auto">

| Evidence layer | Common metrics | What they support | Limitation when used alone |
| --- | --- | --- | --- |
| Visual prediction | FID, FVD, LPIPS, PSNR, SSIM | Distributional, perceptual, or reconstruction quality | Do not establish reachability, correct contact, or task completion |
| State and trajectory | mIoU, ADE/FDE, L2, ATE/RPE | Occupancy, trajectory, or pose consistency | Low errors can still hide collisions and feedback failures |
| Tasks and planning | SR, CALVIN chain length, SPL, NE, nDTW, driving scores | Completion, long-horizon ability, and path efficiency | Do not isolate prediction’s contribution or allow protocol-free comparisons |
| Deployment and interaction | Latency, feedback frequency, collisions, infractions, comfort | Whether control runs promptly and reliably | Mean latency or a single safety measure cannot capture every failure mode |

</div>

I look for a chain of evidence: **predictive quality → alignment with actions → downstream control improvement → robustness under perturbation and distribution shift**. This is my way of organizing reading and experiments, rather than an additional standardized score proposed by the survey.

### 5.3 How Far Should We Take the Survey’s Conclusions?

The survey supports the view that prediction can help through representation learning, online planning, and policy optimization, with data and computation tradeoffs between approaches. It does not establish a universally preferable WAM design or a monotonic relationship between video realism and control quality.

My main reservations are:

- Papers differ in data, backbones, robot platforms, sampling budgets, and protocols. Reported results and scales cannot form a single controlled leaderboard.
- This is a taxonomy and technical overview. The version read does not provide a reproducible systematic-search, inclusion/exclusion, and evidence-quality-rating procedure, so its coverage should not be treated as exhaustive.
- The project website is maintained over time. These notes summarize the September 13, 2026 PDF; later additions and publication changes require checking their original sources.

## 6. Open Questions: Six Groups of Bottlenecks

The six subsections of Sec. VI lead to the following research questions. The final column gives evaluation signals I would look for.

<div className="overflow-x-auto">

| Open question | Tension discussed by the authors | Evaluation signals I would examine |
| --- | --- | --- |
| Motion intent and action alignment | Ground broad video experience in specific hardware while preserving visual priors | Retention of existing capabilities and action accuracy after task or embodiment adaptation |
| World–action factorization | Prediction seeks fidelity, while policies seek reward and may exploit optimistic forecasts | Transfer of imagined gains and changes in model exploitation under separate objectives |
| Spatial and multi-view consistency | Single-view prediction struggles with geometry, object permanence, and cross-camera correspondence | Consistency after occlusion, across views, and during collision/contact events |
| Long-horizon memory | Larger observation windows are costly, but progress and critical events must be retained | State recovery, subtask continuation, failure recovery, and memory cost |
| Neural simulation and closed-loop learning | Synthetic rollouts provide interaction, but accumulated errors and reward bias can mislead policies | Real-policy improvement from failure data and model exploitation as rollouts lengthen |
| Inference latency and efficiency | Video sampling, candidate generation, and action decoding delay feedback | End-to-end latency, effective feedback frequency, and success under matched hardware and budgets |

</div>

World–action factorization is especially useful to remember: **learning how the world evolves and learning which actions a robot should choose can use different objectives.** While discussing unified models, the survey also leaves room for modularity, separate training, and flexible inference. The useful degree of integration depends on control benefits and errors.

## Personal Insight: How Could This Map Guide a Research Project?

The following are my interpretations and experimental ideas, not established results.

### 1. Ask Which Future Information Control Needs

The central question is whether a future representation retains decision-relevant information. Fine texture may contribute little, while contact state, slipping, an occluded object’s position, or continued goal reachability can change the required action.

For an entry point through stereo depth or geometric representations, compare RGB, RGB-D, occupancy, and feature prediction with the same policy and data budget. Measure success and latency on thin structures, occlusion, viewpoint changes, and contact tasks, while tracing how geometry-estimation errors affect control.

### 2. Separate Training Benefits from Online Imagination Benefits

I would start with three controlled conditions: an action-learning baseline; future-prediction training with direct action output at deployment; and the same predictive training with explicit imagination at deployment. Match data, model capacity, and inference budgets where possible, and report costs that cannot be fully matched.

This separates whether future prediction improves representations, whether online imagination adds further value, and whether that value pays for slower feedback. Long-horizon tasks, delayed consequences, and perturbation recovery may reveal larger differences between these conditions; that remains an empirical question.

### 3. Make Uncertainty Change Control Behavior

The survey stresses model bias and reliable deployment, leaving room to investigate how predictive uncertainty should enter control. One testable design is to shorten action chunks, observe again, or replan more often when candidate futures disagree or action decoding is unreliable.

Evaluation should jointly track success, recovery attempts, risk events, and additional compute. Predictive confidence has control value when these responses help under real feedback.

### 4. Combine Explicit Memory with Verifiable Subgoals

The paper distinguishes model-integrated memory from external agentic harnesses. One possible design is to let a planner maintain subgoals, execution records, and failure conditions; let a WAM supply local futures and actions; and check after execution whether the observed state matches the expected outcome.

The experiment must establish whether memory and verification reduce repeated actions, forgotten state, and accumulated errors, and whether high-level scheduling preserves the required low-level control frequency. The survey motivates this interface; its effectiveness depends on the task and implementation.

## Further Reading: Follow the Question

1. **Understand scope and taxonomy**: Read [the survey v1](https://arxiv.org/abs/2609.16074v1), especially Sec. II–III and Figs. 4–5, then locate methods in the [project paper library](https://rcl-robotics.github.io/Awesome-World-Action-Models/).
2. **Understand the four generative interfaces**: [Unified World Models](https://arxiv.org/abs/2504.02792), focusing on independent noise conditions for video and actions.
3. **Understand video priors for task and embodiment transfer**: [DreamZero: World Action Models are Zero-shot Policies](https://arxiv.org/abs/2602.15922), checking exactly which tasks, environments, and training data define zero-shot evaluation.
4. **Understand actions, futures, and values in planning**: [Cosmos Policy](https://arxiv.org/abs/2601.16163), separating policy generation from test-time planning.
5. **Test whether inference must generate futures**: [Fast-WAM](https://arxiv.org/abs/2603.16666), focusing on controlled comparisons of training objectives and deployment procedures.
