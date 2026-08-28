---
title: '论文笔记：WAFT-Stereo —— 用纯 Warping 替代代价体的立体匹配'
date: '2026-08-28'
summary: '提出WAFT-Stereo，一个不依赖代价体的立体匹配框架。论文证明高分辨率特征 warping 配合迭代更新，足以取代主流立体匹配中的 cost volume 设计；再通过先分类后回归的初始化策略解决大视差收敛困难，在ETH3D、KITTI和Middlebury公开榜单上取得SOTA或Pareto前沿表现，同时比FoundationStereo、S2M2-XL等强基线快1.8到6.7倍。'
tags: ['立体匹配', '深度估计', '双目视觉', 'Warping', '计算机视觉']
category: 'research'
venue: 'arXiv 2026'
status: 'preprint'
year: 2026
arxiv: 'https://arxiv.org/abs/2603.24836'
github: 'https://github.com/princeton-vl/WAFT-Stereo'
---

## 论文信息

- **标题**：WAFT-Stereo: Warping-Alone Field Transforms for Stereo Matching
- **作者**：Yihan Wang, Jia Deng
- **年份**：2026
- **类型**：研究论文（Research Paper）
- **版本**：arXiv:2603.24836v3，2026-06-30

## 核心框架：用特征 Warping 替代代价体

WAFT-Stereo 的核心观点很直接：立体匹配不一定需要 cost volume。主流方法通常先在左右图之间构建全局或局部代价体，再通过 RAFT 式迭代更新细化视差。代价体有效，但显存和计算会随视差范围或查找半径增长，往往只能在较低分辨率上处理，细节区域容易受损。

WAFT-Stereo 沿用 WAFT 在光流任务中的思路：不显式枚举匹配代价，而是在每次迭代中用当前视差估计把右图特征反向 warp 到左图坐标系，再把左图特征、warp 后右图特征和隐藏状态送入更新模块。

### 1. 输入编码器

- **输入**：经过极线校正的左右图像对。
- **特征提取**：使用预训练视觉 backbone 提取左右视图特征，benchmark 提交采用 DepthAnythingV2-L。
- **轻量适配**：相比原始 WAFT 中额外的小 U-Net，WAFT-Stereo 冻结 backbone 主体并使用 LoRA 做低秩微调，再通过 DPT head 上采样特征。

这个设计把重心放在可复用的预训练特征和高效 warping 上，而不是专门为 cost volume 设计复杂的 3D/4D 代价处理网络。

### 2. Warping 迭代更新

在第 t 次迭代中，模型根据当前视差 \(d_t\) 将右图特征 \(F_R\) 反向采样到左图位置：

- 若某个左图像素为 \(p=(p_h,p_w)\)，则右图对应位置约为 \((p_h, p_w-d_t(p))\)。
- 通过双线性采样得到 warp 后的右图特征。
- 更新器读取左图特征、warp 后右图特征和隐藏状态，输出下一步视差增量。

这种做法有两个关键优势：

- **显存不随视差范围线性增长**：warping 只根据当前估计采样目标特征，不需要维护完整候选视差表。
- **可在更高分辨率上工作**：高分辨率索引有利于边缘、细小结构和局部纹理。

### 3. 先分类后回归的视差初始化

直接把 WAFT 从光流改成 1D 视差回归并不好用。原因是光流相邻帧位移通常较小，而高分辨率立体匹配中视差可能达到数百像素；从零视差开始纯回归，容易在大位移区域收敛慢甚至陷住。

WAFT-Stereo 的解决方法是：第一步先做离散视差分类，再用回归式迭代细化。

- **分类阶段**：把最大视差 \(D_{max}\) 划分为 B 个 bin，预测每个像素属于各视差 bin 的概率分布。
- **软标签监督**：根据真实视差与每个 bin 的距离构造 soft target distribution，用 soft cross-entropy 训练。
- **Soft-argmax 初始化**：将分类概率转成初始视差 \(d_0\)。
- **回归细化**：后续迭代用 Mixture-of-Laplace loss 监督视差残差更新。

论文的关键结论是：加速收敛的主要原因并不是 cost volume 本身，而是“分类初始化”这个 formulation。即使用 warping 特征和标准 ViT/DPT 模块，也能获得类似收益。

### 4. 架构改进

WAFT-Stereo 在 WAFT 基础上做了几个对 stereo 更友好的改造：

- **LoRA 替代小 U-Net 适配层**：降低推理延迟。
- **高分辨率 ResNet blocks**：替代原始 WAFT 的高分辨率 skip connection，改善细节区域精度。
- **ViT-S + DPT 更新器**：分类模块和回归更新器共享相似架构，减少专用设计。
- **MoL 回归损失**：相比常见 L1 损失，更适合迭代式不确定性建模。

## 个人思考

### 1. 论文想解决什么问题？

**核心问题**：当前最强的立体匹配方法普遍把 cost volume 当成默认组件，但 cost volume 的显存和计算成本很高，尤其在大视差、高分辨率输入下，会迫使模型在低分辨率上构建匹配表。这既降低效率，也可能损失边缘和细节。

WAFT-Stereo 想回答一个更基础的问题：**立体匹配的强性能是否真的依赖代价体，还是可以用更简单的特征 warping 和迭代更新替代？**

具体目标包括：

- 证明纯 warping 架构也能在立体匹配上达到 SOTA。
- 保留高分辨率特征处理能力，减少 cost volume 带来的显存负担。
- 解决 stereo 中大视差使纯回归迭代难以收敛的问题。
- 在公开 benchmark 上同时获得精度、速度和 zero-shot 泛化优势。

