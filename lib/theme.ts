export type Theme = "light" | "dark";
export type ThemeScope = "public" | "admin";

export const THEME_COOKIE: Record<ThemeScope, string> = {
  public: "public_theme",
  admin: "admin_theme",
};

export const DEFAULT_THEME: Record<ThemeScope, Theme> = {
  public: "dark",
  admin: "light",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function parseTheme(value: string | undefined, scope: ThemeScope): Theme {
  return isTheme(value) ? value : DEFAULT_THEME[scope];
}

export function nextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}
