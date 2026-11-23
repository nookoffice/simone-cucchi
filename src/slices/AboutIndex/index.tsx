import { asText, type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import type { CSSProperties } from "react";
import { CONTACT_EMAIL } from "@/consts";
import LogoMark from "@/components/LogoMark";
import RollText from "@/components/RollText";
import VolumeToggle from "@/components/VolumeToggle";
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
        <LogoMark />
        <nav className="about_nav" aria-label="Sections">
          <PrismicNextLink className="about_label nav-underline" href="/work"><RollText text="Work" /></PrismicNextLink>
          <PrismicNextLink className="about_label nav-underline is-active" href="/about" aria-current="page"><RollText text="About" /></PrismicNextLink>
          <a className="about_label nav-underline" href={`mailto:${CONTACT_EMAIL}`}><RollText text="Contact" /></a>
        </nav>
        <p className="about_label">41.902782° N, 12.496366° E</p>
      </header>

      {isFilled.richText(intro) && (
        <p className="about_intro">{asText(intro)}</p>
      )}

      <ul className="about_list">
        {experience.map((item, index) => (
          <li
            className="about_item"
            key={`${index}-${item.entry ?? ""}`}
            data-reveal
            style={{ "--reveal-delay": `${Math.min(index, 8) * 55}ms` } as CSSProperties}
          >
            <span className="about_year">{item.year}</span>
            <span className="about_entry">{item.entry}</span>
          </li>
        ))}
      </ul>

      <footer className="about_row about_row-bottom">
        <VolumeToggle className="about_label" />
        <p className="about_label">2011 - 2025 ©</p>
      </footer>
    </div>
  );
}
