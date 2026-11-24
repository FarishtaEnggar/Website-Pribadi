import type { Metadata } from "next";
import { getPublishedCertifications } from "@/lib/data";
import { formatMonthYear } from "@/lib/format";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Professional certifications and continuous learning — verified credentials.",
};

export default async function CertificationsPage() {
  const certifications = await getPublishedCertifications();

  return (
    <div className="container-page py-14 md:py-20">
      <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow flex items-center gap-3 text-cobalt">
            <span aria-hidden="true" className="h-px w-10 bg-cobalt" />
            Certifications
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5rem)] font-medium leading-[0.94] tracking-[-0.045em]">
            Credentials &amp;
            <br />
            <span className="text-cobalt">continuous learning</span>
          </h1>
        </div>
        <div className="lg:col-span-4">
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            A record of formal training and verified credentials. Each entry
            links to its issuer where a public verification page exists.
          </p>
          <p className="eyebrow mt-6 text-ink-soft">
            {certifications.length}{" "}
            {certifications.length === 1 ? "credential" : "credentials"} listed
          </p>
        </div>
      </header>

      {certifications.length === 0 ? (
        <div className="mt-16 border border-dashed border-line px-6 py-20 text-center">
          <p className="font-display text-3xl">Nothing published yet</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
            Certifications added from the admin dashboard will appear on this
            page.
          </p>
        </div>
      ) : (
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {certifications.map((certification) => (
            <article
              key={certification.id}
              className="group flex flex-col border border-line bg-paper-soft/40 p-6 transition-colors hover:border-cobalt/50 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="eyebrow text-cobalt">
                  {new Date(certification.issueDate).getFullYear()}
                </span>
                {certification.featured && (
                  <span className="eyebrow border border-cobalt px-2 py-1 text-cobalt">
                    Featured
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-start gap-4">
                {certification.imageUrl && (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-paper-soft p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={certification.imageUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h2 className="font-display text-xl font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-cobalt md:text-2xl">
                    {certification.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {certification.issuer}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {certification.description}
              </p>

              <dl className="mt-auto space-y-2 border-t border-line pt-6 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="eyebrow text-ink-soft">Issued</dt>
                  <dd>{formatMonthYear(certification.issueDate)}</dd>
                </div>
                {certification.expirationDate && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="eyebrow text-ink-soft">Expires</dt>
                    <dd>{formatMonthYear(certification.expirationDate)}</dd>
                  </div>
                )}
                {certification.credentialId && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="eyebrow text-ink-soft">Credential ID</dt>
                    <dd className="font-mono text-xs">
                      {certification.credentialId}
                    </dd>
                  </div>
                )}
              </dl>

              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] underline-offset-4 hover:text-cobalt hover:underline"
                >
                  Verify credential
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
