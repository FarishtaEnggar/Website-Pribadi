import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function AdminOverviewPage() {
  const [projectCount, certificationCount, messageCount, unreadCount, messages] =
    await Promise.all([
      prisma.project.count(),
      prisma.certification.count(),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    {
      label: "Projects",
      value: projectCount,
      href: "/admin/portfolio",
      note: "Published and drafts",
    },
    {
      label: "Certifications",
      value: certificationCount,
      href: "/admin/certifications",
      note: "All credentials",
    },
    {
      label: "Messages",
      value: messageCount,
      href: "/admin/messages",
      note: "All time",
    },
    {
      label: "Unread",
      value: unreadCount,
      href: "/admin/messages",
      note: "Waiting for a reply",
      highlight: unreadCount > 0,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-cobalt">Admin</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Overview
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Everything on your website, at a glance.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="group inline-flex items-center gap-2 border border-ink/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
        >
          Open website
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </Link>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-line bg-paper p-5 transition-colors hover:border-ink/30"
          >
            <p className="eyebrow text-ink-soft">{stat.label}</p>
            <p
              className={`mt-4 font-serif text-5xl leading-none ${
                stat.highlight ? "text-cobalt" : "text-ink"
              }`}
            >
              {stat.value}
            </p>
            <p className="mt-4 flex items-center justify-between gap-2 text-xs text-ink-soft">
              {stat.note}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-ink-soft">Inbox</p>
            <h2 className="mt-2 font-serif text-2xl">Latest messages</h2>
          </div>
          <Link
            href="/admin/messages"
            className="text-sm font-semibold underline-offset-4 hover:text-cobalt hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-5 border border-line bg-paper">
          {messages.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-serif text-xl">The inbox is empty</p>
              <p className="mt-2 text-sm text-ink-soft">
                Messages sent through the contact form will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {messages.map((message) => (
                <li key={message.id}>
                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-paper-soft/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <span
                            aria-label="Unread"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt"
                          />
                        )}
                        <p className="truncate text-sm font-semibold">
                          {message.subject}
                        </p>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-soft">
                        {message.name} · {message.email}
                      </p>
                    </div>
                    <p className="eyebrow shrink-0 text-ink-soft">
                      {formatDateTime(message.createdAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-12">
        <p className="eyebrow text-ink-soft">Shortcuts</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/portfolio/new"
            className="bg-cobalt px-5 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-cobalt-deep"
          >
            + New project
          </Link>
          <Link
            href="/admin/certifications/new"
            className="border border-line bg-paper px-5 py-3 text-sm font-semibold transition-colors hover:border-ink"
          >
            + New certification
          </Link>
          <Link
            href="/admin/profile"
            className="border border-line bg-paper px-5 py-3 text-sm font-semibold transition-colors hover:border-ink"
          >
            Edit profile
          </Link>
        </div>
      </section>
    </div>
  );
}
