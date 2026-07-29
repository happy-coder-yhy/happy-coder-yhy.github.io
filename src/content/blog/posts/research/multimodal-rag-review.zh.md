---
title: '论文笔记：Ask in Any Modality —— 多模态检索增强生成综述'
date: '2026-07-29'
summary: '系统综述ACL Findings 2025论文Ask in Any Modality，梳理多模态RAG在检索、重排序、跨模态融合、上下文增强、生成、训练、鲁棒性和智能体化方向上的主要方法与代表工作，并总结数据集、评估指标、开放挑战和未来研究机会。'
tags: ['多模态RAG', '检索增强生成', '跨模态检索', '多模态融合', '综述']
category: 'research'
venue: 'ACL Findings 2025'
status: 'published'
year: 2025
---

## 论文信息

- **标题**：Ask in Any Modality: A Comprehensive Survey on Multimodal Retrieval-Augmented Generation
- **作者**：Mohammad Mahdi Abootorabi, Amirhosein Zobeiri, Mahdi Dehghani, Mohammadali Mohammadkhani, Bardia Mohammadi, Omid Ghahroodi, Mahdieh Soleymani Baghshah, Ehsaneddin Asgari
- **年份**：2025
- **类型**：综述论文（Survey Paper）
- **会议**：Findings of the Association for Computational Linguistics: ACL 2025
- **资源**：论文项目页 https://multimodalrag.github.io

## 核心框架：多模态RAG的方法谱系

这篇综述将多模态RAG定义为：给定一个多模态查询 \(q\) 和多模态语料库 \(D=\{d_1,d_2,\dots,d_n\}\)，系统先用模态相关或统一编码器将文本、图像、音频、视频、文档等内容投射到可比较的表示空间，再按相关性阈值或Top-K策略检索外部证据 \(X\)，最后由生成模型 \(G(q, X)\) 生成文本或多模态回答。

与传统文本RAG相比，多模态RAG的关键难点不是“多拿一点上下文”这么简单，而是要同时解决**模态选择、跨模态对齐、异构证据融合、证据透明性、长上下文效率和噪声鲁棒性**。论文据此把近期工作归纳为六类。

### 1. 检索策略（Retrieval Strategies）

多模态RAG的检索层既包括统一向量空间中的高效相似度搜索，也包括围绕不同模态设计的专用检索器。

- **统一嵌入与高效搜索**：CLIP、BLIP、ALIGN、FLAVA奠定了图文对齐基础；MARVEL、Uni-IR、GME、VISTA、LLaVE等通过难负样本、均衡采样或更强的多模态编码器提升跨模态区分能力。大规模检索依赖MIPS、TPU-KNN、ScaNN、MAXSIM、BanditMIPS、MUST、FARGO、ADQ等近似搜索或量化方法，在召回率、延迟和存储之间折中。MuRAG和RA-CM3是较早将大规模图文记忆接入生成模型的代表。
- **文本中心检索**：BM25、MiniLM、BGE-M3仍是很多系统的基础组件；ColBERT和PreFLMR用token级交互保留细粒度语义；RAFT、CRAG、M2-RAG等工作进一步关注可引用文本片段、可靠检索和多模态问答场景。
- **视觉中心检索**：EchoSight、ImgRet、VISA、RAMM、eCLIP、VQA4CIR、Pic2Word等工作支持以图搜图、图文组合检索或医学视觉问答。核心目标是把视觉相似性、文本语义和外部知识同时纳入排序。
- **视频中心检索**：iRAG面向顺序视频理解做增量检索；Video-RAG利用OCR/ASR辅助文本降低长视频依赖；VideoRAG引入双通道和图结构知识来处理超长视频；T-Mass、CTCH、RTime、OmAgent、DRVideo分别从文本-视频鲁棒对齐、时间因果、分而治之和叙事保持等角度推进视频RAG。
- **音频中心检索**：WavRAG、SEAL、SpeechRAG试图绕开传统ASR瓶颈，将原始音频直接映射到共享空间；Audiobox TTA-RAG把检索到的声学样本用于文本到音频生成；DRCap、P2PCAP、LA-RAG关注音频字幕、动态查询和语音识别纠错。
- **文档与版面检索**：ColPali把整页文档图像编码为patch级表示，绕开OCR；ColQwen2、M3DocVQA支持动态分辨率、多页文档和整体推理；ViTLP、DocLLM、CREAM、mPLUG-DocOwl、DSE、SV-RAG进一步把文字、图像、表格、版面结构统一起来。

