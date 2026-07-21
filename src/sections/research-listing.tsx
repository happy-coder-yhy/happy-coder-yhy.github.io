import worksZh from '@/content/research/works.zh.json';
import worksEn from '@/content/research/works.en.json';
import { ResearchWork, ResearchWorkLink } from '@/types/research';
import Link from 'next/link';

function ResearchLink({ link }: { link: ResearchWorkLink }) {
  const baseClasses = "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all";

  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${baseClasses} border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md dark:border-blue-900/30 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:border-blue-800/50 dark:hover:bg-blue-900/40`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {link.label}
    </Link>
  );
}

export function ResearchListing({ locale }: { locale: 'zh' | 'en' }) {
  const works = (locale === 'zh' ? worksZh : worksEn) as ResearchWork[];

  return (
    <section className="py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Paper Notes Wiki</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {locale === 'zh' ? '论文阅读笔记' : 'Paper Reading Notes'}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {locale === 'zh'
            ? '精选论文的阅读笔记与核心要点总结。每篇笔记包含论文动机、方法概要、关键创新点与个人思考，持续更新中。'
            : 'Reading notes and key takeaways from selected papers. Each note covers motivation, method summary, key innovations, and personal reflections.'}
        </p>
      </header>
      <ul className="space-y-6">
        {works.map((work) => (
          <li key={`${work.title}-${work.year}`} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{work.category}</span>
                  <span className="text-slate-400">•</span>
                  <span>{work.year}</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{work.title}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{work.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (<span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {work.links.map((link) => (<ResearchLink key={link.url} link={link} />))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
