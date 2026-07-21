import Link from 'next/link';
import { Mail, GitFork } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function ContactSection({ locale }: { locale: 'zh' | 'en' }) {
  const copy = locale === 'zh'
    ? {
        heading: '联系方式',
        description: '欢迎就技术学习、项目合作或学术交流与我联系。',
        email: 'Email',
        github: 'GitHub',
      }
    : {
        heading: 'Get in Touch',
        description: "Let's connect for technical discussions, collaborations, or academic exchanges.",
        email: 'Email',
        github: 'GitHub',
      };

  return (
    <section id="contact" className="section-shell">
      <div className="glass-panel rounded-[2rem] p-6 md:p-10">
        <h2 className="text-center text-2xl font-semibold tracking-[-0.03em]">{copy.heading}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-[var(--muted)]">
          {copy.description}
        </p>
        <div className="mt-10 flex flex-col items-center gap-6">
          <Link
            href={`mailto:${siteConfig.author.email}`}
            className="group flex w-full max-w-md items-center gap-3 glass-card rounded-2xl p-4"
          >
            <div className="rounded-full bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{copy.email}</div>
              <div className="text-xs text-[var(--muted)]">{siteConfig.author.email}</div>
            </div>
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full max-w-md items-center gap-3 glass-card rounded-2xl p-4"
          >
            <div className="rounded-full bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
              <GitFork className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{copy.github}</div>
              <div className="text-xs text-[var(--muted)]">github.com/happy-coder-yhy</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
