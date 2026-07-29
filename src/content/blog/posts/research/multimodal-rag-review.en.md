---
title: 'Paper Notes: Ask in Any Modality — A Survey on Multimodal Retrieval-Augmented Generation'
date: '2026-07-29'
summary: 'Summarizes the ACL Findings 2025 survey Ask in Any Modality, focusing on the methods and representative works in multimodal RAG: retrieval, reranking, cross-modal fusion, context augmentation, generation, training, robustness, agentic systems, datasets, metrics, and future directions.'
tags: ['Multimodal RAG', 'Retrieval-Augmented Generation', 'Cross-Modal Retrieval', 'Multimodal Fusion', 'Survey']
category: 'research'
venue: 'ACL Findings 2025'
status: 'published'
year: 2025
---

## Paper Info

- **title**: Ask in Any Modality: A Comprehensive Survey on Multimodal Retrieval-Augmented Generation
- **author**: Mohammad Mahdi Abootorabi, Amirhosein Zobeiri, Mahdi Dehghani, Mohammadali Mohammadkhani, Bardia Mohammadi, Omid Ghahroodi, Mahdieh Soleymani Baghshah, Ehsaneddin Asgari
- **year**: 2025
- **type**: Survey Paper
- **venue**: Findings of the Association for Computational Linguistics: ACL 2025
- **resource**: https://multimodalrag.github.io

## Core Framework: A Method Taxonomy for Multimodal RAG

This survey formulates multimodal RAG as follows: given a multimodal query \(q\) and a multimodal corpus \(D=\{d_1,d_2,\dots,d_n\}\), the system encodes text, images, audio, video, document pages, or other sources with modality-specific or universal encoders, retrieves external evidence \(X\) by relevance thresholds or Top-K ranking, and then generates a response through \(G(q, X)\).

Compared with text-only RAG, multimodal RAG is not just about retrieving more context. Its real difficulty lies in **modality selection, cross-modal alignment, heterogeneous evidence fusion, evidence transparency, long-context efficiency, and robustness against noisy or poisoned multimodal sources**. The survey organizes recent work into six major methodological categories.

### 1. Retrieval Strategies

The retrieval layer includes both efficient search in shared embedding spaces and modality-specific retrievers.

- **Unified embeddings and efficient search**: CLIP, BLIP, ALIGN, and FLAVA established the foundation for image-text alignment. MARVEL, Uni-IR, GME, VISTA, and LLaVE improve inter-modal discrimination through hard negatives, balanced sampling, or stronger multimodal encoders. Large-scale retrieval relies on MIPS, TPU-KNN, ScaNN, MAXSIM, BanditMIPS, MUST, FARGO, and ADQ to balance recall, latency, and storage. MuRAG and RA-CM3 are early representative systems that connect large-scale image-text memory with generative models.
- **Text-centric retrieval**: BM25, MiniLM, and BGE-M3 remain common building blocks. ColBERT and PreFLMR preserve fine-grained semantics through token-level interaction. RAFT, CRAG, and M2-RAG further emphasize reliable text-span citation, robust retrieval, and multimodal QA.
- **Vision-centric retrieval**: EchoSight, ImgRet, VISA, RAMM, eCLIP, VQA4CIR, and Pic2Word support image-to-image search, composed image retrieval, or medical visual QA. The core issue is how to combine visual similarity, textual semantics, and external knowledge in ranking.
- **Video-centric retrieval**: iRAG performs incremental retrieval for sequential video understanding. Video-RAG uses OCR/ASR-derived auxiliary text to reduce long-video difficulty. VideoRAG introduces dual-channel architectures and graph-grounded knowledge for extremely long videos. T-Mass, CTCH, RTime, OmAgent, and DRVideo address robust text-video alignment, temporal causality, divide-and-conquer video understanding, and narrative preservation.
- **Audio-centric retrieval**: WavRAG, SEAL, and SpeechRAG try to bypass traditional ASR bottlenecks by mapping raw audio into shared latent spaces. Audiobox TTA-RAG conditions text-to-audio generation on retrieved acoustic samples. DRCap, P2PCAP, and LA-RAG focus on audio captioning, dynamic query regeneration, and speech recognition correction.
- **Document and layout retrieval**: ColPali encodes full document pages as patch-level visual representations without relying on OCR. ColQwen2 and M3DocVQA extend this direction to dynamic resolution, multi-page documents, and holistic reasoning. ViTLP, DocLLM, CREAM, mPLUG-DocOwl, DSE, and SV-RAG integrate text, images, tables, and layout structure.

