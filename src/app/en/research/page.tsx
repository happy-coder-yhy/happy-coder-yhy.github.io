import type { Metadata } from 'next';
import { ResearchListing } from '@/sections/research-listing';

export const metadata: Metadata = {
  title: 'Paper Notes Wiki | Haoyu Yuan',
  description: 'Paper reading notes and key takeaways from top AI/ML conferences.'
};

export default function EnResearchPage() {
  return <ResearchListing locale="en" />;
}