论文还把**重排序与筛选**列为检索的重要后处理：MSIER、Hybrid RAG、RULE关注示例选择与校准；RAG-Check、UniRaG、MR2AG、LDRE、VR-RAG关注相关性打分；MAIN-RAG、MM-Embed、GME、MuRAR、RAFT等通过难负样本、共识过滤或动态模态过滤减少干扰证据。

### 2. 融合机制（Fusion Mechanisms）

检索到的多模态证据不能简单拼接。融合机制决定了模型如何把不同模态的证据转成同一推理上下文。

- **分数融合与对齐**：MegaPairs结合CLIP检索和MLLM检索分数，利用二者互补性；REVEAL把检索分数注入注意力层，让查询与知识向量更接近；VISA用文档截图嵌入对齐文本查询与视觉文档；RA-BLIP用自适应融合模块统一视觉和文本语义；VISRAG通过对VLM隐藏状态做位置加权池化提升相关性。
- **注意力融合**：RAMM使用双流co-attention融合医学图像和文本；Mu-RAG在开放域问答中使用中间层cross-attention；EMERGE、MORE、AlzheimerRAG、RAGTrans、MV-Adapter、M2-RAAP等则通过cross-attention、用户感知注意力、视频-文本潜变量共享或帧-词注意力来动态调节模态权重。
- **统一框架与投影**：Hybrid-RAG使用层级融合；IRAMIG迭代整合多模态结果；M3DocRAG将多页文档压平成统一张量；PDF-MVQA融合粗粒度实体和细粒度token；DQU-CIR根据查询复杂度在“图像转文本”和“文本叠加图像”之间切换；SAM-RAG把图像转为caption后退化为文本RAG；Dense2Sparse将稠密图文表示投射到稀疏词项空间，以换取可解释性和存储效率。

### 3. 增强技术（Augmentation Techniques）

增强技术主要处理“检索之后、生成之前”的上下文加工问题。

- **上下文丰富化**：EMERGE加入实体关系和语义描述；MiRAG先做实体检索和查询改写；Wiki-LLaVA整合百科式图文知识；Video-RAG把用户问题解耦成结构化检索请求；Img2Loc在提示中同时加入相似和不相似地点，帮助模型排除错误候选。
- **自适应与迭代检索**：UniversalRAG根据所需模态和粒度动态路由到合适语料；SKURG依据问题复杂度决定检索跳数；SAM-RAG、mR2AG、MMed-RAG让MLLM判断是否需要外部知识并过滤低相关证据；OmniSearch把多模态查询拆成子问题并实时规划检索动作；OMGM采用从粗到细的多步检索；IRAMIG、OMG-QA、RAGAR则通过记忆、反馈或多轮响应更新查询和证据。

### 4. 生成技术（Generation Techniques）

多模态RAG的生成端不仅要“回答”，还要学会如何使用、引用和校验证据。

- **检索增强的ICL**：RMR、RA-CM3、RAG-Driver、MSIER、Raven等把检索结果作为few-shot示例或驾驶经验、视觉文本示例、融合上下文来提升生成。
- **推理增强**：RAGAR提出Chain of RAG和Tree of RAG，用分支推理改进事实核查；VisDoM和SAM-RAG结合CoT、证据筛选和多阶段验证；LDRE通过密集描述和文本修改增强组合式图像检索。
- **指令微调与偏好优化**：RA-BLIP、RAGPT、MR2AG、RagVL训练模型自适应调用检索、识别证据和增强排序；MMed-RAG用偏好微调平衡检索知识与模型内部推理；MegaPairs、Surf从LLM错误中构造多模态指令数据；RULE用DPO减少医学模型对检索上下文的盲目信任。
- **来源归因与证据透明性**：OMG-QA要求生成时显式引用证据；MuRAR用源感知检索器修正初始回答；VISA让视觉语言模型在截图中高亮证据区域。论文也指出，当证据跨多个段落、页面或模态时，归因准确性仍明显下降。
- **智能体式生成与交互**：AppAgent v2用于移动GUI导航；USER-LLM R1做个性化会话；MMAD用于工业异常检测；CollEX支持科学收藏探索；HM-RAG用层级多智能体协同处理多模态数据流；CogPlanner用认知式规划迭代选择查询和检索策略。

### 5. 训练策略、鲁棒性与损失函数