The survey also treats **reranking and filtering** as a key part of retrieval. MSIER, Hybrid RAG, and RULE focus on example selection and calibration. RAG-Check, UniRaG, MR2AG, LDRE, and VR-RAG refine relevance scoring. MAIN-RAG, MM-Embed, GME, MuRAR, and RAFT use hard negatives, consensus filtering, or dynamic modality filtering to remove distracting evidence.

### 2. Fusion Mechanisms

Retrieved multimodal evidence cannot be naively concatenated. Fusion mechanisms determine how heterogeneous sources become a usable reasoning context.

- **Score fusion and alignment**: MegaPairs combines CLIP-based and MLLM-based retrieval scores to use their complementary strengths. REVEAL injects retrieval scores into attention layers to align query and knowledge vectors. VISA uses document screenshot embeddings to align textual queries with visual documents. RA-BLIP uses an adaptive fusion module for visual-textual semantics. VISRAG improves relevance by applying position-weighted pooling over VLM hidden states.
- **Attention-based fusion**: RAMM applies dual-stream co-attention to medical images and text. Mu-RAG uses intermediate cross-attention for open-domain QA. EMERGE, MORE, AlzheimerRAG, RAGTrans, MV-Adapter, and M2-RAAP dynamically modulate modality weights through cross-attention, user-aware attention, shared video-text factors, or frame-to-token attention.
- **Unified frameworks and projections**: Hybrid-RAG uses hierarchical fusion. IRAMIG iteratively integrates multimodal results. M3DocRAG flattens multi-page documents into a unified tensor. PDF-MVQA combines coarse entity representations with fine-grained token content. DQU-CIR switches between image-to-text conversion and text-over-image composition depending on query complexity. SAM-RAG converts images into captions and then performs text-style RAG. Dense2Sparse projects dense image-text representations into sparse lexical vectors for interpretability and storage efficiency.

### 3. Augmentation Techniques

Augmentation methods process retrieved evidence before generation.

- **Context enrichment**: EMERGE adds entity relations and semantic descriptions. MiRAG expands initial queries through entity retrieval and reformulation. Wiki-LLaVA integrates encyclopedic image-text knowledge. Video-RAG decouples user questions into structured retrieval requests. Img2Loc includes both similar and dissimilar locations in prompts to eliminate implausible candidates.
- **Adaptive and iterative retrieval**: UniversalRAG routes queries to suitable corpora according to required modality and granularity. SKURG decides retrieval hops according to query complexity. SAM-RAG, mR2AG, and MMed-RAG let MLLMs decide whether external knowledge is needed and filter low-relevance evidence. OmniSearch decomposes multimodal queries into sub-questions and plans retrieval actions in real time. OMGM performs coarse-to-fine multi-step retrieval. IRAMIG, OMG-QA, and RAGAR update queries and evidence through memory, feedback, or previous responses.

### 4. Generation Techniques

The generator must learn not only to answer, but also to use, cite, and verify multimodal evidence.

- **Retrieval-augmented ICL**: RMR, RA-CM3, RAG-Driver, MSIER, and Raven use retrieved content as few-shot demonstrations, driving experiences, visual-text examples, or fused in-context evidence.
- **Reasoning enhancement**: RAGAR proposes Chain of RAG and Tree of RAG for branching fact-checking. VisDoM and SAM-RAG combine CoT with evidence curation and multi-stage verification. LDRE improves composed image retrieval through dense descriptions and textual modifications.
- **Instruction tuning and preference optimization**: RA-BLIP, RAGPT, MR2AG, and RagVL train models to invoke retrieval adaptively, identify relevant evidence, and improve ranking. MMed-RAG uses preference tuning to balance retrieved knowledge with internal reasoning. MegaPairs and Surf build multimodal instruction-tuning datasets from previous LLM errors. RULE applies DPO to reduce blind overreliance on retrieved medical context.
- **Source attribution and evidence transparency**: OMG-QA prompts explicit evidence citation. MuRAR refines an initial response with a source-aware retriever. VISA highlights evidence regions in retrieved screenshots. The survey notes that attribution accuracy still drops when evidence spans multiple sections, pages, or modalities.
- **Agentic generation and interaction**: AppAgent v2 supports mobile GUI navigation. USER-LLM R1 builds personalized conversational agents. MMAD targets industrial anomaly detection. CollEX supports scientific collection exploration. HM-RAG coordinates hierarchical multi-agent collaboration over multimodal streams. CogPlanner uses cognitively inspired planning to iteratively refine queries and retrieval strategies.

### 5. Training Strategies, Robustness, and Losses

Training multimodal RAG systems usually combines large-scale cross-modal pretraining, task-specific fine-tuning, and robustness-oriented learning.

