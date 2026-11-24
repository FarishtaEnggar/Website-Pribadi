export type FormState = {
  error?: string;
  success?: boolean;
  message?: string;
  values?: Record<string, string>;
};

export const emptyFormState: FormState = {};
