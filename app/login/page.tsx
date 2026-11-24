import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { getTheme } from "@/lib/theme-server";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const userId = await getSessionUserId();
  if (userId) redirect("/admin");

  const [profile, theme] = await Promise.all([
    getProfile(),
    getTheme("admin"),
  ]);

  return (
    <div data-theme={theme} className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-cobalt p-12 text-on-accent lg:flex xl:p-16">
        <Link
          href="/"
          className="eyebrow inline-flex items-center gap-2 text-on-accent/80 transition-colors hover:text-on-accent"
        >
          <span aria-hidden="true">←</span>
          Back to website
        </Link>

        <div>
          <p className="eyebrow text-on-accent/60">Private area</p>
          <p className="mt-6 max-w-md font-serif text-5xl leading-[1.02] xl:text-6xl">
            The quiet room behind the{" "}
            <span className="italic text-on-accent/80">website</span>.
          </p>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-on-accent/70">
            Manage your profile, certifications, projects, and the messages
            visitors leave for you.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-on-accent/20 pt-6">
          <span className="eyebrow text-on-accent/70">{profile.name}</span>
          <span className="eyebrow text-on-accent/50">Admin console</span>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper px-6 py-16 text-ink sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="eyebrow inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-cobalt lg:hidden"
          >
            <span aria-hidden="true">←</span>
            Back to website
          </Link>

          <p className="eyebrow mt-10 text-cobalt lg:mt-0">Sign in</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight">
            Admin access
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Enter your credentials to manage the website.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
