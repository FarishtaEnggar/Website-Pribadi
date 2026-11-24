"use client";

import { useEffect, type RefObject } from "react";

/**
 * React 19 resets uncontrolled form fields after a server action runs.
 * When an action returns the submitted values (validation errors), write
 * them back into the form so the visitor does not lose their input.
 */
export function useRestoreFormValues(
  formRef: RefObject<HTMLFormElement | null>,
  values: Record<string, string> | undefined,
) {
  useEffect(() => {
    const form = formRef.current;
    if (!form || !values) return;

    for (const element of Array.from(form.elements)) {
      const name = element.getAttribute("name");
      if (!name) continue;

      if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox" || element.type === "radio") {
          element.checked = values[name] === "on";
        } else if (element.type !== "hidden" && element.type !== "password") {
          element.value = values[name] ?? "";
        }
        continue;
      }

      if (
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      ) {
        element.value = values[name] ?? "";
      }
    }
  }, [formRef, values]);
}
