export function HeroSection({ locale }: { locale: 'zh' | 'en' }) {
  const copy = locale === 'zh'
    ? {
        tagline: '杭州电子科技大学 · 计算机技术',
        title: '袁皓宇的知识 Wiki',
        intro: '你好，我是袁皓宇，杭州电子科技大学 2026 级计算机技术专业硕士研究生，本科毕业于中国民航大学。这里记录了我的学习经历、论文阅读笔记与项目经验，希望这些内容对你有所启发。',
        actionNotes: '查看论文笔记',
        actionExperience: '了解我的经历',
        status: '当前关注：LLM Agent',
      }
    : {
        tagline: 'HDU · Computer Science',
        title: "Haoyu Yuan's Knowledge Wiki",
        intro: "Hi, I'm Haoyu Yuan (袁皓宇), a 2026 master's student in Computer Science at Hangzhou Dianzi University, with a B.Eng. from Civil Aviation University of China. This wiki documents my learning journey, paper reading notes, and project experiences.",
        actionNotes: 'View Paper Notes',
        actionExperience: 'My Experience',
        status: 'Current focus: LLM Agent systems, knowledge externalization & agent collaboration',
      };

  return (
    <section id="about" className="section-shell pt-8 sm:pt-12">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="section-kicker">{copy.tagline}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.45rem]">
              <span className="block">{copy.title}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              {copy.intro}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#research" className="pill-link-primary">
                {copy.actionNotes}
              </a>
              <a href="#experience" className="pill-link text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                {copy.actionExperience}
              </a>
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">{copy.status}</p>
          </div>
          <div className="relative">
            <div className="mx-auto max-w-[21rem] rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-xl shadow-black/10">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-gradient-to-br from-[var(--accent-soft)] via-[var(--accent)]/20 to-[var(--accent-soft)] flex items-center justify-center">
                <span className="text-6xl font-bold text-[var(--accent)] select-none">皓宇</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                  <div className="text-xs font-semibold text-[var(--foreground)]">{locale === 'zh' ? '杭电' : 'HDU'}</div>
                  <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{locale === 'zh' ? '硕士 2026' : 'MS 2026'}</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                  <div className="text-xs font-semibold text-[var(--foreground)]">{locale === 'zh' ? '中国民航大学' : 'CAUC'}</div>
                  <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{locale === 'zh' ? '本科' : 'B.Eng.'}</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                  <div className="text-xs font-semibold text-[var(--foreground)]">{locale === 'zh' ? 'LLM Agent' : 'LLM Agent'}</div>
                  <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{locale === 'zh' ? '研究方向' : 'Research'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
