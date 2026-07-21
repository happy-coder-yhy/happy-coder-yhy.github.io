import Link from 'next/link';
import { Mail, GitFork } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function ContactSection() {
  return (
    <section id="contact" className="section-shell">
      <div className="glass-panel rounded-[2rem] p-6 md:p-10">
        <h2 className="text-center text-2xl font-semibold tracking-[-0.03em]">联系方式</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-[var(--muted)]">
          欢迎就技术学习、项目合作或学术交流与我联系。
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          {/* Email */}
          <Link
            href={`mailto:${siteConfig.author.email}`}
            className="group flex w-full max-w-md items-center gap-3 glass-card rounded-2xl p-4"
          >
            <div className="rounded-full bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs text-[var(--muted)]">{siteConfig.author.email}</div>
            </div>
          </Link>

          {/* GitHub */}
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
              <div className="text-sm font-medium">GitHub</div>
              <div className="text-xs text-[var(--muted)]">github.com/happy-coder-yhy</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
