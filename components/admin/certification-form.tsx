"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import type { Certification } from "@prisma/client";
import {
  checkboxRowClass,
  errorBannerClass,
  inputClass,
  labelClass,
} from "@/components/form-styles";
import { useRestoreFormValues } from "@/components/use-restore-form-values";
import { ImageField } from "@/components/admin/image-field";
import { toDateInputValue } from "@/lib/format";
import type { FormState } from "@/lib/types";

export function CertificationForm({
  action,
  certification,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  certification?: Certification | null;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormValues(formRef, state.values);

  return (
    <form ref={formRef} action={formAction} className="space-y-6" noValidate>
      {certification && (
        <input type="hidden" name="id" value={certification.id} />
      )}

      {state.error && (
        <p role="alert" className={errorBannerClass}>
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Certification title *
          </label>
          <input
            id="title"
            name="title"
            defaultValue={values.title ?? certification?.title ?? ""}
            required
            className={`mt-2 ${inputClass}`}
            placeholder="AWS Certified Solutions Architect"
          />
        </div>

        <div>
          <label htmlFor="issuer" className={labelClass}>
            Issuing organization *
          </label>
          <input
            id="issuer"
            name="issuer"
            defaultValue={values.issuer ?? certification?.issuer ?? ""}
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Amazon Web Services"
          />
        </div>

        <div>
          <label htmlFor="credentialId" className={labelClass}>
            Credential ID
          </label>
          <input
            id="credentialId"
            name="credentialId"
            defaultValue={values.credentialId ?? certification?.credentialId ?? ""}
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label htmlFor="issueDate" className={labelClass}>
            Issue date *
          </label>
          <input
            id="issueDate"
            name="issueDate"
            type="date"
            defaultValue={
              values.issueDate ??
              toDateInputValue(certification?.issueDate ?? null)
            }
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label htmlFor="expirationDate" className={labelClass}>
            Expiration date
          </label>
          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
            defaultValue={
              values.expirationDate ??
              toDateInputValue(certification?.expirationDate ?? null)
            }
            className={`mt-2 ${inputClass}`}
          />
          <p className="mt-1.5 text-xs text-ink-soft">Leave empty if it never expires.</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="credentialUrl" className={labelClass}>
            Credential URL
          </label>
          <input
            id="credentialUrl"
            name="credentialUrl"
            type="url"
            defaultValue={values.credentialUrl ?? certification?.credentialUrl ?? ""}
            className={`mt-2 ${inputClass}`}
            placeholder="https://…"
          />
        </div>

        <div className="sm:col-span-2">
          <ImageField
            name="imageUrl"
            label="Logo or badge"
            initialValue={certification?.imageUrl ?? ""}
            restoreValue={values.imageUrl}
            aspect="aspect-square"
            help="Optional. Upload a square logo or badge, or leave empty."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={values.description ?? certification?.description ?? ""}
            required
            className={`mt-2 resize-y ${inputClass}`}
            placeholder="What this credential validates."
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
            defaultValue={values.displayOrder ?? certification?.displayOrder ?? 0}
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
                  : (certification?.featured ?? false)
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
                  : (certification?.published ?? true)
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
          className="inline-flex items-center gap-3 bg-cobalt px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/certifications"
          className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
