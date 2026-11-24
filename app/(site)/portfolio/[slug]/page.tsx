import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, splitTechnologies } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const technologies = splitTechnologies(project.technologies);
  const paragraphs = project.description.split(/\n+/).filter(Boolean);

  return (
    <article className="container-page py-12 md:py-16">
      <Link
        href="/portfolio"
        className="eyebrow inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-cobalt"
      >
        <span aria-hidden="true">←</span>
        All projects
      </Link>

      <header className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <p className="eyebrow flex flex-wrap items-center gap-3 text-cobalt">
            <span>{project.year}</span>
            <span aria-hidden="true" className="h-px w-6 bg-cobalt/40" />
            <span>{project.role}</span>
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.02em]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
            {project.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-3 lg:col-span-3 lg:justify-end">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 bg-cobalt px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep"
            >
              Live site
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border border-ink/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              Source
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </header>

      <div className="mt-10 overflow-hidden border border-line bg-paper-soft md:mt-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.imageUrl}
          alt={`Cover image for ${project.title}`}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="eyebrow text-ink-soft">The story</p>
          <div className="prose-editorial mt-6 space-y-4 text-base leading-relaxed text-ink-soft md:text-[1.05rem]">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <dl className="space-y-0">
            <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
              <dt className="eyebrow text-ink-soft">Year</dt>
              <dd className="text-sm font-medium">{project.year}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
              <dt className="eyebrow text-ink-soft">Role</dt>
              <dd className="text-right text-sm font-medium">{project.role}</dd>
            </div>
            <div className="border-t border-line py-3">
              <dt className="eyebrow text-ink-soft">Technologies</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="border border-line px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                  >
                    {technology}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-8 border border-line bg-paper-soft/60 p-6">
            <p className="font-serif text-2xl leading-snug">
              Interested in something similar?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              I am available for selected projects and collaborations.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Start a conversation
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
