import { asText, type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type CaseStudyHeroProps = SliceComponentProps<Content.CaseStudyHeroSlice>;

/**
 * Full-screen case study opener. The work-page teaser grows into the background
 * image (shared `project-hero` element), over which sit the title and intro.
 */
export default function CaseStudyHero({ slice }: CaseStudyHeroProps) {
  const { title, intro, image } = slice.primary;

  return (
    <header className="csh_hero">
      {isFilled.image(image) && (
        <img className="csh_img" src={image.url} alt={image.alt ?? ""} />
      )}
      <div className="csh_tint" aria-hidden="true" />

      <div className="csh_frame">
        <div className="csh_row csh_row-top">
          <PrismicNextLink className="csh_back" href="/work">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="csh_label">Back</span>
          </PrismicNextLink>
          <nav className="csh_topnav" aria-label="Sections">
            <PrismicNextLink className="csh_label" href="/work">Work</PrismicNextLink>
            <a className="csh_label" href="#">About</a>
            <a className="csh_label" href="#">Misc</a>
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
          <p className="csh_label">Volume on</p>
          <p className="csh_label">2011 - 2025 ©</p>
        </div>
      </div>
    </header>
  );
}
