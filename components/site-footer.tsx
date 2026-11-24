import Link from "next/link";
import type { Profile } from "@prisma/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Work" },
  { href: "/certifications", label: "Certifications" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({ profile }: { profile: Profile }) {
  const socials = [
    { label: "GitHub", href: profile.githubUrl },
    { label: "LinkedIn", href: profile.linkedinUrl },
    { label: "Instagram", href: profile.instagramUrl },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="border-t border-line bg-paper-soft/60">
      <div className="container-page py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
              {profile.name}
            </p>
            <p className="mt-3 max-w-xs font-mono text-xs leading-relaxed text-cobalt">
              {profile.title}
            </p>
            <p className="eyebrow mt-6 flex items-center gap-2 text-ink-soft">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-cobalt"
              />
              {profile.location}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-ink-soft">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink transition-colors hover:text-cobalt"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow text-ink-soft">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm text-ink transition-colors hover:text-cobalt"
                >
                  {profile.email}
                </a>
              </li>
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href as string}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-cobalt"
                  >
                    {social.label}
                    <span aria-hidden="true" className="text-ink-soft">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex items-center gap-5">
            <p>Next.js · Tailwind CSS · Three.js</p>
            <Link href="/login" className="transition-colors hover:text-cobalt">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
