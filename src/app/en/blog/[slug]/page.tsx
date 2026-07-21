import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { CommentsSection } from '@/components/comments-section';
import 'highlight.js/styles/github-dark.css';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function EnBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16">
      <header className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-700">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <time dateTime={post.date}>{post.date}</time>
          {post.readingTime && <span>• {post.readingTime} min read</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeHighlight,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }]
              ]
            }
          }}
        />
      </div>
      <CommentsSection />
    </article>
  );
}
