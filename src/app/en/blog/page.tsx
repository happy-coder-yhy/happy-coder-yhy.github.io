import { getAllPosts, getAllTags, getAllYears, getAllVenues } from '@/lib/blog';
import BlogListingClient from '@/components/blog-listing-client';
import { Suspense } from 'react';

export default function EnBlogListingPage() {
  const allPosts = getAllPosts('en');
  const allTags = getAllTags('en');
  const allYears = getAllYears('en');
  const allVenues = getAllVenues('en');

  if (allPosts.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-3xl font-semibold">Blog Posts</h1>
        <p className="mt-4 text-slate-500">English blog posts coming soon.</p>
      </section>
    );
  }

  return (
    <Suspense fallback={<div className="py-16"><div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div></div>}>
      <BlogListingClient
        allPosts={allPosts}
        allTags={allTags}
        allYears={allYears}
        allVenues={allVenues}
      />
    </Suspense>
  );
}
