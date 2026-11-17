"use client";

import { asLink, type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ResponsiveImage from "@/components/ResponsiveImage";
import "./index.css";

export type NextProjectProps = SliceComponentProps<Content.NextProjectSlice>;

/** Session flag: the next hero should open already-expanded, not replay the hold. */
export const SKIP_HOLD_KEY = "cs-skip-hold";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Closing "next case study" card. As it scrolls up it expands from an inset
 * card to full-bleed, and once filled it loads the next study — so the two
 * read as one continuous scroll.
 */
export default function NextProject({ slice }: NextProjectProps) {
  const { title, subtitle, image, image_mobile, link } = slice.primary;
  const wrapRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const href = isFilled.link(link) ? (asLink(link) ?? undefined) : undefined;

  useEffect(() => {
    const wrap = wrapRef.current;
    const media = mediaRef.current;
    const content = contentRef.current;
    if (!wrap || !media || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let navigated = false;
    let smoothed = 0;
    let raf = 0;

    // A continuous loop that eases the expansion toward the scroll position —
    // decoupled from scroll-event cadence, so it stays smooth under Lenis.
    const loop = () => {
      const rect = wrap.getBoundingClientRect();
      const distance = Math.max(rect.height - window.innerHeight, 1);
      const target = clamp(-rect.top / distance, 0, 1);
      smoothed += (target - smoothed) * 0.12;
      if (Math.abs(target - smoothed) < 0.0004) smoothed = target;

      if (target > 0.0005 || smoothed > 0.0005) {
        // Expand the card to full-bleed over the first ~72% of the travel.
        const e = clamp(smoothed / 0.72, 0, 1);
        media.style.clipPath = `inset(${lerp(12, 0, e).toFixed(2)}% ${lerp(10, 0, e).toFixed(2)}% round ${lerp(14, 0, e).toFixed(2)}px)`;
        content.style.opacity = String(clamp(1 - e * 1.35, 0, 1));
      }

      if (!navigated && href && target >= 0.99) {
        navigated = true;
        try {
          sessionStorage.setItem(SKIP_HOLD_KEY, "1");
        } catch {
          /* ignore */
        }
        router.push(href);
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [href, router]);

  return (
    <div className="csn_wrap" ref={wrapRef}>
      <div className="csn_sticky">
        <PrismicNextLink field={link} className="csn_card" aria-label={title ?? undefined}>
          <div className="csn_media" ref={mediaRef}>
            <ResponsiveImage className="csn_img" desktop={image} mobile={image_mobile} />
            <div className="csn_tint" aria-hidden="true" />
          </div>
          <div className="csn_content" ref={contentRef}>
            {isFilled.keyText(title) && <span className="csn_title">{title}</span>}
            {isFilled.keyText(subtitle) && <span className="csn_sub">{subtitle}</span>}
          </div>
        </PrismicNextLink>
      </div>
    </div>
  );
}
