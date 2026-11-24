import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMonthYear } from "@/lib/format";
import {
  deleteCertification,
} from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminCertificationsPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: [{ displayOrder: "asc" }, { issueDate: "desc" }],
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-cobalt">Admin</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Certifications
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {certifications.length}{" "}
            {certifications.length === 1 ? "credential" : "credentials"} in the
            database.
          </p>
        </div>
        <Link
          href="/admin/certifications/new"
          className="inline-flex items-center gap-2 bg-cobalt px-5 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-cobalt-deep"
        >
          + New certification
        </Link>
      </header>

      <div className="mt-8 border border-line bg-paper">
        {certifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-2xl">No certifications yet</p>
            <p className="mt-2 text-sm text-ink-soft">
              Add your first credential to show it on the website.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {certifications.map((certification) => (
              <li
                key={certification.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">
                      {certification.title}
                    </p>
                    {certification.featured && (
                      <span className="border border-cobalt px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cobalt">
                        Featured
                      </span>
                    )}
                    {!certification.published && (
                      <span className="border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {certification.issuer} ·{" "}
                    {formatMonthYear(certification.issueDate)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-5">
                  <Link
                    href={`/admin/certifications/${certification.id}`}
                    className="text-xs font-semibold underline-offset-4 hover:text-cobalt hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteCertification}
                    id={certification.id}
                    confirmMessage={`Delete "${certification.title}"? This cannot be undone.`}
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
