import "server-only";

import { cookies } from "next/headers";
import { THEME_COOKIE, parseTheme, type Theme, type ThemeScope } from "@/lib/theme";

export async function getTheme(scope: ThemeScope): Promise<Theme> {
  const store = await cookies();
  return parseTheme(store.get(THEME_COOKIE[scope])?.value, scope);
}