- **Alignment training**: InfoNCE-style contrastive learning remains central. VISRAG, MegaPairs, and SAM-RAG pull positive cross-modal pairs closer and push negatives apart. EchoSight selects visually similar but semantically distinct negatives. HACL adds adversarial captions to reduce hallucination. UniRaG uses hard negative documents to distinguish relevant from irrelevant context. eCLIP combines expert annotations with an auxiliary MSE loss.
- **Multi-objective training**: REVEAL combines Prefix LM, contrastive loss, disentangled regularization, and alignment regularization, then fine-tunes with cross-entropy for tasks such as VQA and image captioning.
- **Noise management**: MORE injects irrelevant retrieved results during training so the model learns to focus on useful evidence. AlzheimerRAG uses progressive knowledge distillation for denoising. RAGTrans propagates relevant information through hypergraph-based knowledge aggregation. RA-BLIP introduces ASKG, using implicit LLM capability to select relevant knowledge. RagVL combines hard negatives, Gaussian noise, and token-level reweighting. RA-CM3 uses Query Dropout for better generalization.

### 6. Datasets, Metrics, and Application Domains

The paper surveys datasets across image-text, video-text, audio-text, medical, fashion, 3D, knowledge QA, and document understanding.

- **Representative datasets**: MS-COCO, Flickr30K, LAION-400M/5B, MINT-1T, and OmniCorpus support large-scale image-text pretraining. ActivityNet, YouCook2, HowTo100M, Ego4D, and InternVid support video-text learning. AudioSet, AudioCaps, LibriSpeech, and SpeechBrown cover audio-text settings. MIMIC-CXR, CheXpert, and IU-Xray support medical applications. MultimodalQA, OK-VQA, WebQA, Infoseek, MOCHEG, DocVQA, ChartQA, M3DocVQA, and MMLongBench-Doc evaluate knowledge-intensive QA and document reasoning.
- **Representative benchmarks**: MRAG-Bench evaluates visual retrieval, integration, and robustness to irrelevant visual evidence. M2RAG jointly evaluates retrieval, multi-hop reasoning, and multimodal integration. Dyn-VQA focuses on dynamic retrieval and robustness to changing information. MMBench covers visual, textual, and audio understanding. ScienceQA evaluates scientific reasoning over text, diagrams, and images.
- **Evaluation metrics**: Retrieval uses Top-K Accuracy, Recall@K, Precision, F1, and MRR. Text generation uses EM, BLEU, ROUGE, and METEOR. Image captioning uses CIDEr, SPICE, and SPIDEr. Cross-modal alignment uses BERTScore and CLIPScore. Generation quality also involves FID, KID, Inception Score, and FAD. System-level evaluation includes FLOPs, response time, retrieval time per query, and domain-specific metrics in healthcare or geolocation.

## Personal Insight

### 1. What problem does the paper aim to solve?

**Core Problem**: Multimodal RAG has expanded from "adding text evidence to LLMs" into retrieval and reasoning across text, images, audio, video, tables, and document layout. However, the literature is scattered across VQA, document understanding, video understanding, medical report generation, image-text generation, and agentic systems. Without a unified view, it is hard to identify whether a system's real contribution lies in the retriever, fusion layer, augmentation strategy, generator, training objective, or evaluation protocol.

**Specific Objectives**:
- Provide a unified formulation for multimodal RAG: multimodal query, multimodal corpus, cross-modal encoding, relevance-based retrieval, fused context, and generation.
- Organize more than 100 recent works by methodological innovation rather than only by application domain.
- Review datasets, benchmarks, metrics, and application areas while identifying gaps between current evaluation and real-world multimodal needs.

### 2. What previous work exists, and what are the pain points?

**Previous Work Landscape**:
- Multimodal alignment models such as CLIP and BLIP solve the basic image-text representation problem.
- Early retrieval-augmented multimodal generation systems such as MuRAG, RA-CM3, and REVEAL connect external multimodal memory with generation.
- Document-image and layout RAG systems such as ColPali, M3DocVQA, and mPLUG-DocOwl handle OCR-free or layout-aware document understanding.
- Video RAG systems such as Video-RAG, iRAG, VideoRAG, and OmAgent address long videos and temporal evidence.
- Audio RAG systems such as WavRAG, SpeechRAG, SEAL, and LA-RAG retrieve or correct evidence from speech and sound.
- Adaptive, reasoning-oriented, and agentic RAG systems such as RAGAR, SAM-RAG, OmniSearch, and CogPlanner make retrieval more dynamic.

