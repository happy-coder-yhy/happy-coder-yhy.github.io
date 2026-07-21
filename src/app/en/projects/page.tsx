import projectsData from '@/content/projects/projects.en.json';
import Link from 'next/link';

interface Project {
  title: string;
  summary: string;
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
}

export default function EnProjectsListingPage() {
  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Personal projects, course projects, and technical practice.
      </p>
      <ul className="mt-10 space-y-6">
        {(projectsData as Project[]).map((project) => (
          <li key={project.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-sm text-[var(--accent)]">
              {project.links.github && <Link href={project.links.github} target="_blank" rel="noreferrer">GitHub</Link>}
              {project.links.demo && <Link href={project.links.demo} target="_blank" rel="noreferrer">Demo</Link>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
