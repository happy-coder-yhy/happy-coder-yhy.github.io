import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="about" className="section-shell pt-8 sm:pt-12">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="section-kicker">北京大学 · 计算机科学</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.45rem]">
              <span className="block">小王的知识 Wiki</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              你好，我是小王，北京大学计算机科学与技术专业 2026 级硕士研究生。
              这里记录了我的学习经历、论文阅读笔记、项目经验与技术思考。
              希望这个知识库能帮助你了解我，也希望其中的内容对你有所启发。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#research" className="pill-link-primary">
                查看论文笔记
              </a>
              <a href="#experience" className="pill-link text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                了解我的经历
              </a>
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">
              当前关注：大语言模型推理、多模态学习与知识增强
            </p>
          </div>
          <div className="relative">
            <div className="mx-auto max-w-[21rem] rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-xl shadow-black/10">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-gradient-to-br from-[var(--accent-soft)] via-[var(--accent)]/20 to-[var(--accent-soft)] flex items-center justify-center">
                <span className="text-6xl font-bold text-[var(--accent)] select-none">小王</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                  <div className="text-xs font-semibold text-[var(--foreground)]">北京大学</div>
                  <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">硕士 2026</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                  <div className="text-xs font-semibold text-[var(--foreground)]">计算机</div>
                  <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">科学方向</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                  <div className="text-xs font-semibold text-[var(--foreground)]">LLM/AI</div>
                  <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">研究方向</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
