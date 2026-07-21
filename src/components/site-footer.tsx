import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} 小王 · 个人知识 Wiki. Built with Next.js & Tailwind CSS.</p>
        <div className="flex items-center gap-4">
          <Link className="hover:text-[var(--accent)]" href="mailto:haoyuyuan@outlook.com">Email</Link>
          <Link className="hover:text-[var(--accent)]" href="https://github.com/happy-coder-yhy">GitHub</Link>
          <Link className="hover:text-[var(--accent)]" href="/blog">博客</Link>
        </div>
      </div>
    </footer>
  );
}
