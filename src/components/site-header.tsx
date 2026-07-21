'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/site-theme-switcher';

const navItems = [
  { href: '/#about', label: '关于我' },
  { href: '/#research', label: '论文笔记' },
  { href: '/#projects', label: '项目经历' },
  { href: '/#experience', label: '学习经历' },
  { href: '/#contact', label: '联系方式' }
];

const pageNavItems = [
  { href: '/blog', label: '博客' },
  { href: '/research', label: '论文 Wiki' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/72 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-2.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--accent)] shadow-sm">
            W
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              小王的知识 Wiki
            </span>
            <span className="block text-xs text-[var(--muted)]">
              学习 · 笔记 · 成长
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 text-sm font-medium text-[var(--muted)] shadow-sm lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
          {pageNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
