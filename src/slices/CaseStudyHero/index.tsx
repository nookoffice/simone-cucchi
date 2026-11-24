"use client";

import { asText, type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { CONTACT_EMAIL } from "@/consts";
import CaseStudyProgress from "@/components/CaseStudyProgress";
import ResponsiveImage from "@/components/ResponsiveImage";
import RollText from "@/components/RollText";
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
    // Stagger the title and intro in one after another rather than together.
    const leadItems = Array.from(lead.children) as HTMLElement[];

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Arrived by scrolling out of the previous study: open already expanded.
    let skipHold = false;
    try {
      skipHold = sessionStorage.getItem("cs-skip-hold") === "1";
      if (skipHold) sessionStorage.removeItem("cs-skip-hold");
    } catch {
      /* ignore */
    }

    // The card is a sized box: state 2 is a ~73% centred card (CSS default), full
    // is edge-to-edge. The work-card view transition morphs into state 2.
    const FULL = { top: "0%", left: "0%", width: "100%", height: "100%", borderRadius: 0 };
    const STATE2 = { top: "13.3%", left: "13.3%", width: "73.3%", height: "73.3%", borderRadius: 20 };

    if (reduce) {
      gsap.set(card, FULL);
      gsap.set(center, { autoAlpha: 0 });
      gsap.set(lead, { autoAlpha: 1 });
      gsap.set(leadItems, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set(lead, { autoAlpha: 1 });
    gsap.set(leadItems, { autoAlpha: 0, y: 24 });

    // Arrived by scrolling out of the previous study: open already full-bleed.
    if (skipHold) {
      gsap.set(card, FULL);
      gsap.set(center, { autoAlpha: 0 });
      gsap.to(leadItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.16,
        delay: 0.15,
      });
      return;
    }

    // Arrived by clicking a work card: the view transition morphs that card into
    // the state-2 card first, so hold a beat longer before the caption + expand.
    let fromWork = false;
    try {
      fromWork = sessionStorage.getItem("cs-morph") === "1";
      if (fromWork) sessionStorage.removeItem("cs-morph");
    } catch {
      /* ignore */
    }
    const capIn = fromWork ? 1 : 0.35;
    // Let the title fade fully in, hold it clearly readable for ~1s, THEN expand
    // — so the caption doesn't flash up and vanish.
    const capInDuration = 0.5;
    const hold = 1.05;
    const expandAt = capIn + capInDuration + hold;

    // State 2 holds (title + discipline centred on the card), then the card
    // expands to full-bleed as the caption fades out and the lead comes in.
    gsap.set(card, STATE2);
    gsap.set(center, { autoAlpha: 0 });

    const tl = gsap.timeline();
    tl.to(center, { autoAlpha: 1, duration: capInDuration, ease: "power2.out" }, capIn);
    tl.to(card, { ...FULL, duration: 1.2, ease: "power3.inOut" }, expandAt);
    tl.to(center, { autoAlpha: 0, duration: 0.5 }, "<");
    tl.to(
      leadItems,
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.16 },
      "-=0.6",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <header className="csh_hero" ref={rootRef}>
      <noscript>
        <style>{`.csh_card{top:0!important;left:0!important;width:100%!important;height:100%!important;border-radius:0!important}.csh_lead{opacity:1!important}.csh_card_center{display:none!important}`}</style>
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
            <span className="csh_label"><RollText text="Back" /></span>
          </PrismicNextLink>
          <nav className="csh_topnav" aria-label="Sections">
            <PrismicNextLink className="csh_label nav-underline" href="/work"><RollText text="Work" /></PrismicNextLink>
            <PrismicNextLink className="csh_label nav-underline" href="/about"><RollText text="About" /></PrismicNextLink>
            <a className="csh_label nav-underline" href={`mailto:${CONTACT_EMAIL}`}><RollText text="Contact" /></a>
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

      {/* Decorative minus on the left edge, mirroring the right-edge progress. */}
      <span className="csh_minus" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M0 22H44" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>

      {/* Fixed per-section scroll-position indicator (right edge). */}
      <CaseStudyProgress />
    </header>
  );
}
