import { getAllPosts, getAllTags, getAllYears, getAllVenues } from '@/lib/blog';
import BlogListingClient from '@/components/blog-listing-client';
import { Suspense } from 'react';

function BlogLoading() {
  return (
    <div className="py-16">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
}

export default function BlogListingPage() {
  const allPosts = getAllPosts('zh');
  const allTags = getAllTags('zh');
  const allYears = getAllYears('zh');
  const allVenues = getAllVenues('zh');

  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogListingClient
        allPosts={allPosts}
        allTags={allTags}
        allYears={allYears}
        allVenues={allVenues}
      />
    </Suspense>
  );
}
