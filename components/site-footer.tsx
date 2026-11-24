import Link from "next/link";
import type { Profile } from "@prisma/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/certifications", label: "Certifications" },
  { href: "/portfolio", label: "Portfolio" },
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
            <p className="font-serif text-3xl leading-tight md:text-4xl">
              {profile.name}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              {profile.title}
            </p>
            <p className="eyebrow mt-6 text-ink-soft">{profile.location}</p>
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
                    className="text-sm text-ink transition-colors hover:text-cobalt"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p>Built with Next.js &amp; Tailwind CSS</p>
            <Link
              href="/login"
              className="transition-colors hover:text-cobalt"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
