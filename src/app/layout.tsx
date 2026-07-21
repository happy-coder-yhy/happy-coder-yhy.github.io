import './globals.css';
import type { Metadata } from 'next';
import { cn } from '@/lib/cn';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: {
    default: '袁皓宇的知识 Wiki',
    template: '%s | 袁皓宇的知识 Wiki'
  },
  description: '袁皓宇的知识库与个人主页 — 记录学习经历、论文笔记、项目经验与技术思考。'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased')}>
        <Providers>
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 sm:px-8 sm:py-10">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