训练多模态RAG通常包含大规模跨模态预训练、任务微调和鲁棒性增强。

- **对齐训练**：InfoNCE式对比学习仍是主线，VISRAG、MegaPairs、SAM-RAG等都用正负样本拉近/推远跨模态表示。EchoSight选择视觉相似但语义不同的负样本，HACL加入对抗caption来抑制幻觉，UniRaG使用hard negative文档提升相关/不相关上下文辨别能力，eCLIP结合专家标注和MSE辅助损失。
- **多目标训练**：REVEAL同时使用Prefix LM、对比损失、去纠缠正则和对齐正则，再通过交叉熵微调到VQA、图像字幕等任务。
- **噪声管理**：MORE在训练中注入无关检索结果，让模型学会关注有效证据；AlzheimerRAG用渐进式知识蒸馏降噪；RAGTrans通过超图知识聚合传播相关信息；RA-BLIP提出ASKG策略，用LLM隐式能力筛选知识；RagVL加入hard negatives、高斯噪声和token级重加权；RA-CM3用Query Dropout提升泛化。

### 6. 数据集、评估与应用场景

论文整理了图文、视频文本、音频文本、医学、时尚、3D、知识问答和文档理解等数据资源。

- **代表数据集**：MS-COCO、Flickr30K、LAION-400M/5B、MINT-1T、OmniCorpus用于大规模图文预训练；ActivityNet、YouCook2、HowTo100M、Ego4D、InternVid用于视频文本；AudioSet、AudioCaps、LibriSpeech、SpeechBrown用于音频文本；MIMIC-CXR、CheXpert、IU-Xray用于医学；MultimodalQA、OK-VQA、WebQA、Infoseek、MOCHEG、DocVQA、ChartQA、M3DocVQA、MMLongBench-Doc用于知识密集型QA和文档推理。
- **代表基准**：MRAG-Bench评估视觉检索、整合和无关视觉信息鲁棒性；M2RAG联合评估检索、多跳推理和多模态整合；Dyn-VQA关注动态检索和变化信息鲁棒性；MMBench覆盖视觉、文本、音频理解；ScienceQA评估科学图文/图表推理。
- **评价指标**：检索端常用Top-K Accuracy、Recall@K、Precision、F1、MRR；文本生成常用EM、BLEU、ROUGE、METEOR；图像字幕常用CIDEr、SPICE、SPIDEr；跨模态对齐常用BERTScore、CLIPScore；生成质量还涉及FID、KID、Inception Score、FAD；系统层面还要看FLOPs、响应时间、每查询检索时间，以及医学/地理等领域指标。

## 个人思考

### 1. 论文想解决什么问题？

**核心问题**：多模态RAG已经从“给LLM补文本资料”发展到“在文本、图像、音频、视频、表格、文档版面之间检索和推理”，但相关工作分散在VQA、文档理解、视频理解、医学报告生成、图文生成、智能体系统等多个社区。缺少统一视角会导致研究者很难判断：一个系统的创新到底在检索器、融合层、增强策略、生成器、训练目标，还是评估协议。

**具体目标**：
- 给出多模态RAG的统一问题形式化：多模态查询、多模态语料、跨模态编码、相关性检索、融合上下文和生成。
- 用方法创新而不是应用场景来组织近期100多篇工作。
- 梳理数据集、评估指标和应用域，指出现有基准与真实世界需求之间的差距。

### 2. 前人已有哪几类工作，痛点是什么？

**前人工作谱系**：
- 以CLIP/BLIP为代表的多模态对齐模型，解决图文表示空间问题。
- 以MuRAG、RA-CM3、REVEAL为代表的早期检索增强多模态生成模型。
- 以ColPali、M3DocVQA、mPLUG-DocOwl为代表的文档图像和版面理解RAG。
- 以Video-RAG、iRAG、VideoRAG、OmAgent为代表的视频RAG。
- 以WavRAG、SpeechRAG、SEAL、LA-RAG为代表的音频RAG。
- 以RAGAR、SAM-RAG、OmniSearch、CogPlanner为代表的自适应检索、推理和智能体式RAG。

