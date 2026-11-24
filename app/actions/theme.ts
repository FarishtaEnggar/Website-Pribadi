"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE, isTheme, type Theme, type ThemeScope } from "@/lib/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function saveTheme(scope: ThemeScope, theme: Theme) {
  if (scope !== "public" && scope !== "admin") return;
  if (!isTheme(theme)) return;

  (await cookies()).set(THEME_COOKIE[scope], theme, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
