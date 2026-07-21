import projectsZh from '@/content/projects/projects.zh.json';
import projectsEn from '@/content/projects/projects.en.json';
import Link from 'next/link';

interface Project {
  title: string;
  summary: string;
  tags: string[];
  links: { github?: string; demo?: string };
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{project.title}</h3>
        <div className="flex gap-2 text-sm text-[var(--accent)]">
          {project.links.github && <Link href={project.links.github} target="_blank" rel="noreferrer">GitHub</Link>}
          {project.links.demo && <Link href={project.links.demo} target="_blank" rel="noreferrer">Demo</Link>}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (<span key={tag} className="meta-chip">{tag}</span>))}
      </div>
    </li>
  );
}

export function ProjectsSection({ locale }: { locale: 'zh' | 'en' }) {
  const collection = (locale === 'zh' ? projectsZh : projectsEn) as Project[];

  return (
    <section id="projects" className="section-shell">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{locale === 'zh' ? '项目经历' : 'Projects'}</h2>
        </div>
        <Link href={locale === 'zh' ? '/projects' : '/en/projects'} className="pill-link text-[var(--accent)] hover:border-[var(--accent)]">
          {locale === 'zh' ? '查看全部' : 'View all'}
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {collection.map((project) => (<ProjectCard key={project.title} project={project} />))}
      </ul>
    </section>
  );
}
