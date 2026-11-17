"use client";

import { useEffect, useRef, useState } from "react";

/** Logo materials, in the order the preloader flickers through them. */
const SRC = (v: string) => `/hero/logo-${v}.png`;
const VERSIONS = ["furry", "chrome", "glass"] as const;
const PRELOAD_KEY = "sc-preloaded";
// Frames shown on first load, easing from a fast flicker to a settle on glass.
const SEQUENCE: { v: (typeof VERSIONS)[number]; ms: number }[] = [
  { v: "furry", ms: 70 },
  { v: "chrome", ms: 70 },
  { v: "glass", ms: 80 },
  { v: "furry", ms: 95 },
  { v: "chrome", ms: 120 },
  { v: "glass", ms: 150 },
  { v: "chrome", ms: 190 },
  { v: "glass", ms: 240 },
];

/**
 * The hero's central object. On the first visit of a session it flickers
 * through the logo's materials (furry → chrome → glass) as a preloader, then
 * settles on glass. After that it just shows glass. Either way it tilts toward
 * the cursor in 3D so the flat render reads as a dimensional object.
 */
export default function HeroObject({ alt }: { alt: string }) {
  const [version, setVersion] = useState<(typeof VERSIONS)[number]>("glass");
  const ref = useRef<HTMLDivElement>(null);

  // Preloader flicker (once per session, skipped for reduced motion).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let done = false;
    try {
      done = sessionStorage.getItem(PRELOAD_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (reduce || done) return;

    // Warm the cache so the swaps are instant.
    for (const v of VERSIONS) {
      const img = new Image();
      img.src = SRC(v);
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setVersion(SEQUENCE[i].v);
      i += 1;
      if (i < SEQUENCE.length) {
        timer = setTimeout(tick, SEQUENCE[i - 1].ms);
      } else {
        setVersion("glass");
        try {
          sessionStorage.setItem(PRELOAD_KEY, "1");
        } catch {
          /* ignore */
        }
      }
    };
    timer = setTimeout(tick, SEQUENCE[0].ms);
    return () => clearTimeout(timer);
  }, []);

  // Cursor tilt. Centering stays on CSS `translate`; only the tilt is on
  // `transform`, so the two compose.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const MAX = 15;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const ox = r.left + r.width / 2;
      const oy = r.top + r.height / 2;
      targetY = ((e.clientX - ox) / window.innerWidth) * MAX * 2;
      targetX = ((e.clientY - oy) / window.innerHeight) * -MAX * 2;
    };
    const loop = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      el.style.transform = `rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero_object" ref={ref}>
      {/* biome-ignore lint/performance/noImgElement: material swapped rapidly during the preloader */}
      <img className="hero_object_media" src={SRC(version)} alt={alt} draggable={false} />
    </div>
  );
}
