import Link from "next/link";
import type { Metadata } from "next";
import {
  getFeaturedCertifications,
  getFeaturedProjects,
  getProfile,
  getPublishedProjects,
} from "@/lib/data";
import { SectionLabel } from "@/components/section-label";
import { ProjectCard } from "@/components/project-card";
import { CertificationRow } from "@/components/certification-row";
import { HeroScene } from "@/components/hero-scene";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const [profile, featured, allProjects, certifications] = await Promise.all([
    getProfile(),
    getFeaturedProjects(2),
    getPublishedProjects(),
    getFeaturedCertifications(3),
  ]);

  const projects = featured.length > 0 ? featured : allProjects.slice(0, 2);
  const nameParts = profile.name.trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts.pop() : "";
  const firstName = nameParts.join(" ");
  const biography = profile.biography.split(/\n+/).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
        <div
          aria-hidden="true"
          className="glow-accent absolute -right-40 -top-52 h-[560px] w-[560px] rounded-full"
        />

        <div className="container-page relative grid gap-14 pb-16 pt-14 md:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-24">
          <div className="rise lg:col-span-6">
            <p className="eyebrow flex items-center gap-3 text-cobalt">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-cobalt" />
              {"//"} portfolio — {new Date().getFullYear()}
            </p>

            <h1 className="mt-6 font-display text-[clamp(2.9rem,8vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.045em]">
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className="text-cobalt">{lastName}</span>
                </>
              )}
            </h1>

            <p className="mt-6 font-mono text-sm text-cobalt">
              <span aria-hidden="true">$ </span>
              {profile.title}
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft text-pretty">
              {profile.shortBio}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-3 bg-cobalt px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-accent transition-colors hover:bg-cobalt-deep"
              >
                View work
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-line px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-cobalt hover:text-cobalt"
              >
                Get in touch
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-[11px] uppercase tracking-[0.14em]">
              <div>
                <dt className="text-ink-soft">Status</dt>
                <dd className="mt-1 flex items-center gap-2 text-ink">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-cobalt"
                  />
                  {profile.availability}
                </dd>
              </div>
              <div>
                <dt className="text-ink-soft">Based in</dt>
                <dd className="mt-1 text-ink">{profile.location}</dd>
              </div>
            </dl>
          </div>

          <div className="rise-late lg:col-span-6">
            <HeroScene className="h-[300px] w-full sm:h-[360px] lg:h-[420px]" />

            <div className="terminal relative z-10 mx-auto -mt-16 w-[min(100%,27rem)] lg:mr-0">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cobalt/80" />
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink-soft/40" />
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink-soft/40" />
                <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  whoami.sh
                </span>
              </div>
              <div className="space-y-1 px-4 py-4 font-mono text-[11.5px] leading-relaxed md:text-xs">
                <p className="text-ink-soft">
                  <span className="text-cobalt">$</span> cat identity
                </p>
                <p className="text-ink">{profile.name}</p>
                <p className="text-ink">{profile.title}</p>
                <p className="pt-2 text-ink-soft">
                  <span className="text-cobalt">$</span> status --now
                </p>
                <p className="flex items-center gap-2 text-ink">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-cobalt"
                  />
                  {profile.availability}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container-page py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionLabel index="01">About</SectionLabel>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
              A short introduction
            </h2>

            <figure className="relative mt-10 lg:mt-14">
              <div
                aria-hidden="true"
                className="absolute -inset-2 border border-line"
              />
              <div className="relative aspect-[4/5] overflow-hidden border border-line bg-paper-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                <span>{profile.location}</span>
                <span className="text-cobalt">portrait.jpg</span>
              </figcaption>
            </figure>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="prose-editorial max-w-2xl space-y-4 text-base leading-relaxed text-ink-soft md:text-[1.05rem]">
              {biography.map((paragraph, index) => (
                <p key={index} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>

            <dl className="mt-10 grid gap-x-8 sm:grid-cols-2">
              <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                <dt className="eyebrow text-ink-soft">Location</dt>
                <dd className="text-sm font-medium">{profile.location}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                <dt className="eyebrow text-ink-soft">Availability</dt>
                <dd className="text-right text-sm font-medium">
                  {profile.availability}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                <dt className="eyebrow text-ink-soft">Email</dt>
                <dd className="text-sm font-medium">
                  <a
                    href={`mailto:${profile.email}`}
                    className="underline-offset-4 hover:text-cobalt hover:underline"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                <dt className="eyebrow text-ink-soft">Elsewhere</dt>
                <dd className="flex gap-4 text-sm font-medium">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline-offset-4 hover:text-cobalt hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline-offset-4 hover:text-cobalt hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  {profile.instagramUrl && (
                    <a
                      href={profile.instagramUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline-offset-4 hover:text-cobalt hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="border-t border-line bg-paper-soft/40 py-20 md:py-28">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="02">Selected work</SectionLabel>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
                Recent projects
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:text-cobalt"
            >
              All projects
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-10">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-12 border border-dashed border-line px-6 py-16 text-center">
              <p className="font-display text-2xl">Projects are on the way</p>
              <p className="mt-2 text-sm text-ink-soft">
                Published work will appear here as soon as it is ready.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Certifications */}
      <section className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="03">Certifications</SectionLabel>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
              Verified learning
            </h2>
          </div>
          <Link
            href="/certifications"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:text-cobalt"
          >
            All certifications
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-10">
          {certifications.length > 0 ? (
            certifications.map((certification, index) => (
              <CertificationRow
                key={certification.id}
                certification={certification}
                index={index + 1}
              />
            ))
          ) : (
            <div className="border border-dashed border-line px-6 py-16 text-center">
              <p className="font-display text-2xl">No certifications yet</p>
              <p className="mt-2 text-sm text-ink-soft">
                Featured certifications will be listed here.
              </p>
            </div>
          )}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* Contact band */}
      <section className="relative isolate overflow-hidden border-t border-line bg-paper-soft">
        <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
        <div
          aria-hidden="true"
          className="glow-accent absolute -left-40 bottom-[-240px] h-[520px] w-[520px] rounded-full"
        />
        <div className="container-page relative py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-8">
              <p className="eyebrow text-cobalt">04 — Contact</p>
              <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5.4vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.04em]">
                Let&apos;s build something
                <br />
                <span className="text-cobalt">worth keeping.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                Have a project, a question, or simply want to say hello? My inbox
                is always open.
              </p>
              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-3 bg-cobalt px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-accent transition-colors hover:bg-cobalt-deep"
              >
                Get in touch
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="mt-5 block font-mono text-xs text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-cobalt hover:decoration-cobalt"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
