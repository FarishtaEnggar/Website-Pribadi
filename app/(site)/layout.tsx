import type { Metadata } from "next";
import { getProfile } from "@/lib/data";
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
  const profile = await getProfile();

  return (
    <div
      data-theme="dark"
      className="site-shell flex min-h-screen flex-col"
    >
      <SiteHeader name={profile.name} />
      <main className="flex-1">{children}</main>
      <SiteFooter profile={profile} />
    </div>
  );
}
