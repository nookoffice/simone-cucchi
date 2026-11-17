"use client";

import type { StaticImageData } from "next/image";
import Link from "next/link";
import { type CSSProperties, useState } from "react";
import { Styles } from "@/utils/styles";
import burberry from "@/assets/work/burberry.png";
import christies30 from "@/assets/work/christies-30.png";
import christiesApp from "@/assets/work/christies-app.png";

type Project = {
  title: string;
  /** Full-page brand gradient shown while the project is active. */
  gradient: string;
  /** Teaser image revealed in the opened block. */
  teaser: StaticImageData;
  href: string;
};

/**
 * Work index. First pass with three projects from the design; the layout is
 * data-driven, so adding the rest (and moving this to Prismic) is a content
 * change, not a rewrite.
 */
const PROJECTS: Project[] = [
  {
    title: "Christie's App",
    gradient: "radial-gradient(70% 90% at 50% 42%, #6a1022 0%, #3c0613 52%, #220309 100%)",
    teaser: christiesApp,
    href: "/work/christies-app",
  },
  {
    title: "Christie's 3.0",
    gradient: "radial-gradient(70% 90% at 50% 42%, #9a92a8 0%, #7c7489 52%, #595167 100%)",
    teaser: christies30,
    href: "#",
  },
  {
    title: "Burberry New Era",
    gradient: "radial-gradient(70% 95% at 45% 26%, #c3ccd9 0%, #808fa4 52%, #5c6980 100%)",
    teaser: burberry,
    href: "#",
  },
];

