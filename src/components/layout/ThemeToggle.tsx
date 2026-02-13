"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || (stored === null && getSystemDark());
    setDark(isDark);
    applyTheme(isDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) {
    // Render placeholder to prevent layout shift
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
