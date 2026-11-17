"use client";

import { useLayoutEffect } from "react";

const THEMES = ["theme-light", "theme-dark", "theme-brand"] as const;

function siteThemeClass() {
  const value = document.documentElement.dataset.siteTheme;
  if (value === "light" || value === "dark" || value === "brand") return `theme-${value}` as const;
  return "theme-light" as const;
}

/** Mirrors the page theme onto `<html>` so the canvas and overscroll match. `inherit` keeps the site theme. */
export default function ThemeLock({ theme }: { theme: "inherit" | "light" | "dark" | "brand" }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const site = siteThemeClass();
    root.classList.remove(...THEMES);
    root.classList.add(theme === "inherit" ? site : `theme-${theme}`);
    return () => {
      root.classList.remove(...THEMES);
      root.classList.add(site);
    };
  }, [theme]);

  return null;
}
