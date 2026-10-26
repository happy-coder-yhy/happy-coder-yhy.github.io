import type { Metadata } from 'next';
import { ResearchListing } from '@/sections/research-listing';

export const metadata: Metadata = {
  title: '论文阅读笔记',
  description: '精选论文的阅读笔记与核心要点总结，持续更新中。'
};

export default function ResearchPage() {
  return <ResearchListing locale="zh" />;
}
