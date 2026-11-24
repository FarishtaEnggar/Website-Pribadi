import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
      <p className="eyebrow text-cobalt">404 — Not found</p>
      <h1 className="mt-6 font-serif text-[clamp(3rem,10vw,7rem)] leading-none">
        Lost the thread.
      </h1>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
        The page you are looking for has moved, been unpublished, or never
        existed in the first place.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-cobalt px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep"
        >
          Back home
        </Link>
        <Link
          href="/portfolio"
          className="border border-ink/25 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
        >
          Browse projects
        </Link>
      </div>
    </div>
  );
}