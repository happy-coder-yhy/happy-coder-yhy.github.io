'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { BlogPostMetadata, BlogCategory } from '@/types/blog';

interface BlogCardProps {
  post: BlogPostMetadata;
}

const categoryLabels: Record<BlogCategory, string> = {
  research: '论文笔记',
  'daily-papers': 'AI精选',
  tutorials: '技术教程',
  notes: '学习笔记',
  others: '杂项'
};

function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700">
      <div className="flex items-center justify-between">
        <time className="text-xs uppercase tracking-wide text-slate-400">
          {post.date}
        </time>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {categoryLabels[post.category]}
        </span>
      </div>

      <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
        <a
          href={`/blog/${post.slug}`}
          className="hover:text-[var(--accent)] transition-colors"
        >
          {post.title}
        </a>
      </h2>

      {(post.category === 'research' || post.category === 'daily-papers') && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
          {post.venue && (
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {post.venue}
            </span>
          )}
          {post.status && (
            <span className="capitalize">
              • {post.status.replace('-', ' ')}
            </span>
          )}
        </div>
      )}

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {post.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {(post.category === 'research' || post.category === 'daily-papers') && (
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {post.pdf && (
            <a
              href={post.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              PDF
            </a>
          )}
          {post.arxiv && (
            <a
              href={post.arxiv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              arXiv
            </a>
          )}
          {post.github && (
            <a
              href={post.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <a
          href={`/blog/${post.slug}`}
          className="inline-block text-[var(--accent)] hover:underline"
        >
          阅读全文 →
        </a>
        {post.readingTime && (
          <span className="text-slate-400">
            {post.readingTime} 分钟阅读
          </span>
        )}
      </div>
    </article>
  );
}

interface BlogListingClientProps {
  allPosts: BlogPostMetadata[];
  allTags: string[];
  allYears: number[];
  allVenues: string[];
}

export default function BlogListingClient({
  allPosts,
  allTags,
  allYears,
  allVenues
}: BlogListingClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = (searchParams.get('category') as BlogCategory | 'all') || 'all';
  const currentTag = searchParams.get('tag');
  const currentYear = searchParams.get('year');
  const currentVenue = searchParams.get('venue');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page');

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    if (currentCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === currentCategory);
    }

    if (currentTag) {
      filtered = filtered.filter((post) => post.tags.includes(currentTag));
    }

    if (currentYear) {
      filtered = filtered.filter((post) => post.date.startsWith(currentYear));
    }

    if (currentVenue) {
      filtered = filtered.filter((post) =>
        post.venue?.toLowerCase().includes(currentVenue.toLowerCase())
      );
    }

    return filtered;
  }, [allPosts, currentCategory, currentTag, currentYear, currentVenue]);

  const perPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / perPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * perPage, currentPage * perPage);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const categoryLabelsAll: Record<BlogCategory | 'all', string> = {
    all: '全部',
    research: '论文笔记',
    'daily-papers': 'AI精选',
    tutorials: '技术教程',
    notes: '学习笔记',
    others: '杂项'
  };

  return (
    <section className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          博客文章
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          记录技术思考、论文笔记与学习心得。
        </p>
        <p className="mt-1 text-xs text-slate-500">
          共 {filteredPosts.length} 篇文章
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
        <div>
          {paginatedPosts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-12 text-center dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">
                没有找到符合条件的文章
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                上一页
              </button>

              <span className="text-sm text-slate-600 dark:text-slate-400">
                第 {currentPage} / {totalPages} 页
              </span>

              <button
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                下一页
              </button>
            </nav>
          )}
        </div>

        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="space-y-6 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              筛选
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                分类
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'research', 'daily-papers', 'tutorials', 'notes', 'others'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat === 'all' ? null : cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      currentCategory === cat
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {categoryLabelsAll[cat]}
                  </button>
                ))}
              </div>
            </div>

            {allYears.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  年份
                </label>
                <select
                  value={currentYear || ''}
                  onChange={(e) => updateFilter('year', e.target.value || null)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">全部年份</option>
                  {allYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {allVenues.length > 0 && (currentCategory === 'research' || currentCategory === 'daily-papers') && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  会议/期刊
                </label>
                <select
                  value={currentVenue || ''}
                  onChange={(e) => updateFilter('venue', e.target.value || null)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">全部会议</option>
                  {allVenues.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {allTags.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => updateFilter('tag', currentTag === tag ? null : tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        currentTag === tag
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(currentCategory !== 'all' || currentTag || currentYear || currentVenue) && (
              <button
                onClick={() => router.push(pathname)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                清除筛选
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
