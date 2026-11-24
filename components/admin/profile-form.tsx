"use client";

import { useActionState, useRef } from "react";
import type { Profile } from "@prisma/client";
import { updateProfile } from "@/app/admin/actions";
import {
  errorBannerClass,
  inputClass,
  labelClass,
  successBannerClass,
} from "@/components/form-styles";
import { useRestoreFormValues } from "@/components/use-restore-form-values";
import { ImageField } from "@/components/admin/image-field";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormValues(formRef, state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-10" noValidate>
      {state.error && (
        <p role="alert" className={errorBannerClass}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className={successBannerClass}>
          {state.message ?? "Saved."}
        </p>
      )}

      <section>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Identity</h2>
            <p className="mt-1 text-sm text-ink-soft">
              How your name and role appear across the website.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name *
            </label>
            <input
              id="name"
              name="name"
              defaultValue={values.name ?? profile.name}
              required
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="title" className={labelClass}>
              Professional title *
            </label>
            <input
              id="title"
              name="title"
              defaultValue={values.title ?? profile.title}
              required
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageField
              name="photoUrl"
              label="Photo *"
              initialValue={profile.photoUrl}
              restoreValue={state.values?.photoUrl}
              aspect="aspect-[4/5]"
              help="Upload a JPG, PNG, WebP, GIF or AVIF up to 6 MB. You can also paste a path such as /images/profile.jpg or an external URL."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="font-serif text-2xl">Story</h2>
        <p className="mt-1 text-sm text-ink-soft">
          The short introduction appears in the hero; the biography appears in
          the About section.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="shortBio" className={labelClass}>
              Short introduction *
            </label>
            <textarea
              id="shortBio"
              name="shortBio"
              rows={3}
              defaultValue={values.shortBio ?? profile.shortBio}
              required
              maxLength={400}
              className={`mt-2 resize-y ${inputClass}`}
            />
            <p className="mt-1.5 text-xs text-ink-soft">
              Keep it under 400 characters. Leave a blank line between
              paragraphs in the biography.
            </p>
          </div>
          <div>
            <label htmlFor="biography" className={labelClass}>
              Biography *
            </label>
            <textarea
              id="biography"
              name="biography"
              rows={12}
              defaultValue={values.biography ?? profile.biography}
              required
              className={`mt-2 resize-y ${inputClass}`}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="font-serif text-2xl">Contact &amp; links</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Used on the contact page, footer, and contact band.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClass}>
              Location *
            </label>
            <input
              id="location"
              name="location"
              defaultValue={values.location ?? profile.location}
              required
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Public email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={values.email ?? profile.email}
              required
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="availability" className={labelClass}>
              Availability *
            </label>
            <input
              id="availability"
              name="availability"
              defaultValue={values.availability ?? profile.availability}
              required
              className={`mt-2 ${inputClass}`}
              placeholder="Open to select freelance work"
            />
          </div>
          <div>
            <label htmlFor="githubUrl" className={labelClass}>
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              defaultValue={values.githubUrl ?? profile.githubUrl ?? ""}
              className={`mt-2 ${inputClass}`}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className={labelClass}>
              LinkedIn URL
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              defaultValue={values.linkedinUrl ?? profile.linkedinUrl ?? ""}
              className={`mt-2 ${inputClass}`}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="instagramUrl" className={labelClass}>
              Instagram URL
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={values.instagramUrl ?? profile.instagramUrl ?? ""}
              className={`mt-2 ${inputClass}`}
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-3 bg-cobalt px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        <p className="text-xs text-ink-soft">
          Changes appear on the public website immediately.
        </p>
      </div>
    </form>
  );
}
