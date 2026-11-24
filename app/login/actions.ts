"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { FormState } from "@/lib/types";

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Please enter your email and password.",
      values: { email },
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const validPassword = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !validPassword) {
    return {
      error: "Those credentials do not match our records.",
      values: { email },
    };
  }

  await createSession(user.id);
  redirect("/admin");
}
