"use client";

import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import { type CSSProperties, useState } from "react";
import { CONTACT_EMAIL } from "@/consts";
import "./index.css";

export type WorkListProps = SliceComponentProps<Content.WorkListSlice>;

/**
 * Work index: a stack of glass blocks. Hovering one floods the page with that
 * project's brand colour, opens the block to reveal its teaser image, shows the
 * title and switches the frame to light. Projects are editable in Prismic.
 */
export default function WorkList({ slice }: WorkListProps) {
  const projects = slice.primary.projects;
  const [active, setActive] = useState<number | null>(null);
  const activeProject = active !== null ? projects[active] : null;

  const wrapStyle =
    activeProject && isFilled.color(activeProject.accent)
      ? ({ "--work-accent": activeProject.accent } as CSSProperties)
      : undefined;

  return (
    <div
      className="work_wrap"
      data-active={activeProject ? "" : undefined}
      style={wrapStyle}
      onMouseLeave={() => setActive(null)}
    >
      <div className="work_bg" aria-hidden="true" />

      <div className="work_frame">
        <div className="work_row work_row-top">
          <span className="work_dot" aria-hidden="true">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          </span>
          <nav className="work_topnav" aria-label="Sections">
            <PrismicNextLink className="work_label" href="/work">Work</PrismicNextLink>
            <PrismicNextLink className="work_label" href="/about">About</PrismicNextLink>
            <a className="work_label" href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
          </nav>
          <p className="work_label">51.5072° N, 0.1276° W</p>
        </div>

        <div className="work_row work_row-mid">
          <div className="work_lead">
            <nav className="work_sidenav" aria-label="Primary">
              <PrismicNextLink className="work_label work_name" href="/">Simone Cucchi</PrismicNextLink>
              <ul className="work_nav_list">
                <li><PrismicNextLink className="work_label" href="/work">Work</PrismicNextLink></li>
                <li><PrismicNextLink className="work_label" href="/about">About</PrismicNextLink></li>
                <li><a className="work_label" href={`mailto:${CONTACT_EMAIL}`}>Contact</a></li>
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
          <p className="work_label">Volume on</p>
          <p className="work_label">2011 - 2025 ©</p>
        </div>
      </div>

      <div className="work_center">
        <p className="work_title" aria-hidden={activeProject ? undefined : true}>
          {activeProject?.title}
        </p>
        <ul className="work_list">
          {projects.map((project, index) => (
            <li key={project.title ?? index} className="work_item">
              <PrismicNextLink
                field={project.link}
                className="work_block"
                aria-label={project.title ?? undefined}
                data-open={active === index ? "" : undefined}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
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
