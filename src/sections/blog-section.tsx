import { getRecentPosts } from '@/lib/blog';
import Link from 'next/link';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export function BlogSection() {
  const posts = getRecentPosts('zh', 2);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            最新文章
          </h2>
        </div>
        <Link href="/blog" className="text-sm hover:underline">
          阅读更多
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60"
          >
            <time className="text-xs uppercase tracking-wide text-slate-400">
              {formatDate(post.date)}
            </time>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {post.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-[var(--accent)]">
              查看详情 →
            </div>
          </Link>
        ))}
      </ul>
    </section>
  );
}
