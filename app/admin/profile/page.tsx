import { getProfile } from "@/lib/data";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-10 md:py-12">
      <header>
        <p className="eyebrow text-cobalt">Admin</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          Profile
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
          This information drives the homepage, contact page, and footer.
        </p>
      </header>

      <div className="mt-10">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
