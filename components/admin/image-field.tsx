"use client";

import { useEffect, useRef, useState } from "react";
import { uploadImage } from "@/app/admin/upload";
import { inputClass, labelClass } from "@/components/form-styles";

export function ImageField({
  name,
  label,
  initialValue,
  restoreValue,
  help,
  aspect = "aspect-[16/10]",
}: {
  name: string;
  label: string;
  initialValue: string;
  restoreValue?: string;
  help?: string;
  aspect?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (restoreValue === undefined) return;
    setValue(restoreValue);
    setPreview(restoreValue);
  }, [restoreValue]);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setError(null);
    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    const result = await uploadImage(data);
    setUploading(false);

    if (result.error || !result.url) {
      setError(result.error ?? "Upload failed. Please try again.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setValue(result.url);
    setPreview(result.url);
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row">
        <div
          className={`relative w-full max-w-48 shrink-0 overflow-hidden border border-line bg-paper-soft ${aspect}`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="eyebrow flex h-full items-center justify-center text-ink-soft/60">
              No image
            </span>
          )}

          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-paper/85 text-xs font-semibold">
              Uploading…
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            disabled={uploading}
            onChange={(event) => handleFile(event.target.files?.[0])}
            className="block w-full text-sm text-ink-soft file:mr-3 file:cursor-pointer file:border-0 file:bg-ink file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-paper hover:file:bg-cobalt disabled:cursor-not-allowed disabled:opacity-60"
          />

          <input type="hidden" name={name} value={value} />

          <input
            type="text"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setPreview(event.target.value);
            }}
            placeholder="/images/photo.jpg or https://…"
            aria-label={`${label} path or URL`}
            className={inputClass}
          />

          {error && <p className="text-xs text-red-600">{error}</p>}
          {help && <p className="text-xs text-ink-soft">{help}</p>}
        </div>
      </div>
    </div>
  );
}
