---
title: 'Paper Notes: Externalization in LLM Agents — A Unified Review of Memory, Skills, Protocols and Harness Engineering'
date: '2026-07-20'
summary: 'Systematically organize the four dimensions of knowledge externalization in LLM Agents: Memory systems, Skill orchestration, Communication protocols, and Harness engineering. This paper constructs a unified analytical framework to help understand the design and evaluation of Agent systems.'
tags: ['LLM Agent', 'Knowledge Externalization', 'Memory Systems', 'Survey', 'Harness']
category: 'research'
venue: '2026'
status: 'published'
year: 2026
---

## Paper Info

- **title**: Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering
- **author**: Zhou etc.
- **year**: 2026
- **type**: Review

## Core Framework: 4-Dimension Knowledge Externalization in LLM Agents

This paper presents a unified framework for knowledge externalization in LLM Agents, which consists of four core dimensions:

### 1. Memory

The memory management of agents is the foundation of knowledge externalization, mainly including:
- **short-term memory**: Maintenance of information within the context window
- **long-term memory**: Knowledge persistence and retrieval across sessions
- **working memory**: The temporary status during the execution of the current task

### 2. Skills

How agents organize and invoke their capabilities:
- **Tool Use**: Invoking external APIs and tools
- **Skill Composition**: Chaining multiple skills into complex workflows
- **Capability Discovery**: Dynamically identifying and acquiring new skills

### 3. Protocols

Communication mechanisms within and between agents:
- **MCP (Model Context Protocol)**: Standardized tool integration protocol
- **Inter-agent communication**: Message passing for multi-agent collaboration
- **Human-agent interaction**: Interfaces for agent-user interaction

### 4. Harness Engineering

Engineering infrastructure for Agent systems:
- **Experiment platform**: Unified experiment management and tracking
- **Evaluation framework**: Multi-dimensional Agent performance assessment
- **Deployment and operations**: Production deployment of Agent systems

## Personal Insight

### 1. What problem does the paper aim to solve?

#### Core Problem
Although progress in the LLM Agent field has been rapid, it remains fragmented (e.g., memory systems, tool use, multi-agent collaboration are each developing separately). There is a lack of a unified theoretical logic to explain why these different directions are emerging simultaneously and how they are related.

#### Specific Objectives
- Propose **"Externalization"** as the central thread running through LLM Agent design, explaining why shifting cognitive burdens from inside the model to external structures (memory, skills, protocols, etc.) leads to more reliable and governable agent behavior.
- Build a system-level framework that brings **Memory**, **Skills**, **Protocols**, and the **Harness** under a single analytical perspective, clarifying their coupling and division of labor.
- Guide future research from a model-centric view toward a system-level view of **co-evolution between models and external infrastructure**.

### 2. What previous work exists, and what are the pain points?

#### Previous Work
- **Capabilities in Weights (Weights Era)**: Such as GPT-4, DeepSeek, etc., compress knowledge and reasoning capabilities into model parameters through large-scale pre-training and fine-tuning.
- **Capabilities in Context (Context Era)**: Such as Prompt Engineering, Chain-of-Thought, ReAct, RAG, etc., guide model behavior by dynamically injecting examples, reasoning steps, or retrieved documents.
- **Capabilities through Infrastructure (Harness Era)**: Such as AutoGPT, BabyAGI, LangGraph, AutoGen, etc., introduce external loops, task queues, multi-agent collaboration, and other structures.

#### Pain Points
- **Fragmentation**: Research on memory, tools, multi-agent collaboration, etc., remains isolated, lacking a unified explanation.
- **Reliability Bottlenecks**: Models are unstable in long-horizon tasks, multi-step reasoning, tool invocation, and cross-session interactions, often suffering from forgetting, step-skipping, formatting errors, etc.
- **Governance Difficulties**: Model behavior is hard to audit, constrain, or roll back, especially in safety-sensitive scenarios.
- **Evaluation Bias**: Existing benchmarks primarily test the model itself, ignoring the significant contribution of external infrastructure, leading to overestimation of "model progress."

