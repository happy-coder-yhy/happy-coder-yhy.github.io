'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleSwitcher } from '@/components/site-locale-switcher';
import { ThemeSwitcher } from '@/components/site-theme-switcher';

const navItems = [
  { href: '#about', labelZh: '关于我', labelEn: 'About' },
  { href: '#research', labelZh: '论文笔记', labelEn: 'Paper Notes' },
  { href: '#projects', labelZh: '项目经历', labelEn: 'Projects' },
  { href: '#experience', labelZh: '学习经历', labelEn: 'Experience' },
  { href: '#contact', labelZh: '联系方式', labelEn: 'Contact' }
];

const pageNavItems = [
  { href: '/blog', hrefEn: '/en/blog', labelZh: '博客', labelEn: 'Blog' },
  { href: '/research', hrefEn: '/en/research', labelZh: '论文 Wiki', labelEn: 'Paper Wiki' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');
  const isHomePage = pathname === '/' || pathname === '/en';

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/72 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-2.5 sm:px-8">
        <Link href={isEnglish ? '/en' : '/'} className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--accent)] shadow-sm">
            HY
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {isEnglish ? "Haoyu Yuan" : '袁皓宇'}
            </span>
            <span className="block text-xs text-[var(--muted)]">
              {isEnglish ? 'Learning · Notes · Growth' : '学习 · 笔记 · 成长'}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 text-sm font-medium text-[var(--muted)] shadow-sm lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={isHomePage ? item.href : (isEnglish ? `/en${item.href}` : item.href)}
              className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
            >
              {isEnglish ? item.labelEn : item.labelZh}
            </Link>
          ))}
          {pageNavItems.map((item) => (
            <Link
              key={item.href}
              href={isEnglish ? item.hrefEn : item.href}
              className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
            >
              {isEnglish ? item.labelEn : item.labelZh}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
