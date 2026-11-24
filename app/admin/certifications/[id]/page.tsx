import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateCertification } from "@/app/admin/actions";
import { CertificationForm } from "@/components/admin/certification-form";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certification = await prisma.certification.findUnique({ where: { id } });

  if (!certification) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-10 md:py-12">
      <Link
        href="/admin/certifications"
        className="eyebrow inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-cobalt"
      >
        <span aria-hidden="true">←</span>
        Certifications
      </Link>

      <header className="mt-6">
        <p className="eyebrow text-cobalt">Edit entry</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          {certification.title}
        </h1>
      </header>

      <div className="mt-8">
        <CertificationForm
          action={updateCertification}
          certification={certification}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
