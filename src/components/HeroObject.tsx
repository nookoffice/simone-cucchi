"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's central object. It tilts in 3D toward the cursor (perspective
 * rotateX/Y, eased for a smooth, weighty feel) so the flat render reads as a
 * dimensional object. Centering stays on the CSS `translate`; only the tilt
 * lives on `transform`, so the two compose cleanly.
 */
export default function HeroObject({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const MAX = 15; // degrees
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
      <img className="hero_object_media" src={src} alt={alt} />
    </div>
  );
}
