import Link from "next/link";
import { createProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
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
        <p className="eyebrow text-cobalt">New entry</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          Add a project
        </h1>
      </header>

      <div className="mt-8">
        <ProjectForm action={createProject} submitLabel="Create project" />
      </div>
    </div>
  );
}
