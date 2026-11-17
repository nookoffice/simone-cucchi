"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals `[data-reveal]` elements as they scroll into view. Adds a
 * `reveal-ready` flag to <html> so the hidden state only applies once JS is
 * running — without it, content shows normally. Re-scans on navigation.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("reveal-ready");

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    // Reduced motion (or no IntersectionObserver): reveal everything at once.
    if (reduce || typeof IntersectionObserver === "undefined") {
      for (const el of targets) el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    for (const el of targets) {
      if (el.classList.contains("is-revealed")) continue;
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
