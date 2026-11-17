"use client";

import { asText, type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { CONTACT_EMAIL } from "@/consts";
import ResponsiveImage from "@/components/ResponsiveImage";
import VolumeToggle from "@/components/VolumeToggle";
import "./index.css";

export type CaseStudyHeroProps = SliceComponentProps<Content.CaseStudyHeroSlice>;

/**
 * Case study opener. On arrival the image holds as an inset card (title +
 * discipline centred), waits ~1s, then expands to full-bleed as the hero copy
 * fades in — the second half of the grow that begins on the work page.
 */
export default function CaseStudyHero({ slice }: CaseStudyHeroProps) {
  const { title, discipline, intro, image, image_mobile } = slice.primary;
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>(".csh_card");
    const center = root.querySelector<HTMLElement>(".csh_card_center");
    const lead = root.querySelector<HTMLElement>(".csh_lead");
    if (!card || !center || !lead) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Arrived by scrolling out of the previous study: open already expanded.
    let skipHold = false;
    try {
      skipHold = sessionStorage.getItem("cs-skip-hold") === "1";
      if (skipHold) sessionStorage.removeItem("cs-skip-hold");
    } catch {
      /* ignore */
    }

    if (reduce || skipHold) {
      gsap.set(card, { clipPath: "inset(0% round 0px)" });
      gsap.set(center, { autoAlpha: 0 });
      if (reduce) {
        gsap.set(lead, { autoAlpha: 1, y: 0 });
      } else {
        gsap.fromTo(lead, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" });
      }
      return;
    }

    const tl = gsap.timeline();
    tl.set(card, { clipPath: "inset(13% 11% round 14px)" });
    tl.set(center, { autoAlpha: 1 });
    tl.set(lead, { autoAlpha: 0, y: 18 });
    // Hold on the card, then expand the image to full-bleed.
    tl.to(card, {
      clipPath: "inset(0% round 0px)",
      duration: 1.1,
      ease: "power3.inOut",
      delay: 1,
    });
    tl.to(center, { autoAlpha: 0, duration: 0.45 }, "<");
    tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <header className="csh_hero" ref={rootRef}>
      <noscript>
        <style>{`.csh_card{clip-path:none!important}.csh_lead{opacity:1!important}.csh_card_center{display:none!important}`}</style>
      </noscript>
      <div className="csh_card">
        <ResponsiveImage className="csh_img" desktop={image} mobile={image_mobile} />
        <div className="csh_tint" aria-hidden="true" />
        <div className="csh_card_center" aria-hidden="true">
          {isFilled.keyText(title) && <p className="csh_card_title">{title}</p>}
          {isFilled.keyText(discipline) && (
            <p className="csh_card_discipline">{discipline}</p>
          )}
        </div>
      </div>

      <div className="csh_frame">
        <div className="csh_row csh_row-top">
          <PrismicNextLink className="csh_back" href="/work">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="csh_label">Back</span>
          </PrismicNextLink>
          <nav className="csh_topnav" aria-label="Sections">
            <PrismicNextLink className="csh_label nav-underline" href="/work">Work</PrismicNextLink>
            <PrismicNextLink className="csh_label nav-underline" href="/about">About</PrismicNextLink>
            <a className="csh_label nav-underline" href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
          </nav>
          <p className="csh_label">51.5072° N, 0.1276° W</p>
        </div>

        <div className="csh_lead">
          {isFilled.keyText(title) && <h1 className="csh_title">{title}</h1>}
          {isFilled.richText(intro) && (
            <p className="csh_intro text-style-large">{asText(intro)}</p>
          )}
        </div>

        <div className="csh_row csh_row-bottom">
          <VolumeToggle className="csh_label" />
          <p className="csh_label">2011 - 2025 ©</p>
        </div>
      </div>
    </header>
  );
}
