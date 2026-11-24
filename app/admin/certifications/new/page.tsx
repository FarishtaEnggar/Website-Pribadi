import Link from "next/link";
import { createCertification } from "@/app/admin/actions";
import { CertificationForm } from "@/components/admin/certification-form";

export default function NewCertificationPage() {
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
        <p className="eyebrow text-cobalt">New entry</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          Add a certification
        </h1>
      </header>

      <div className="mt-8">
        <CertificationForm
          action={createCertification}
          submitLabel="Create certification"
        />
      </div>
    </div>
  );
}
