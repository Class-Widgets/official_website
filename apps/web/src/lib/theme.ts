import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cw-theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // Private mode or blocked storage.
  }
  return null;
}

export function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function getResolvedTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage.
  }
  applyTheme(theme);
}

export function subscribeSystemTheme(onChange: (theme: Theme) => void) {
  const media = window.matchMedia(DARK_QUERY);
  const sync = () => {
    onChange(media.matches ? "dark" : "light");
  };
  media.addEventListener("change", sync);
  return () => media.removeEventListener("change", sync);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getResolvedTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    return subscribeSystemTheme((next) => {
      if (getStoredTheme()) return;
      setThemeState(next);
    });
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    persistTheme(next);
    setThemeState(next);
  };

  return { isDark, theme, toggleTheme };
}
