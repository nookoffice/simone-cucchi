"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import type { LenisOptions } from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const lenisOptions = {
  autoRaf: false,
  anchors: true,
  autoToggle: true,
  stopInertiaOnNavigate: true,
} satisfies LenisOptions;

function updateScrollTrigger() {
  ScrollTrigger.update();
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(time: number) {
      // GSAP's ticker reports seconds. Lenis wants milliseconds.
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    // One clock. Lag smoothing lets ScrollTrigger drift behind Lenis.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a");
      if (!link || link.target === "_blank") return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;

      // Read before Next resets the scroll. The outgoing snapshot uses this
      // to stay on the pixels that were on screen.
      root.style.setProperty("--page-scroll", `${window.scrollY}px`);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <ReactLenis root options={lenisOptions} ref={lenisRef}>
      <LenisScrollTrigger />
      {children}
    </ReactLenis>
  );
}

function LenisScrollTrigger() {
  const pathname = usePathname();
  const lenis = useLenis(updateScrollTrigger);

  useEffect(() => {
    if (!lenis) return;

    const frame = window.setTimeout(() => {
      lenis.resize();
      // Next has already moved the viewport. Adopt that position instead of easing back.
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      ScrollTrigger.refresh();
    }, 0);

    return () => window.clearTimeout(frame);
  }, [pathname, lenis]);

  return null;
}
