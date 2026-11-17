import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import heroObject from "./hero-object.jpg";
import "./index.css";

/** Props for `Hero`. */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/** Fixed brand marks in the hero frame. Promote to fields if they ever vary. */
const NAV_LINKS = [
  { label: "Work", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];
const COORDINATES = "51.5072° N, 0.1276° W";
const COPYRIGHT = "2011 - 2025 ©";

/**
 * Full-viewport homepage hero: a centred object (image now, 3D object later)
 * framed by editorial corner marks and the site nav.
 */
export default function Hero({ slice }: HeroProps) {
  return (
    <section
      className="hero_wrap"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Centred object: a bundled placeholder for the 3D object to come.
          Swap the <img> for a canvas without touching the frame. The slice's
          Prismic `image` field stays available for a content-managed swap. */}
      <div className="hero_object">
        <img
          className="hero_object_media"
          src={heroObject.src}
          alt="Simone Cucchi monogram rendered in glass"
        />
      </div>

      <div className="hero_frame">
        <div className="hero_row hero_row-top">
          <span className="hero_dot" aria-hidden="true">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          </span>
          <p className="hero_label">{COORDINATES}</p>
        </div>

        <div className="hero_row hero_row-mid">
          <nav className="hero_nav" aria-label="Primary">
            <a className="hero_label hero_name" href="/">
              Simone Cucchi
            </a>
            <ul className="hero_nav_list">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <a className="hero_label hero_link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="hero_plus" href="/work" aria-label="Work">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <path d="M22 0V44M0 22H44" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </div>

        <div className="hero_row hero_row-bottom">
          <p className="hero_label">Volume on</p>
          <p className="hero_label">{COPYRIGHT}</p>
        </div>
      </div>
    </section>
  );
}
