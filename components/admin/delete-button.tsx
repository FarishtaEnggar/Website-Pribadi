"use client";

export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmMessage,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmMessage: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs font-semibold text-red-600 underline-offset-4 transition-colors hover:text-red-500 hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
