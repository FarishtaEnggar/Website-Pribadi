"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import type { Project } from "@prisma/client";
import {
  checkboxRowClass,
  errorBannerClass,
  inputClass,
  labelClass,
} from "@/components/form-styles";
import { useRestoreFormValues } from "@/components/use-restore-form-values";
import { ImageField } from "@/components/admin/image-field";
import type { FormState } from "@/lib/types";

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: Project | null;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormValues(formRef, state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-6" noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}

      {state.error && (
        <p role="alert" className={errorBannerClass}>
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass}>
            Project title *
          </label>
          <input
            id="title"
            name="title"
            defaultValue={values.title ?? project?.title ?? ""}
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Ledger"
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={values.slug ?? project?.slug ?? ""}
            className={`mt-2 ${inputClass}`}
            placeholder="ledger"
          />
          <p className="mt-1.5 text-xs text-ink-soft">
            Leave empty to generate it from the title.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="shortDescription" className={labelClass}>
            Short description *
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            defaultValue={values.shortDescription ?? project?.shortDescription ?? ""}
            required
            className={`mt-2 resize-y ${inputClass}`}
            placeholder="One or two sentences that appear on cards."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Full description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={10}
            defaultValue={values.description ?? project?.description ?? ""}
            required
            className={`mt-2 resize-y ${inputClass}`}
            placeholder="The story behind the project. Leave a blank line between paragraphs."
          />
        </div>

        <div className="sm:col-span-2">
          <ImageField
            name="imageUrl"
            label="Cover image *"
            initialValue={project?.imageUrl ?? ""}
            restoreValue={state.values?.imageUrl}
            help="Upload a JPG, PNG, WebP, GIF or AVIF up to 6 MB. A path like /images/project-1.svg also works."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="technologies" className={labelClass}>
            Technologies
          </label>
          <input
            id="technologies"
            name="technologies"
            defaultValue={values.technologies ?? project?.technologies ?? ""}
            className={`mt-2 ${inputClass}`}
            placeholder="Next.js, TypeScript, PostgreSQL"
          />
          <p className="mt-1.5 text-xs text-ink-soft">
            Separate each technology with a comma.
          </p>
        </div>

        <div>
          <label htmlFor="year" className={labelClass}>
            Year *
          </label>
          <input
            id="year"
            name="year"
            defaultValue={
              values.year ?? project?.year ?? String(new Date().getFullYear())
            }
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label htmlFor="role" className={labelClass}>
            Role *
          </label>
          <input
            id="role"
            name="role"
            defaultValue={values.role ?? project?.role ?? ""}
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Design & Development"
          />
        </div>

        <div>
          <label htmlFor="liveUrl" className={labelClass}>
            Live URL
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            type="url"
            defaultValue={values.liveUrl ?? project?.liveUrl ?? ""}
            className={`mt-2 ${inputClass}`}
            placeholder="https://…"
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className={labelClass}>
            Source URL
          </label>
          <input
            id="githubUrl"
            name="githubUrl"
            type="url"
            defaultValue={values.githubUrl ?? project?.githubUrl ?? ""}
            className={`mt-2 ${inputClass}`}
            placeholder="https://github.com/…"
          />
        </div>

        <div>
          <label htmlFor="displayOrder" className={labelClass}>
            Display order
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min={0}
            defaultValue={values.displayOrder ?? project?.displayOrder ?? 0}
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div className="flex flex-col justify-end gap-2">
          <label className={checkboxRowClass}>
            <input
              type="checkbox"
              name="featured"
              defaultChecked={
                values.featured !== undefined
                  ? values.featured === "on"
                  : (project?.featured ?? false)
              }
              className="h-4 w-4 accent-cobalt"
            />
            <span className="text-sm">Featured on the homepage</span>
          </label>
          <label className={checkboxRowClass}>
            <input
              type="checkbox"
              name="published"
              defaultChecked={
                values.published !== undefined
                  ? values.published === "on"
                  : (project?.published ?? true)
              }
              className="h-4 w-4 accent-cobalt"
            />
            <span className="text-sm">Published</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-3 bg-cobalt px-6 py-3.5 text-sm font-semibold text-on-accent transition-colors hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/portfolio"
          className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
