"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import type { FormState } from "@/lib/types";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email address."),
  subject: z.string().trim().min(3, "Please add a subject.").max(140),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(4000, "Please keep the message under 4000 characters."),
});

export async function submitContactMessage(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const values: Record<string, string> = {};
    for (const key of ["name", "email", "subject", "message"]) {
      const value = formData.get(key);
      if (typeof value === "string") values[key] = value;
    }
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please check the form and try again.",
      values,
    };
  }

  try {
    await prisma.message.create({ data: parsed.data });
  } catch {
    return {
      error: "Something went wrong while sending your message. Please try again.",
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    };
  }

  return { success: true };
}
