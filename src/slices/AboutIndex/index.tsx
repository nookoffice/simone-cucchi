import { asText, type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import { CONTACT_EMAIL } from "@/consts";
import "./index.css";

export type AboutIndexProps = SliceComponentProps<Content.AboutIndexSlice>;

/**
 * About page: a centred bio statement over a ledger of experience. Shares the
 * site frame (dot, nav, coordinates, footer); content is editable in Prismic.
 */
export default function AboutIndex({ slice }: AboutIndexProps) {
  const { intro, experience } = slice.primary;

  return (
    <div className="about_wrap">
      <header className="about_row about_row-top">
        <span className="about_dot" aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="4" fill="currentColor" />
          </svg>
        </span>
        <nav className="about_nav" aria-label="Sections">
          <PrismicNextLink className="about_label" href="/work">Work</PrismicNextLink>
          <PrismicNextLink className="about_label is-active" href="/about" aria-current="page">About</PrismicNextLink>
          <a className="about_label" href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </nav>
        <p className="about_label">41.902782° N, 12.496366° E</p>
      </header>

      {isFilled.richText(intro) && (
        <p className="about_intro">{asText(intro)}</p>
      )}

      <ul className="about_list">
        {experience.map((item, index) => (
          <li className="about_item" key={`${index}-${item.entry ?? ""}`}>
            <span className="about_year">{item.year}</span>
            <span className="about_entry">{item.entry}</span>
          </li>
        ))}
      </ul>

      <footer className="about_row about_row-bottom">
        <p className="about_label">Volume on</p>
        <p className="about_label">2011 - 2025 ©</p>
      </footer>
    </div>
  );
}
