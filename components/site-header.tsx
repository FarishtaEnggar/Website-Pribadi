"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Work" },
  { href: "/certifications", label: "Certifications" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-sm"
          aria-label={`${name} — home`}
        >
          <span aria-hidden="true" className="text-cobalt">
            ~/
          </span>
          <span className="font-display text-base font-semibold tracking-tight md:text-lg">
            {name}
          </span>
          <span aria-hidden="true" className="cursor-blink text-cobalt">
            _
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-cobalt ${
                  active ? "text-cobalt" : "text-ink-soft"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px h-px bg-cobalt transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex items-center gap-2.5 border border-line px-3.5 py-2 md:hidden"
        >
          <span className="flex w-4 flex-col gap-1">
            <span
              className={`h-px w-full bg-ink transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </span>
          <span className="eyebrow text-ink">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper md:hidden">
          <nav className="container-page py-4" aria-label="Mobile">
            <ul>
              {links.map((link, index) => {
                const active = isActive(pathname, link.href);
                return (
                  <li
                    key={link.href}
                    className="border-b border-line/70 last:border-0"
                  >
                    <Link
                      href={link.href}
                      className="flex items-baseline justify-between py-4"
                    >
                      <span
                        className={`font-display text-2xl font-medium tracking-tight ${
                          active ? "text-cobalt" : "text-ink"
                        }`}
                      >
                        {link.label}
                      </span>
                      <span className="eyebrow text-ink-soft">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
