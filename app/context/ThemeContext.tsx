"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolved: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "shopsphere-theme";

function getStored(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getResolved(theme: Theme): "light" | "dark" {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  useEffect(() => {
    const stored = getStored();
    setThemeState(stored);
    setResolved(getResolved(stored));
  }, []);

  useEffect(() => {
    const r = getResolved(theme);
    setResolved(r);
    document.documentElement.setAttribute("data-theme", r);
    document.documentElement.classList.toggle("dark", r === "dark");
    document.documentElement.classList.toggle("light", r === "light");
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const r = getResolved("system");
        setResolved(r);
        document.documentElement.setAttribute("data-theme", r);
        document.documentElement.classList.toggle("dark", r === "dark");
        document.documentElement.classList.toggle("light", r === "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: "system" as Theme, setTheme: () => {}, resolved: "dark" as const };
  return ctx;
}
