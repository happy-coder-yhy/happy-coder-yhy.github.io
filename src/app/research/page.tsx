import type { Metadata } from 'next';
import { ResearchListing } from '@/sections/research-listing';

export const metadata: Metadata = {
  title: '论文笔记 Wiki | 小王的知识 Wiki',
  description: '精选顶会论文的阅读笔记与核心要点总结，持续更新中。'
};

export default function ResearchPage() {
  return <ResearchListing />;
}
