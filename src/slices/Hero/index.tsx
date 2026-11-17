"use client";

import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CONTACT_EMAIL } from "@/consts";
import HeroObject from "@/components/HeroObject";
import VolumeToggle from "@/components/VolumeToggle";
import "./index.css";

/** Props for `Hero`. */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/** Fixed brand marks in the hero frame. Promote to fields if they ever vary. */
const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
];
const COORDINATES = "51.5072° N, 0.1276° W";
const COPYRIGHT = "2011 - 2025 ©";
const PRELOAD_KEY = "sc-preloaded";
// Roughly the preloader flicker's length (HeroObject SEQUENCE) plus a beat.
const FLICKER_MS = 1150;

/**
 * Full-viewport homepage hero. The central object flickers through the logo's
 * materials as a preloader; once it settles, the framing marks rise up out of
 * their masks (GSAP). After the first visit they just appear.
 */
export default function Hero({ slice }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const masks = root.querySelectorAll<HTMLElement>(".hero_mask");
    // Open the masks once revealed so hover underlines (just below the text)
    // aren't clipped.
    const openMasks = () => {
      for (const m of masks) m.style.overflow = "visible";
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let preloaded = false;
    try {
      preloaded = sessionStorage.getItem(PRELOAD_KEY) === "1";
    } catch {
      /* ignore */
    }

    // Return visits / reduced motion: just show the marks.
    if (reduce || preloaded) {
      root.classList.add("is-shown");
      openMasks();
      return;
    }

    // First visit: a CSS keyframe reveal plays (held through the flicker, then
    // the marks rise out of their masks); open the masks once it's done.
    root.classList.add("is-ready");
    const timer = setTimeout(openMasks, FLICKER_MS + 1150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero_wrap"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <noscript>
        <style>{`.hero_rise{transform:none!important}`}</style>
      </noscript>
      {/* Centred object: flickers through the logo's materials, then settles. */}
      <HeroObject alt="Simone Cucchi monogram" />

      <div className="hero_frame">
        <div className="hero_row hero_row-top">
          <span className="hero_mask">
            <span className="hero_rise">
              <span className="hero_dot" aria-hidden="true">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
            </span>
          </span>
          <span className="hero_mask">
            <span className="hero_rise">
              <span className="hero_label">{COORDINATES}</span>
            </span>
          </span>
        </div>

        <div className="hero_row hero_row-mid">
          <span className="hero_mask">
            <span className="hero_rise">
              <nav className="hero_nav" aria-label="Primary">
                <Link className="hero_label hero_name" href="/">
                  Simone Cucchi
                </Link>
                <ul className="hero_nav_list">
                  {NAV_LINKS.map((item) =>
                    item.href.startsWith("/") ? (
                      <li key={item.label}>
                        <Link className="hero_label hero_link nav-underline" href={item.href}>
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <a className="hero_label hero_link nav-underline" href={item.href}>
                          {item.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </span>
          </span>
          <span className="hero_mask">
            <span className="hero_rise">
              <Link className="hero_plus" href="/work" aria-label="Work">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                  <path d="M22 0V44M0 22H44" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Link>
            </span>
          </span>
        </div>

        <div className="hero_row hero_row-bottom">
          <span className="hero_mask">
            <span className="hero_rise">
              <VolumeToggle className="hero_label" />
            </span>
          </span>
          <span className="hero_mask">
            <span className="hero_rise">
              <span className="hero_label">{COPYRIGHT}</span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
