import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  const [profile, unreadCount] = await Promise.all([
    getProfile(),
    prisma.message.count({ where: { read: false } }),
  ]);

  return (
    <div data-theme="light" className="min-h-screen bg-paper md:flex">
      <AdminNav name={profile.name} unreadCount={unreadCount} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