export default function WorkExperience() {
  const [active, setActive] = useState<number | null>(null);
  const activeProject = active !== null ? PROJECTS[active] : null;

  return (
    <div
      className="work_wrap"
      data-active={activeProject ? "" : undefined}
      style={activeProject ? ({ "--work-gradient": activeProject.gradient } as CSSProperties) : undefined}
      onMouseLeave={() => setActive(null)}
    >
      <Styles id="work" css={css} />
      <div className="work_bg" aria-hidden="true" />

      <div className="work_frame">
        <div className="work_row work_row-top">
          <span className="work_dot" aria-hidden="true">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          </span>
          {/* Shown only while a project is active. */}
          <nav className="work_topnav" aria-label="Sections">
            <Link className="work_label" href="/work">Work</Link>
            <a className="work_label" href="#">About</a>
            <a className="work_label" href="#">Misc</a>
          </nav>
          <p className="work_label">51.5072° N, 0.1276° W</p>
        </div>

        <div className="work_row work_row-mid">
          <div className="work_lead">
            {/* Side nav by default; a "back home" minus while a project is active. */}
            <nav className="work_sidenav" aria-label="Primary">
              <Link className="work_label work_name" href="/">Simone Cucchi</Link>
              <ul className="work_nav_list">
                <li>
                  <Link className="work_label" href="/work">Work</Link>
                </li>
                <li>
                  <a className="work_label" href="#">About</a>
                </li>
                <li>
                  <a className="work_label" href="#">Contact</a>
                </li>
              </ul>
            </nav>
            <Link className="work_minus" href="/" aria-label="Back to home">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M0 22H44" stroke="currentColor" strokeWidth="2" />
              </svg>
            </Link>
          </div>
          <a className="work_plus" href="#" aria-label="Next">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <path d="M22 0V44M0 22H44" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </div>

        <div className="work_row work_row-bottom">
          <p className="work_label">Volume on</p>
          <p className="work_label">2011 - 2025 ©</p>
        </div>
      </div>

      <div className="work_center">
        <p className="work_title" aria-hidden={activeProject ? undefined : true}>
          {activeProject?.title}
        </p>
        <ul className="work_list">
          {PROJECTS.map((project, index) => (
            <li key={project.title} className="work_item">
              <Link
                className="work_block"
                href={project.href}
                aria-label={project.title}
                data-open={active === index ? "" : undefined}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span className="work_block_glass" aria-hidden="true" />
                <span className="work_block_teaser" aria-hidden="true">
                  <img
                    className="work_block_img"
                    src={project.teaser.src}
                    alt=""
                    style={active === index ? ({ viewTransitionName: "project-hero" } as CSSProperties) : undefined}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const css = `
@layer components {
  .work_wrap {
    --work-text: var(--dark-800);
    position: relative;
    display: flex;
    min-height: 100svh;
    padding: var(--site-margin);
    color: var(--work-text);
    overflow: clip;
    isolation: isolate;
  }

  /* Base grey under a brand gradient that fades in when a project is active. */
  .work_bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: #e2e2e2;
  }
  .work_bg::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--work-gradient, transparent);
    opacity: 0;
    transition: opacity 500ms var(--hover-ease);
  }
  .work_wrap[data-active] { --work-text: var(--light-100); }
  .work_wrap[data-active] .work_bg::after { opacity: 1; }

  .work_frame {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-6);
    pointer-events: none;
  }
  .work_frame a { pointer-events: auto; }

  .work_row {
    display: flex;
    justify-content: space-between;
    gap: var(--space-5);
  }
  .work_row-top { position: relative; align-items: flex-start; }
  .work_row-mid { align-items: center; }
  .work_row-bottom { align-items: flex-end; }

  .work_label {
    font-family: var(--primary-family);
    font-size: clamp(0.8125rem, 0.72rem + 0.5vw, 1rem);
    font-weight: var(--primary-regular);
    line-height: var(--line-height-large);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    text-wrap: nowrap;
    color: var(--work-text);
    transition: color 500ms var(--hover-ease);
  }
  a.work_label { transition: color 500ms var(--hover-ease), opacity var(--hover-duration) var(--hover-ease); }
  a.work_label:hover { opacity: 0.55; }

  /* Side nav (default) and top nav (active) cross-fade. */
  .work_lead { position: relative; display: flex; align-items: center; }
  .work_sidenav { display: flex; align-items: baseline; gap: var(--space-6); transition: opacity 400ms var(--hover-ease); }
  .work_nav_list { display: flex; gap: var(--space-6); }
  .work_wrap[data-active] .work_sidenav { opacity: 0; pointer-events: none; }

  .work_topnav {
    position: absolute;
    left: 50%;
    translate: -50% 0;
    display: flex;
    gap: var(--space-6);
    opacity: 0;
    pointer-events: none;
    transition: opacity 400ms var(--hover-ease);
  }
  .work_wrap[data-active] .work_topnav { opacity: 1; pointer-events: auto; }

  .work_dot { display: block; color: var(--work-text); translate: 0 0.5em; transition: color 500ms var(--hover-ease); }

  .work_plus,
  .work_minus { display: block; width: clamp(1.75rem, 2.3vw, 2.75rem); color: var(--work-text); flex-shrink: 0; transition: color 500ms var(--hover-ease), opacity 400ms var(--hover-ease); }
  .work_plus svg,
  .work_minus svg { width: 100%; height: auto; }

  /* The minus (back home) only while a project is active. */
  .work_minus { position: absolute; left: 0; top: 50%; translate: 0 -50%; opacity: 0; pointer-events: none; }
  .work_wrap[data-active] .work_minus { opacity: 1; pointer-events: auto; }

  /* Centre column: the project title behind the stack of blocks. */
  .work_center { position: absolute; inset: 0; z-index: 1; display: grid; place-items: center; }
  .work_title {
    position: absolute;
    margin: 0;
    font-family: var(--primary-family);
    font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem);
    font-weight: var(--primary-regular);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    text-wrap: nowrap;
    color: var(--light-100);
    opacity: 0;
    transition: opacity 400ms var(--hover-ease);
    pointer-events: none;
  }
  .work_wrap[data-active] .work_title { opacity: 1; }

  .work_list { display: flex; flex-direction: column; gap: 0.375rem; width: clamp(10rem, 16vw, 12rem); }
  .work_item { display: block; }

  .work_block {
    position: relative;
    display: block;
    aspect-ratio: 192 / 45;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: aspect-ratio 400ms var(--hover-ease);
  }
  .work_block[data-open] { aspect-ratio: 192 / 120; }

  /* Default: a glass bar. */
  .work_block_glass {
    position: absolute;
    inset: 0;
    border-radius: 0.75rem;
    background: linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(210,210,210,0.6) 45%, rgba(255,255,255,0.5) 100%);
    box-shadow:
      inset 0 0 0 1px rgba(0,0,0,0.22),
      inset 0 2px 3px rgba(255,255,255,0.9),
      inset 0 -2px 4px rgba(0,0,0,0.12);
    transition: opacity 400ms var(--hover-ease);
  }
  .work_block[data-open] .work_block_glass { opacity: 0; }

  /* Revealed teaser image. */
  .work_block_teaser {
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    overflow: hidden;
    opacity: 0;
    transition: opacity 400ms var(--hover-ease);
  }
  .work_block[data-open] .work_block_teaser { opacity: 1; }
  .work_block_img { display: block; width: 100%; height: 100%; object-fit: cover; }

  @media (prefers-reduced-motion: reduce) {
    .work_bg::after, .work_title, .work_label, .work_block, .work_block_glass,
    .work_block_teaser, .work_dot, .work_plus, .work_minus, .work_sidenav, .work_topnav { transition-duration: 0.01ms; }
  }
}
`;
