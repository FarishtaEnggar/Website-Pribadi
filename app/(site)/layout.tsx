import type { Metadata } from "next";
import { getProfile } from "@/lib/data";
import { getTheme } from "@/lib/theme-server";
import { ThemeShell } from "@/components/theme-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: {
      default: `${profile.name} — ${profile.title}`,
      template: `%s · ${profile.name}`,
    },
    description: profile.shortBio,
    openGraph: {
      title: `${profile.name} — ${profile.title}`,
      description: profile.shortBio,
      images: profile.photoUrl ? [profile.photoUrl] : undefined,
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, theme] = await Promise.all([
    getProfile(),
    getTheme("public"),
  ]);

  return (
    <ThemeShell
      scope="public"
      initialTheme={theme}
      className="site-shell flex min-h-screen flex-col"
    >
      <SiteHeader name={profile.name} />
      <main className="flex-1">{children}</main>
      <SiteFooter profile={profile} />
    </ThemeShell>
  );
}
