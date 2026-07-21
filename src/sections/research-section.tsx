import researchOverview from '@/content/research/overview.zh.json';
import worksData from '@/content/research/works.zh.json';
import researchOverviewEn from '@/content/research/overview.en.json';
import worksDataEn from '@/content/research/works.en.json';
import { ResearchWork, ResearchWorkLink } from '@/types/research';
import Link from 'next/link';

interface FocusItem {
  title: string;
  description: string;
}

interface ResearchOverview {
  headline: string;
  summary: string;
  focus: FocusItem[];
}

function ResearchLinkButton({ link }: { link: ResearchWorkLink }) {
  const baseClasses = "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all";

  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${baseClasses} border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {link.label}
    </Link>
  );
}

export function ResearchSection({ locale }: { locale: 'zh' | 'en' }) {
  const overview = (locale === 'zh' ? researchOverview : researchOverviewEn) as ResearchOverview;
  const works = (locale === 'zh' ? worksData : worksDataEn) as ResearchWork[];

  return (
    <section id="research" className="section-shell">
      <div className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <p className="section-kicker">Paper Notes Wiki</p>
        <h2 className="section-title">{overview.headline}</h2>
        <p className="section-lede">{overview.summary}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {overview.focus.map((item) => (
            <div key={item.title} className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {locale === 'zh' ? '论文阅读清单' : 'Reading List'}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {locale === 'zh' ? '精选论文的阅读笔记与核心要点总结，持续更新中。' : 'Reading notes and key takeaways from selected papers.'}
            </p>
          </div>
          <Link href={locale === 'zh' ? '/research' : '/en/research'} className="pill-link text-[var(--accent)] hover:border-[var(--accent)]">
            {locale === 'zh' ? '查看全部论文笔记 →' : 'View all notes →'}
          </Link>
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {works.slice(0, 4).map((work) => (
            <li key={`${work.title}-${work.year}`} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                <span>{work.category}</span>
                <span>{work.year}</span>
              </div>
              <h4 className="mt-3 text-lg font-semibold leading-7 tracking-[-0.02em] text-[var(--foreground)]">{work.title}</h4>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{work.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {work.tags.map((tag) => (<span key={tag} className="meta-chip">{tag}</span>))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {work.links.map((link) => (<ResearchLinkButton key={link.url} link={link} />))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
