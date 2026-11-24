"use server";

import { requireSession } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

export async function uploadImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  const result = await saveUploadedImage(file);
  return "error" in result ? { error: result.error } : { url: result.url };
}