**痛点**：
- **模态不平衡**：许多系统表面上是多模态，实际仍过度依赖文本，图像/音频/视频常被压缩成caption或ASR文本。
- **跨模态对齐困难**：同一个实体在图像区域、语音片段、视频帧、表格单元格和文本段落中表现不同，统一嵌入空间仍不稳定。
- **检索偏差和冗余**：位置敏感、训练数据偏差、低质量检索、重复证据会影响最终回答。
- **归因粒度粗**：很多系统只能引用整篇文档或整张图片，难以定位到具体区域、帧、语音片段或表格单元。
- **评估割裂**：很多基准分别评估检索和生成，无法衡量“检索证据是否真的帮助了最终答案”。

### 3. 这篇综述如何组织并推进这些问题？

**主要贡献**：论文没有提出单一新模型，而是建立了一个多模态RAG研究地图。

- **从pipeline拆解方法**：把系统拆成检索、重排序、融合、增强、生成、训练和鲁棒性，便于比较不同工作的真实贡献点。
- **按模态细分检索**：文本、视觉、视频、音频、文档版面被分别讨论，避免用图文RAG的经验粗暴套到所有模态。
- **把生成端纳入RAG讨论**：论文强调多模态RAG不是“检索器 + MLLM”的简单组合，生成阶段的ICL、CoT、指令微调、证据归因和智能体规划同样会决定系统可靠性。
- **把鲁棒性提升到核心议题**：MM-PoisonRAG、Poisoned-MRAG等工作表明，跨模态知识库投毒可以劫持检索并误导生成，多模态RAG的可信性不能只看平均准确率。
- **连接数据集与应用**：从医疗、软件工程、时尚电商、娱乐社交、驾驶/导航等领域说明不同场景对模态、延迟、隐私、可解释性的要求不同。

### 4. 读完后，对多模态RAG方法有什么整体判断？

我认为这篇综述传达出的趋势很清晰：

- **从“图文检索”走向“任意模态检索”**：未来系统需要支持text-image-audio-video-document-table甚至传感器数据之间的any-to-any检索，而不是把所有内容先转成文本。
- **从“相似度检索”走向“任务感知检索”**：UniversalRAG、OmniSearch、CogPlanner这类工作说明，模型需要先判断任务需要哪种模态、什么粒度、几轮检索，再决定调用哪个语料库。
- **从“证据拼接”走向“结构化融合”**：attention、score fusion、Dense2Sparse、文档版面建模、图/超图知识聚合都在尝试让证据保留结构，而不是平铺到prompt里。
- **从“单次回答”走向“可交互智能体”**：多模态问题往往需要看图、读表、查视频片段、追问用户、校验证据，agentic multimodal RAG会越来越重要。
- **从“性能指标”走向“可信指标”**：来源归因、抗投毒、抗噪声、隐私保护、跨域泛化会成为多模态RAG能否落地的分水岭。

### 5. 还有什么不足之处（未来继续深挖的点有哪些）？

基于论文的open problems、limitations以及我的观察：

- **统一嵌入空间仍未解决**：直接把所有模态映射到一个空间很诱人，但不同模态的信息密度、时间结构和噪声形态差异很大，统一空间可能牺牲细粒度特征。
- **长视频和多页文档成本高**：固定抽帧、全页编码、跨模态attention都很贵，未来需要内容自适应采样、缓存复用和轻量级重排序。
- **证据归因需要更细粒度**：理想系统应能回答“这句话来自哪一帧、哪个图像区域、哪段音频、哪张表的哪个单元格”，而不是只给一个文档链接。
- **鲁棒性和安全基准不足**：现有多模态对抗样本、投毒样本、结构化负例太少，难以系统评估跨模态攻击。
- **多模态知识图谱仍被低估**：论文指出知识图谱在多模态RAG中仍探索不足。结合最近GraphRAG、HyperGraphRAG、多模态超图和agentic graph retrieval方向，结构化知识很可能是复杂跨模态推理的重要入口。
- **个性化与隐私冲突**：医疗历史、用户偏好、设备传感器数据能显著提升检索质量，但也会带来隐私泄露和权限控制问题。

## 延伸阅读

- [项目页：Ask in Any Modality](https://multimodalrag.github.io)
- [Multimodal-RAG-Survey 资源仓库](https://github.com/llm-lab-org/Multimodal-RAG-Survey)
- [MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text](https://arxiv.org/abs/2210.02928)
- [RA-CM3: Retrieval-Augmented Multimodal Language Modeling](https://arxiv.org/abs/2211.12561)
- [REVEAL: Retrieval-Augmented Visual-Language Pre-Training with Multi-Source Multimodal Knowledge Memory](https://arxiv.org/abs/2212.05221)
