import type { Metadata } from "next";
import { getProfile } from "@/lib/data";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for projects, collaborations, or a simple hello.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  const socials = [
    { label: "GitHub", href: profile.githubUrl },
    { label: "LinkedIn", href: profile.linkedinUrl },
    { label: "Instagram", href: profile.instagramUrl },
  ].filter((social) => Boolean(social.href));

  return (
    <div className="container-page py-14 md:py-20">
      <header className="max-w-3xl">
        <p className="eyebrow flex items-center gap-3 text-cobalt">
          <span aria-hidden="true" className="h-px w-10 bg-cobalt" />
          Contact
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5rem)] font-medium leading-[0.94] tracking-[-0.045em]">
          Say <span className="text-cobalt">hello</span>.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft text-pretty">
          Whether you have a project in mind, a question I might be able to
          answer, or simply want to introduce yourself — I read every message.
        </p>
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="border-t border-line">
            <div className="border-b border-line py-4">
              <p className="eyebrow text-ink-soft">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-1.5 block text-base font-medium underline-offset-4 transition-colors hover:text-cobalt hover:underline"
              >
                {profile.email}
              </a>
            </div>
            <div className="border-b border-line py-4">
              <p className="eyebrow text-ink-soft">Based in</p>
              <p className="mt-1.5 text-base font-medium">{profile.location}</p>
            </div>
            <div className="border-b border-line py-4">
              <p className="eyebrow text-ink-soft">Availability</p>
              <p className="mt-1.5 text-base font-medium">
                {profile.availability}
              </p>
            </div>
          </div>

          {socials.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow text-ink-soft">Elsewhere</p>
              <ul className="mt-3 space-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href as string}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 text-sm font-medium"
                    >
                      {social.label}
                      <span
                        aria-hidden="true"
                        className="text-ink-soft transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 border border-line bg-paper-soft/60 p-6">
            <p className="font-display text-xl font-medium leading-snug">
              Typical reply time
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Within two business days. Messages are stored securely and never
              shared.
            </p>
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