### 2. 前人已有哪几类工作，痛点是什么？

**前人工作**：

- **传统 stereo / 早期深度 stereo**：依赖代价计算、聚合和后处理，核心仍是显式匹配候选。
- **RAFT-Stereo 类方法**：构建多层或局部 cost volume，并通过 recurrent update 逐步细化视差。
- **FoundationStereo、S2M2、MonSter++ 等近期方法**：结合大 backbone、混合数据训练、代价体或匹配概率建模，取得很强 benchmark 表现。
- **WAFT 光流方法**：在 optical flow 中证明高分辨率 feature warping 可以替代 cost volume。

**痛点**：

- cost volume 的显存和计算与视差范围/查找半径绑定，扩展到高分辨率或大视差时代价高。
- 很多强方法包含专门围绕 cost volume 设计的模块，工程复杂度较高。
- 纯回归式迭代从零初始化出发，对数百像素级视差不友好。
- SceneFlow-only 等常见 zero-shot 设置可能受数据偏置影响，不能完整反映模型泛化能力。

### 3. 本文用了什么创新方法解决痛点？

**创新方法**：用“分类初始化 + warping 迭代回归”替代“cost volume + 代价查表”。

- **Warping-alone stereo**：每次迭代只根据当前视差估计对右图特征做反向 warping，不显式构建候选视差代价体。
- **分类先验解决大视差**：第一步预测离散视差分布，为回归阶段提供粗但稳定的 \(d_0\)，避免从零视差开始追大位移。
- **证明 classification 的收益不依赖 cost volume**：论文还做了 cost-volume classification 变体，发现引入 cost volume 没有明显提升，说明关键在分类 formulation 而非代价体。
- **标准模块组合**：ViT、DPT、ResNet blocks、LoRA、MoL loss 组成简洁 pipeline，减少专用 stereo 模块。
- **可扩展性**：更大 backbone 和更多训练数据会持续改善 WAFT-Stereo，说明方法不是只靠某个小技巧“刷榜”。

### 4. 效果怎么样？

**整体效果很强：公开榜单精度达到 SOTA 或前沿水平，同时速度明显优于多个强基线。**

- **ETH3D zero-shot**：仅用合成数据训练时，WAFT-Stereo 在 ETH3D 的 BP-0.5 和 BP-2-all 上排名第一。DAv2L-5 版本达到 BP-0.5-noc 0.89、BP-0.5-all 0.97；相比最强已知 zero-shot 基线，BP-0.5 降低 61%，BP-1 降低 81%。
- **KITTI-2012/2015**：fine-tuned 后在 KITTI-2012 的 BP-2 和 KITTI-2015 的 D1 上排名第一，相比前一 SOTA 分别降低 13% 和 6%；zero-shot KITTI-2015 也降低约 9% D1。
- **Middlebury**：在 RMSE 指标上最好，RMSE-noc 5.61、RMSE-all 7.02，相比此前方法分别降低 6% 和 5%；但平均 BP-2 仍落后于 S2M2-XL 等方法，主要受 Classroom2E 这类强光照差异场景影响。
- **速度与计算**：DAv2L-5 版本在 540p、BF16、NVIDIA L40 上约 106ms；DAv2S-4 版本约 47ms，可达到 21 FPS。论文报告相对 FoundationStereo、S2M2-XL 等方法有 1.8 到 6.7 倍速度优势。
- **训练数据消融**：在相同或更少训练数据下，WAFT-Stereo 仍能达到可比或更优表现；但只用 SceneFlow 训练会严重过拟合数据偏置，泛化显著下降。
- **架构消融**：B=40 的视差 bin 数量、分类+回归组合、高分辨率 ResNet blocks、MoL loss 都对最终表现有实质帮助。

### 5. 还有什么不足之处（未来继续深挖的点有哪些）？

基于论文实验和我的观察：

- **仍依赖良好的极线校正**：方法面向 rectified stereo pair；实际双目鱼眼系统中，标定、同步和畸变校正误差会直接影响 warping 对齐质量。
- **光照差异仍是难点**：Middlebury 的 Classroom2E 说明，左右视图亮度差异大时，纯特征 warping 仍可能不如某些强匹配模型稳定。
- **训练数据策略很关键**：SceneFlow-only 会过拟合，说明 zero-shot 泛化不只取决于模型结构，也高度依赖合成数据覆盖度。
- **速度仍受迭代次数影响**：虽然 WAFT-Stereo 比很多迭代方法需要更少步数，但更多迭代会降低并行性，未来仍可探索更少步数或更并行的更新设计。
- **大 backbone 成本不可忽略**：DAv2L 带来最好精度，但计算量和参数量仍高；部署时需要在 DAv2S/B/L 间按场景权衡。
- **真实机器人/鱼眼场景还需工程验证**：论文 benchmark 多是标准 rectified 数据集，落到双目鱼眼、运动模糊、低纹理和实时深度视频时，还需要结合实际采集数据做系统评估。

## 延伸阅读

- [arXiv: WAFT-Stereo: Warping-Alone Field Transforms for Stereo Matching](https://arxiv.org/abs/2603.24836)
- [WAFT-Stereo GitHub](https://github.com/princeton-vl/WAFT-Stereo)
- [WAFT: Warping-Alone Field Transforms for Optical Flow](https://arxiv.org/abs/2504.00174)
- [RAFT-Stereo: Multilevel Recurrent Field Transforms for Stereo Matching](https://arxiv.org/abs/2109.07547)
- [FoundationStereo](https://arxiv.org/abs/2501.09898)