### 3. What innovative method does the paper use to address these pain points?

**Innovative Approach**: Propose and systematize the **"Externalization"** theoretical framework, redefining agent design as the process of "moving cognitive burdens from inside the model to external structures." Specifically:

- **Three Externalization Dimensions**:
  - **Memory**: Externalizes state across time (e.g., working context, episodic experience, semantic knowledge, personalized information), transforming the "recall" problem into a "recognition + retrieval" problem.
  - **Skills**: Externalizes procedural expertise (operational procedures, decision heuristics, normative constraints), transforming "improvised generation" into "selection + composition."
  - **Protocols**: Externalizes interaction structures (tool calls, inter-agent collaboration, user interaction), transforming "ad-hoc inference" into "structured exchange."

- **Harness**: Acts as the unifying layer, coordinating the three modules and providing runtime mechanisms such as loop control, sandboxing, human approval, observability, policy encoding, and context budget management.

- **Theoretical Support**: Introduces concepts from cognitive science – **Cognitive Artifacts** and **Complementary Strategies** – emphasizing that external structures improve agent reliability through "task restructuring" rather than mere augmentation.

Through this framework, the paper maps disparate research contributions to a unified "externalization" logic, explaining why these advances improve reliability, governability, and reusability.

### 4. What are the effects?

As a survey, its "effects" are reflected in:

- **Unified Domain Understanding**: Provides a common logical foundation for sub-fields like memory, skills, protocols, and the harness, allowing researchers to better position their own work within the overall framework.
- **Explains Practical Trends**: Clarifies why modern Agent systems (e.g., Claude Code, OpenAI Codex, AutoGen) increasingly move capabilities "outward" to external structures rather than relying solely on model upgrades.
- **Distills Design Principles**: Proposes a six-dimension Harness design framework (loop control, sandboxing, approval, observability, configuration, context management), offering systematic guidance for engineering practice.
- **Points to Future Directions**: Includes multi-modal externalization, embodied agents, self-evolving harnesses, shared infrastructure, security governance, evaluation methodologies, etc.

Although lacking quantitative experimental results, the paper validates the explanatory power and coverage of its framework through numerous existing system case studies (e.g., MemGPT, Voyager, MCP, A2A).

### 5. What are the limitations (and future directions)?

The paper explicitly identifies several open issues and limitations in its "Future Discussion" (Section 8):

- **Boundary Dynamics**: As models improve, some external functions may be "internalized." How to dynamically adjust the externalization boundary remains an open question.
- **Multimodality and Embodiment**: The current framework is text-centric. Extending to vision, speech, physical actions, and the "cerebrum-cerebellum" division in embodied agents requires further investigation.
- **Self-Evolving Harness**: How to enable the harness itself to adapt and self-optimize (e.g., via RL, program synthesis, evolutionary search) is still in early exploration.
- **Costs and Risks**:
  - **Cognitive Overhead**: Over-externalization may cause the model to spend excessive effort on module coordination rather than the task itself.
  - **Security Threats**: Such as memory poisoning, malicious skill injection, protocol spoofing – externalization expands the attack surface.
- **Shared Infrastructure**: Moving from private scaffolding to shared memory/skills/protocols raises unresolved issues around versioning, permissions, quality, and trust governance.
- **Evaluation Gaps**: Existing benchmarks fail to measure the gains from externalization (e.g., transferability, maintainability, recovery robustness, context efficiency, governance quality). New evaluation frameworks are urgently needed.

Additionally, the paper is primarily theoretical, lacking quantitative experiments or systematic comparisons. Future empirical research could quantify the relationships between "degree of externalization" and "task success rate, cost, and safety."

## Further Reading

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [AutoGPT: Autonomous Task Management with LLMs](https://github.com/Significant-Gravitas/AutoGPT)