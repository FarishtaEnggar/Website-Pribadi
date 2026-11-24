import type { Certification } from "@prisma/client";
import { formatMonthYear } from "@/lib/format";

export function CertificationRow({
  certification,
  index,
}: {
  certification: Certification;
  index: number;
}) {
  return (
    <article className="group grid gap-3 border-t border-line py-6 md:grid-cols-12 md:items-baseline md:gap-6">
      <p className="eyebrow text-cobalt md:col-span-1">
        {String(index).padStart(2, "0")}
      </p>

      <div className="md:col-span-4">
        <h3 className="font-serif text-xl leading-snug transition-colors group-hover:text-cobalt md:text-2xl">
          {certification.title}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{certification.issuer}</p>
      </div>

      <p className="text-sm leading-relaxed text-ink-soft md:col-span-4">
        {certification.description}
      </p>

      <p className="eyebrow text-ink-soft md:col-span-2">
        {formatMonthYear(certification.issueDate)}
      </p>

      <div className="md:col-span-1 md:justify-self-end">
        {certification.credentialUrl ? (
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="eyebrow inline-flex items-center gap-1 text-ink transition-colors hover:text-cobalt"
          >
            Verify
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="eyebrow text-ink-soft/50">—</span>
        )}
      </div>
    </article>
  );
}
