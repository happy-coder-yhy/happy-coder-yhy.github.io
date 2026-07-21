import experienceData from '@/content/experience/experience.zh.json';

interface ExperienceItem {
  timeframe: string;
  title: string;
  company: string;
  logo: string;
  url: string;
  highlights: string[];
}

export function ExperienceSection() {
  const list = experienceData as ExperienceItem[];

  return (
    <section id="experience" className="section-shell">
      <h2 className="text-2xl font-semibold tracking-[-0.03em]">
        学习经历
      </h2>
      <ol className="mt-8 space-y-6 border-l border-[var(--border)] pl-6">
        {list.map((item) => (
          <li key={`${item.company}-${item.timeframe}`} className="relative">
            <span className="absolute -left-3 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-xs text-white shadow-lg shadow-indigo-500/20">
              ●
            </span>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    {item.title} ·{' '}
                    <span className="text-[var(--accent)]">
                      {item.company}
                    </span>
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>• {highlight}</li>
                    ))}
                  </ul>
                </div>
                <span className="shrink-0 text-xs uppercase tracking-wide text-[var(--muted)] sm:text-right">
                  {item.timeframe}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
