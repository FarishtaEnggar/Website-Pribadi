"use client";

import { useActionState, useRef } from "react";
import { submitContactMessage } from "@/app/actions/contact";
import {
  errorBannerClass,
  inputClass,
  labelClass,
} from "@/components/form-styles";
import { useRestoreFormValues } from "@/components/use-restore-form-values";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    {},
  );
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormValues(formRef, state.values);

  if (state.success) {
    return (
      <div className="border border-line bg-paper p-8 md:p-10">
        <p className="eyebrow text-cobalt">Message received</p>
        <h2 className="mt-4 font-serif text-3xl leading-tight">
          Thank you for reaching out.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Your message is in my inbox. I usually reply within a couple of
          business days.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 border border-ink/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {state.error && (
        <p role="alert" className={errorBannerClass}>
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Jane Cooper"
            defaultValue={values.name ?? ""}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`mt-2 ${inputClass}`}
            placeholder="jane@studio.com"
            defaultValue={values.email ?? ""}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className={`mt-2 ${inputClass}`}
          placeholder="A project, a question, a hello"
          defaultValue={values.subject ?? ""}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={`mt-2 resize-y ${inputClass}`}
          placeholder="Tell me a little about what you have in mind."
          defaultValue={values.message ?? ""}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-between gap-3 bg-cobalt px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{pending ? "Sending…" : "Send message"}</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      <p className="text-xs leading-relaxed text-ink-soft">
        Your message is stored securely and never shared.
      </p>
    </form>
  );
}
