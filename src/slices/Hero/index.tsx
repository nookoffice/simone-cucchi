import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
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
      {/* Centred object: flickers through the logo's materials as a preloader,
          then settles on glass and tilts toward the cursor. */}
      <HeroObject alt="Simone Cucchi monogram" />

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
          <Link className="hero_plus" href="/work" aria-label="Work">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <path d="M22 0V44M0 22H44" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>
        </div>

        <div className="hero_row hero_row-bottom">
          <VolumeToggle className="hero_label" />
          <p className="hero_label">{COPYRIGHT}</p>
        </div>
      </div>
    </section>
  );
}
