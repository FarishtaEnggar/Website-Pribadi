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
      <section className="container-page pb-14 pt-12 md:pb-20 md:pt-20">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="rise lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-cobalt">
              <span aria-hidden="true" className="h-px w-10 bg-cobalt" />
              Portfolio — {new Date().getFullYear()}
            </p>

            <h1 className="mt-7 font-serif text-[clamp(3.2rem,9vw,7rem)] leading-[0.9] tracking-[-0.02em]">
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className="italic text-cobalt">{lastName}</span>
                </>
              )}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-snug text-ink md:text-xl">
              {profile.title}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft text-pretty">
              {profile.shortBio}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-3 bg-cobalt px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep"
              >
                View portfolio
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-ink/25 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Start a conversation
              </Link>
            </div>
          </div>

          <div className="rise-late lg:col-span-5">
            <figure className="relative mx-auto max-w-md lg:ml-auto lg:mr-0">
              <div
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-full w-full border border-cobalt"
              />
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-xs text-ink-soft">
                <span className="eyebrow">{profile.location}</span>
                <span className="flex items-center gap-2 text-right">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-cobalt"
                  />
                  {profile.availability}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Fact strip */}
      <div className="border-y border-line bg-paper-soft/50">
        <div className="container-page grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-4 sm:py-5 sm:pr-6">
            <p className="eyebrow text-ink-soft">Status</p>
            <p className="mt-1.5 text-sm font-medium">{profile.availability}</p>
          </div>
          <div className="py-4 sm:px-6 sm:py-5">
            <p className="eyebrow text-ink-soft">Based in</p>
            <p className="mt-1.5 text-sm font-medium">{profile.location}</p>
          </div>
          <div className="py-4 sm:pl-6 sm:py-5">
            <p className="eyebrow text-ink-soft">Say hello</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-1.5 block text-sm font-medium underline-offset-4 transition-colors hover:text-cobalt hover:underline"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </div>

      {/* About */}
      <section id="about" className="container-page py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionLabel index="01">About</SectionLabel>
            <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
              A short introduction
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="prose-editorial max-w-2xl space-y-4 text-base leading-relaxed text-ink-soft md:text-[1.05rem]">
              {biography.map((paragraph, index) => (
                <p key={index} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>

            <dl className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2">
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
              <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
                Recent projects
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-semibold"
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
              <p className="font-serif text-2xl">Projects are on the way</p>
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
            <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
              Verified learning
            </h2>
          </div>
          <Link
            href="/certifications"
            className="group inline-flex items-center gap-2 text-sm font-semibold"
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
              <p className="font-serif text-2xl">No certifications yet</p>
              <p className="mt-2 text-sm text-ink-soft">
                Featured certifications will be listed here.
              </p>
            </div>
          )}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* Contact band */}
      <section className="bg-cobalt text-white">
        <div className="container-page py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-8">
              <p className="eyebrow text-white/70">04 — Contact</p>
              <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98]">
                Let&apos;s build something worth keeping.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="max-w-sm text-sm leading-relaxed text-white/80">
                Have a project, a question, or simply want to say hello? My inbox
                is always open.
              </p>
              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-3 bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
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
                className="mt-5 block text-sm text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
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
