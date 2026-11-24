"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/messages", label: "Messages" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({
  name,
  unreadCount,
}: {
  name: string;
  unreadCount: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="border-line bg-paper-soft/50 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:block md:border-b-0 md:px-6 md:pb-6 md:pt-8">
        <div>
          <Link
            href="/admin"
            className="flex items-baseline gap-1.5 font-serif text-xl"
          >
            {name}
            <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
          </Link>
          <p className="eyebrow mt-1 hidden text-ink-soft md:block">
            Admin console
          </p>
        </div>
        <form action={logoutAction} className="md:hidden">
          <button
            type="submit"
            className="eyebrow text-ink-soft transition-colors hover:text-cobalt"
          >
            Sign out
          </button>
        </form>
      </div>

      <nav
        aria-label="Admin"
        className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 md:mt-6 md:flex-1 md:flex-col md:overflow-visible md:border-b-0 md:px-4 md:py-0"
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors md:shrink ${
                active
                  ? "bg-cobalt text-white"
                  : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              <span>{item.label}</span>
              {item.href === "/admin/messages" && unreadCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                    active ? "bg-paper text-cobalt" : "bg-cobalt text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-line p-4 md:block">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-sm text-ink-soft transition-colors hover:text-cobalt"
        >
          View website
          <span aria-hidden="true">↗</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink-soft transition-colors hover:text-cobalt"
          >
            Sign out
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