**Pain Points**:
- **Modality imbalance**: Many supposedly multimodal systems still over-rely on text; images, audio, and videos are often compressed into captions or ASR transcripts.
- **Cross-modal alignment remains difficult**: The same entity can appear as an image region, speech segment, video frame, table cell, or text span, and unified embedding spaces are still unstable.
- **Retrieval bias and redundancy**: Position sensitivity, training-data bias, low-quality retrieval, and repeated evidence can all distort final answers.
- **Coarse attribution**: Many systems cite a whole document or image instead of the exact region, frame, audio segment, or table cell that supports an answer.
- **Fragmented evaluation**: Many benchmarks evaluate retrieval and generation separately, making it hard to measure whether retrieved multimodal evidence actually improves the final response.

### 3. How does this survey organize and advance the discussion?

**Main Contribution**: The paper does not propose a single model; it builds a research map for multimodal RAG.

- **Pipeline-level decomposition**: It breaks systems into retrieval, reranking, fusion, augmentation, generation, training, and robustness, making contributions easier to compare.
- **Modality-specific retrieval analysis**: Text, vision, video, audio, and document layout are discussed separately, avoiding the mistake of applying image-text RAG assumptions to every modality.
- **Generation is treated as part of RAG**: The survey emphasizes that multimodal RAG is not just "retriever + MLLM". ICL, CoT, instruction tuning, source attribution, and agent planning in the generation phase heavily affect reliability.
- **Robustness becomes a central issue**: Works such as MM-PoisonRAG and Poisoned-MRAG show that cross-modal knowledge poisoning can hijack retrieval and derail generation, so trustworthiness cannot be reduced to average accuracy.
- **Datasets are tied to applications**: Healthcare, software engineering, fashion/e-commerce, entertainment/social computing, driving, and navigation have different requirements for modality, latency, privacy, and explainability.

### 4. What broader trends does the paper reveal?

My main takeaway is that multimodal RAG is moving in five directions:

- **From image-text retrieval to any-to-any retrieval**: Future systems need to support text-image-audio-video-document-table and even sensor data retrieval without forcing everything through text.
- **From similarity search to task-aware retrieval**: UniversalRAG, OmniSearch, and CogPlanner suggest that systems should decide which modality, granularity, and number of retrieval rounds a task needs before choosing a corpus or tool.
- **From evidence concatenation to structured fusion**: Attention, score fusion, Dense2Sparse, document layout modeling, and graph/hypergraph knowledge aggregation all aim to preserve structure rather than flatten evidence into prompts.
- **From one-shot answering to interactive agents**: Real multimodal questions often require inspecting images, reading tables, locating video segments, asking follow-up questions, and verifying evidence. Agentic multimodal RAG is likely to become increasingly important.
- **From performance metrics to trust metrics**: Source attribution, anti-poisoning, denoising, privacy, and cross-domain generalization will decide whether multimodal RAG systems can be deployed responsibly.

### 5. What are the limitations and future directions?

Based on the paper's open problems, limitations, and my observations:

- **Unified embedding spaces are still unsolved**: Mapping all modalities into one space is attractive, but modalities differ in information density, temporal structure, and noise patterns. A single space can lose fine-grained modality-specific signals.
- **Long videos and multi-page documents are expensive**: Fixed frame sampling, full-page encoding, and cross-modal attention are costly. Future systems need content-adaptive sampling, cache reuse, and lightweight reranking.
- **Attribution needs finer granularity**: A strong system should identify the exact frame, visual region, audio span, or table cell behind a claim, not merely cite a document.
- **Robustness and safety benchmarks are insufficient**: There are too few multimodal adversarial examples, poisoning benchmarks, and structured negative instances to evaluate cross-modal attacks systematically.
- **Multimodal knowledge graphs remain underexplored**: The survey notes that knowledge graphs are less developed in multimodal RAG than in text RAG. Given recent GraphRAG, HyperGraphRAG, multimodal hypergraph, and agentic graph retrieval work, structured knowledge may become a key entry point for complex cross-modal reasoning.
- **Personalization conflicts with privacy**: Medical history, user preferences, and device sensor data can improve retrieval, but they also introduce privacy leakage and access-control risks.

## Further Reading

- [Project Page: Ask in Any Modality](https://multimodalrag.github.io)
- [Multimodal-RAG-Survey Repository](https://github.com/llm-lab-org/Multimodal-RAG-Survey)
- [MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text](https://arxiv.org/abs/2210.02928)
- [RA-CM3: Retrieval-Augmented Multimodal Language Modeling](https://arxiv.org/abs/2211.12561)
- [REVEAL: Retrieval-Augmented Visual-Language Pre-Training with Multi-Source Multimodal Knowledge Memory](https://arxiv.org/abs/2212.05221)
