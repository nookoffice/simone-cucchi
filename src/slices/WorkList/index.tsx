"use client";

import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Layout effect on the client (so the hidden start state applies before paint,
// avoiding a flash), plain effect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { CONTACT_EMAIL } from "@/consts";
import LogoMark from "@/components/LogoMark";
import RollText from "@/components/RollText";
import VolumeToggle from "@/components/VolumeToggle";
import "./index.css";

export type WorkListProps = SliceComponentProps<Content.WorkListSlice>;

/** Maps a project title to its Figma flood slug; undefined uses the accent default. */
function floodSlug(title?: string | null): string | undefined {
  if (!title) return undefined;
  if (/3\.0/.test(title)) return "christies-3-0";
  if (/burberry/i.test(title)) return "burberry";
  if (/christie/i.test(title)) return "christies-app";
  return undefined;
}

/**
 * Work index: a stack of glass blocks. Hovering one floods the page with that
 * project's brand colour, opens the block to reveal its teaser image, shows the
 * title and switches the frame to light. Projects are editable in Prismic.
 */
export default function WorkList({ slice }: WorkListProps) {
  const projects = slice.primary.projects;
  const [active, setActive] = useState<number | null>(null);
  // The title that's actually on screen lags `active`: whatever is showing has
  // to drop out of its mask before the next one is swapped in and rises up.
  const [displayed, setDisplayed] = useState<string | null>(null);
  const activeProject = active !== null ? projects[active] : null;
  const listRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  // A tiny state machine so rapid hovers (the cursor sweeping past blocks) can't
  // desync the exit→enter: `target` always holds the latest wanted title, `busy`
  // guards a run in progress, and `shown` mirrors `displayed` without stale closures.
  const targetRef = useRef<string | null>(null);
  const shownRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  // Drop the current title out, then (via the displayed effect) rise the next in.
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs drive this, not render state
  const runExit = useCallback(() => {
    if (busyRef.current) return;
    const next = targetRef.current;
    if (next === shownRef.current) return;
    const el = titleRef.current;
    if (!el) {
      setDisplayed(next);
      return;
    }
    busyRef.current = true;
    const chars = el.querySelectorAll(".work_title_rise");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shownRef.current && chars.length && !reduce) {
      gsap.to(chars, {
        yPercent: 105,
        duration: 0.42,
        ease: "power2.in",
        stagger: 0.016,
        onComplete: () => setDisplayed(targetRef.current),
      });
    } else {
      // Nothing showing (or reduced motion) — skip the exit and go straight in.
      setDisplayed(targetRef.current);
    }
  }, []);

  // Whenever the hovered project changes, record the new target and kick the
  // machine; if it's mid-animation the running pass will pick the target up.
  useEffect(() => {
    targetRef.current = activeProject?.title ?? null;
    runExit();
  }, [activeProject?.title, runExit]);

  // The freshly-swapped title is pushed below its mask (pre-paint, so no flash),
  // then its letters rise up; on completion we release `busy` and re-check the
  // target, so a title queued during the animation plays next.
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs drive this, not render state
  useIsomorphicLayoutEffect(() => {
    shownRef.current = displayed;
    const el = titleRef.current;
    if (!displayed || !el) {
      busyRef.current = false;
      runExit();
      return;
    }
    const chars = el.querySelectorAll(".work_title_rise");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(chars, { yPercent: 0 });
      busyRef.current = false;
      runExit();
      return;
    }
    const tween = gsap.fromTo(
      chars,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.022,
        onComplete: () => {
          busyRef.current = false;
          runExit();
        },
      },
    );
    return () => {
      tween.kill();
    };
  }, [displayed, runExit]);

  // Deliberate, slow staggered entrance for the project blocks (GSAP). The menu
  // and frame are left untouched so they stay anchored while the list arrives.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = list.querySelectorAll(".work_item");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.13,
          delay: 0.3,
          clearProps: "transform,opacity,visibility",
        },
      );
    }, list);
    return () => ctx.revert();
  }, []);

  const wrapStyle =
    activeProject && isFilled.color(activeProject.accent)
      ? ({ "--work-accent": activeProject.accent } as CSSProperties)
      : undefined;

  return (
    <div
      className="work_wrap"
      data-active={activeProject ? "" : undefined}
      style={wrapStyle}
    >
      {/* One flood layer per project, stacked. The active one fades in as the
          previous fades out, so the colours cross-dissolve between projects
          instead of hard-swapping (each gradient is reproduced from Figma). */}
      <div className="work_bg" aria-hidden="true">
        {projects.map((project, index) => (
          <div
            key={project.title ?? index}
            className="work_flood"
            data-flood={floodSlug(project.title)}
            data-on={active === index ? "" : undefined}
            style={
              isFilled.color(project.accent)
                ? ({ "--work-accent": project.accent } as CSSProperties)
                : undefined
            }
          />
        ))}
      </div>

      <div className="work_frame">
        <div className="work_row work_row-top">
          <LogoMark />
          <nav className="work_topnav" aria-label="Sections">
            <PrismicNextLink className="work_label nav-underline" href="/work"><RollText text="Work" /></PrismicNextLink>
            <PrismicNextLink className="work_label nav-underline" href="/about"><RollText text="About" /></PrismicNextLink>
            <a className="work_label nav-underline" href={`mailto:${CONTACT_EMAIL}`}><RollText text="Contact" /></a>
          </nav>
          <p className="work_label">51.5072° N, 0.1276° W</p>
        </div>

        <div className="work_row work_row-mid">
          <div className="work_lead">
            <nav className="work_sidenav" aria-label="Primary">
              <PrismicNextLink className="work_label work_name nav-underline" href="/"><RollText text="Simone Cucchi" /></PrismicNextLink>
              <ul className="work_nav_list">
                <li><PrismicNextLink className="work_label nav-underline" href="/work"><RollText text="Work" /></PrismicNextLink></li>
                <li><PrismicNextLink className="work_label nav-underline" href="/about"><RollText text="About" /></PrismicNextLink></li>
                <li><a className="work_label nav-underline" href={`mailto:${CONTACT_EMAIL}`}><RollText text="Contact" /></a></li>
              </ul>
            </nav>
            <PrismicNextLink className="work_minus" href="/" aria-label="Back to home">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M0 22H44" stroke="currentColor" strokeWidth="2" />
              </svg>
            </PrismicNextLink>
          </div>
          <a className="work_plus" href="#" aria-label="Next">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <path d="M22 0V44M0 22H44" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </div>

        <div className="work_row work_row-bottom">
          <VolumeToggle className="work_label" />
          <p className="work_label">2011 - 2025 ©</p>
        </div>
      </div>

      <div className="work_center">
        <p className="work_title" aria-hidden="true" ref={titleRef}>
          {displayed
            ? [...displayed].map((ch, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: remount per title to re-reveal
                <span className="work_title_char" key={`${displayed}-${i}`}>
                  <span className="work_title_rise">{ch === " " ? " " : ch}</span>
                </span>
              ))
            : null}
        </p>
        {/* Reset to the plain /work state when the cursor leaves the blocks
            themselves (not the whole page), so the flood + title fall away. */}
        <ul className="work_list" ref={listRef} onMouseLeave={() => setActive(null)}>
          {projects.map((project, index) => (
            <li key={project.title ?? index} className="work_item">
              <PrismicNextLink
                field={project.link}
                className="work_block"
                aria-label={project.title ?? undefined}
                data-open={active === index ? "" : undefined}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => {
                  // Tell the case study it arrived via the card morph, so it lets
                  // the view transition own the expand instead of re-staging.
                  try {
                    sessionStorage.setItem("cs-morph", "1");
                  } catch {
                    /* ignore */
                  }
                }}
              >
                <span className="work_block_glass" aria-hidden="true" />
                <span className="work_block_teaser" aria-hidden="true">
                  {isFilled.image(project.image) && (
                    <img
                      className="work_block_img"
                      src={project.image.url}
                      alt=""
                      style={active === index ? ({ viewTransitionName: "project-hero" } as CSSProperties) : undefined}
                    />
                  )}
                </span>
              </PrismicNextLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
