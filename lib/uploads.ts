import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/** Uploaded files live outside `public/` so they also work after a production build. */
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MAX_BYTES = 6 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export const EXTENSION_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function saveUploadedImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const extension = MIME_EXTENSIONS[file.type];
  if (!extension) {
    return { error: "Please choose a JPG, PNG, WebP, GIF or AVIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Images must be smaller than 6 MB." };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  return { url: `/media/${filename}` };
}
