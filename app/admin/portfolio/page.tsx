import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteProject } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminPortfolioPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-cobalt">Admin</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Portfolio
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {projects.length} {projects.length === 1 ? "project" : "projects"} in
            the database.
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 bg-cobalt px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep"
        >
          + New project
        </Link>
      </header>

      <div className="mt-8 border border-line bg-paper">
        {projects.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-2xl">No projects yet</p>
            <p className="mt-2 text-sm text-ink-soft">
              Add your first project to build the portfolio.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="hidden h-12 w-16 shrink-0 overflow-hidden border border-line bg-paper-soft sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold">
                        {project.title}
                      </p>
                      {project.featured && (
                        <span className="border border-cobalt px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cobalt">
                          Featured
                        </span>
                      )}
                      {!project.published && (
                        <span className="border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      /{project.slug} · {project.year}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-5">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                  >
                    View ↗
                  </Link>
                  <Link
                    href={`/admin/portfolio/${project.id}`}
                    className="text-xs font-semibold underline-offset-4 hover:text-cobalt hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteProject}
                    id={project.id}
                    confirmMessage={`Delete "${project.title}"? This cannot be undone.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
