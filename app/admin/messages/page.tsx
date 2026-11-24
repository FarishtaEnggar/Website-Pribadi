import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
      <header>
        <p className="eyebrow text-cobalt">Admin</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          Messages
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {messages.length}{" "}
          {messages.length === 1 ? "message" : "messages"} total · {unread}{" "}
          unread
        </p>
      </header>

      <div className="mt-8 border border-line bg-paper">
        {messages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-2xl">The inbox is empty</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              Messages submitted through the public contact form will show up
              here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((message) => (
              <li key={message.id}>
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="group flex flex-col gap-3 px-5 py-5 transition-colors hover:bg-paper-soft/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!message.read && (
                        <span
                          aria-label="Unread"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt"
                        />
                      )}
                      <p
                        className={`truncate text-sm ${
                          message.read ? "font-medium" : "font-semibold"
                        }`}
                      >
                        {message.subject}
                      </p>
                    </div>
                    <p className="mt-1 truncate text-xs text-ink-soft">
                      {message.name} · {message.email}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <p className="eyebrow text-ink-soft">
                      {formatDateTime(message.createdAt)}
                    </p>
                    <span className="eyebrow w-12 text-right text-ink-soft/70">
                      {message.read ? "Read" : "New"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-ink-soft transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}