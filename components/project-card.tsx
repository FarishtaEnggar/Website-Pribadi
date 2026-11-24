import Link from "next/link";
import type { Project } from "@prisma/client";
import { splitTechnologies } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
  const technologies = splitTechnologies(project.technologies);

  return (
    <article className="group">
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border border-line bg-paper-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={`Cover image for ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-base opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ↗
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-b border-line pb-2">
          <span className="eyebrow text-ink-soft">{project.year}</span>
          <span className="eyebrow text-ink-soft">{project.role}</span>
        </div>

        <h3 className="mt-4 font-serif text-2xl leading-snug transition-colors group-hover:text-cobalt md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {project.shortDescription}
        </p>

        {technologies.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {technologies.slice(0, 4).map((technology) => (
              <li
                key={technology}
                className="border border-line px-2.5 py-1 text-[11px] font-medium text-ink-soft"
              >
                {technology}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
          View project
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
