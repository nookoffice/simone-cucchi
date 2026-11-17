import type { Metadata } from "next";
import Link from "next/link";
import christiesApp from "@/assets/work/christies-app.png";
import BaseLayout from "@/layouts/BaseLayout";
import { getSettings, metadataWithSettings } from "@/prismic/seo";
import { Styles } from "@/utils/styles";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return metadataWithSettings(null, settings, "/work/christies-app");
}

/**
 * Christie's App case study — stage 1: the full-screen hero the work block's
 * teaser grows into (shared element `project-hero`). The content sections
 * (app screens, personalisation, gallery, stats, team) are the next stage.
 */
export default function ChristiesAppCaseStudy() {
  return (
    <BaseLayout chrome={false}>
      <article className="cs_wrap">
        <Styles id="cs" css={css} />

        <img className="cs_hero_img" src={christiesApp.src} alt="Christie's App" />
        <div className="cs_tint" aria-hidden="true" />

        <h1 className="cs_center">
          <span className="cs_title">Christie&rsquo;s App</span>
          <span className="cs_subtitle">Digital Product Design</span>
        </h1>

        <div className="cs_frame">
          <div className="cs_row cs_row-top">
            <span className="cs_dot" aria-hidden="true">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="4" fill="currentColor" />
              </svg>
            </span>
            <nav className="cs_topnav" aria-label="Sections">
              <Link className="cs_label" href="/work">Work</Link>
              <a className="cs_label" href="#">About</a>
              <a className="cs_label" href="#">Misc</a>
            </nav>
            <p className="cs_label">51.5072° N, 0.1276° W</p>
          </div>

          <div className="cs_row cs_row-mid">
            <Link className="cs_minus" href="/work" aria-label="Back to work">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M0 22H44" stroke="currentColor" strokeWidth="2" />
              </svg>
            </Link>
            <a className="cs_plus" href="#" aria-label="Next">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M22 0V44M0 22H44" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
          </div>

          <div className="cs_row cs_row-bottom">
            <p className="cs_label">Volume on</p>
            <p className="cs_label">2011 - 2025 ©</p>
          </div>
        </div>
      </article>
    </BaseLayout>
  );
}

const css = `
@layer components {
  .cs_wrap {
    position: relative;
    display: flex;
    min-height: 100svh;
    padding: var(--site-margin);
    background-color: #3c0613;
    color: var(--light-100);
    overflow: clip;
    isolation: isolate;
  }

  .cs_hero_img {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    view-transition-name: project-hero;
  }
  .cs_tint {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(80% 90% at 50% 45%, rgba(60, 6, 19, 0.2) 0%, rgba(34, 3, 9, 0.75) 100%);
  }

  .cs_center {
    position: absolute;
    inset: 0;
    z-index: 1;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    text-align: center;
    pointer-events: none;
  }
  .cs_title {
    font-family: var(--primary-family);
    font-size: clamp(1.75rem, 1.2rem + 2.4vw, 3rem);
    font-weight: var(--primary-regular);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
  }
  .cs_subtitle {
    font-family: var(--primary-family);
    font-size: clamp(0.6875rem, 0.6rem + 0.3vw, 0.8125rem);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    opacity: 0.85;
  }

  .cs_frame {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-6);
    pointer-events: none;
  }
  .cs_frame a { pointer-events: auto; }

  .cs_row { display: flex; justify-content: space-between; gap: var(--space-5); }
  .cs_row-top { position: relative; align-items: flex-start; }
  .cs_row-mid { align-items: center; }
  .cs_row-bottom { align-items: flex-end; }

  .cs_label {
    font-family: var(--primary-family);
    font-size: clamp(0.8125rem, 0.72rem + 0.5vw, 1rem);
    font-weight: var(--primary-regular);
    line-height: var(--line-height-large);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    text-wrap: nowrap;
    color: var(--light-100);
  }
  a.cs_label { transition: opacity var(--hover-duration) var(--hover-ease); }
  a.cs_label:hover { opacity: 0.55; }

  .cs_topnav { position: absolute; left: 50%; translate: -50% 0; display: flex; gap: var(--space-6); }
  .cs_dot { display: block; color: var(--light-100); translate: 0 0.5em; }
  .cs_plus,
  .cs_minus { display: block; width: clamp(1.75rem, 2.3vw, 2.75rem); color: var(--light-100); flex-shrink: 0; }
  .cs_plus svg,
  .cs_minus svg { width: 100%; height: auto; }

  ::view-transition-group(project-hero) { animation-duration: 650ms; }
}
`;
