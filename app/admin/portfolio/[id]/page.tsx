import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-10 md:py-12">
      <Link
        href="/admin/portfolio"
        className="eyebrow inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-cobalt"
      >
        <span aria-hidden="true">←</span>
        Portfolio
      </Link>

      <header className="mt-6">
        <p className="eyebrow text-cobalt">Edit entry</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          {project.title}
        </h1>
      </header>

      <div className="mt-8">
        <ProjectForm
          action={updateProject}
          project={project}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
