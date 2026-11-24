"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { saveTheme } from "@/app/actions/theme";
import { nextTheme, type Theme, type ThemeScope } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  scope: ThemeScope;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeShell({
  scope,
  initialTheme,
  className,
  children,
}: {
  scope: ThemeScope;
  initialTheme: Theme;
  className?: string;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [, startTransition] = useTransition();

  const setTheme = useCallback(
    (value: Theme) => {
      setThemeState(value);
      startTransition(() => {
        void saveTheme(scope, value);
      });
    },
    [scope],
  );

  const toggleTheme = useCallback(() => {
    setTheme(nextTheme(theme));
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, scope, setTheme, toggleTheme }),
    [theme, scope, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} className={className}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeShell");
  }
  return context;
}
