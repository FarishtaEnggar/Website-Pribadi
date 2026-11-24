import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message) notFound();

  if (!message.read) {
    await prisma.message.update({ where: { id }, data: { read: true } });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-10 md:py-12">
      <Link
        href="/admin/messages"
        className="eyebrow inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-cobalt"
      >
        <span aria-hidden="true">←</span>
        Messages
      </Link>

      <header className="mt-6">
        <p className="eyebrow text-cobalt">Message</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
          {message.subject}
        </h1>
      </header>

      <dl className="mt-8 border-t border-line">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-3">
          <dt className="eyebrow text-ink-soft">From</dt>
          <dd className="text-sm font-medium">
            {message.name}{" "}
            <a
              href={`mailto:${message.email}`}
              className="font-normal text-ink-soft underline-offset-4 hover:text-cobalt hover:underline"
            >
              &lt;{message.email}&gt;
            </a>
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-3">
          <dt className="eyebrow text-ink-soft">Received</dt>
          <dd className="text-sm">{formatDateTime(message.createdAt)}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-3">
          <dt className="eyebrow text-ink-soft">Status</dt>
          <dd className="text-sm">Read</dd>
        </div>
      </dl>

      <div className="mt-8 border border-line bg-paper p-6 md:p-8">
        <p className="whitespace-pre-line text-base leading-relaxed text-ink">
          {message.message}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-line pt-6">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(
            `Re: ${message.subject}`,
          )}`}
          className="inline-flex items-center gap-2 bg-cobalt px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep"
        >
          Reply by email
          <span aria-hidden="true">↗</span>
        </a>

        <form action={setMessageRead}>
          <input type="hidden" name="id" value={message.id} />
          <input type="hidden" name="read" value="false" />
          <button
            type="submit"
            className="text-sm font-semibold text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Mark as unread
          </button>
        </form>

        <DeleteButton
          action={deleteMessage}
          id={message.id}
          confirmMessage="Delete this message? This cannot be undone."
        />
      </div>
    </div>
  );
}