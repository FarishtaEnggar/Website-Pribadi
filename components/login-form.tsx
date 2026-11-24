"use client";

import { useActionState, useRef } from "react";
import { loginAction } from "@/app/login/actions";
import { errorBannerClass, inputClass, labelClass } from "@/components/form-styles";
import { useRestoreFormValues } from "@/components/use-restore-form-values";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  useRestoreFormValues(formRef, state.values);

  return (
    <form ref={formRef} action={formAction} className="mt-8 space-y-5" noValidate>
      {state.error && (
        <p role="alert" className={errorBannerClass}>
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={`mt-2 ${inputClass}`}
          placeholder="you@example.com"
          defaultValue={state.values?.email ?? ""}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`mt-2 ${inputClass}`}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-between gap-3 bg-cobalt px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{pending ? "Signing in…" : "Sign in"}</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </form>
  );
}
