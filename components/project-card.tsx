import Link from "next/link";
import type { Project } from "@prisma/client";
import { splitTechnologies } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
  const technologies = splitTechnologies(project.technologies);

  return (
    <article className="group relative border border-line bg-paper-soft/40 transition-colors duration-300 hover:border-cobalt/50">
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-paper-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={`Cover image for ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-line bg-paper/80 font-mono text-xs text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            ↗
          </span>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            <span>{project.year}</span>
            <span>{project.role}</span>
          </div>

          <h3 className="mt-4 font-display text-xl font-medium leading-snug tracking-[-0.02em] transition-colors group-hover:text-cobalt md:text-2xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {project.shortDescription}
          </p>

          {technologies.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {technologies.slice(0, 4).map((technology) => (
                <li
                  key={technology}
                  className="border border-line px-2 py-1 font-mono text-[10px] text-ink-soft"
                >
                  {technology}
                </li>
              ))}
            </ul>
          )}

          <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cobalt">
            View project
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
