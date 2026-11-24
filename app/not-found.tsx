import Link from "next/link";
import { getTheme } from "@/lib/theme-server";

export default async function NotFound() {
  const theme = await getTheme("public");

  return (
    <div
      data-theme={theme}
      className="site-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
    >
      <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
      <div className="relative">
        <p className="eyebrow text-cobalt">404 — Not found</p>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,9vw,6rem)] font-medium leading-[0.94] tracking-[-0.045em]">
          Lost the thread.
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
          The page you are looking for has moved, been unpublished, or never
          existed in the first place.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-cobalt px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-accent transition-colors hover:bg-cobalt-deep"
          >
            Back home
          </Link>
          <Link
            href="/portfolio"
            className="border border-line px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-cobalt hover:text-cobalt"
          >
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
