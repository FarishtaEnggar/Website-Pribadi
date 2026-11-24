import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected projects — products, interfaces, and systems built end to end.",
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="container-page py-14 md:py-20">
      <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow flex items-center gap-3 text-cobalt">
            <span aria-hidden="true" className="h-px w-10 bg-cobalt" />
            Portfolio
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">
            Selected
            <br />
            <span className="italic text-cobalt">work</span>
          </h1>
        </div>
        <div className="lg:col-span-4">
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Projects I have designed, built, or helped ship. Each one includes
            the problem, the approach, and the tools used along the way.
          </p>
          <p className="eyebrow mt-6 text-ink-soft">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="mt-16 border border-dashed border-line px-6 py-20 text-center">
          <p className="font-serif text-3xl">No projects published yet</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
            Published projects will appear here as soon as they are ready.
          </p>
        </div>
      ) : (
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
