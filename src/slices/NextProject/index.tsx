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
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const distance = rect.height - vh; // scrollable travel while pinned
      const progress = clamp(-rect.top / Math.max(distance, 1), 0, 1);

      // Expand the card to full-bleed over the first ~75% of the travel.
      const e = clamp(progress / 0.75, 0, 1);
      media.style.clipPath = `inset(${lerp(12, 0, e)}% ${lerp(10, 0, e)}% round ${lerp(14, 0, e)}px)`;
      content.style.opacity = String(clamp(1 - e * 1.3, 0, 1));

      if (!navigated && href && progress >= 0.98) {
        navigated = true;
        try {
          sessionStorage.setItem(SKIP_HOLD_KEY, "1");
        } catch {
          /* ignore */
        }
        router.push(href);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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
