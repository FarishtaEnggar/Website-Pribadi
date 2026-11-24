"use client";

import { useTheme } from "@/components/theme-shell";
import { nextTheme } from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function ThemeToggle({
  variant = "icon",
  className = "",
}: {
  variant?: "icon" | "row";
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const target = nextTheme(theme);
  const label = `Switch to ${target} mode`;
  const Icon = target === "light" ? SunIcon : MoonIcon;

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-cobalt ${className}`}
      >
        <span className="flex items-center gap-2">
          <Icon />
          Theme
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
          {theme}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center border border-line text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt ${className}`}
    >
      <Icon />
    </button>
  );
}
