import type { Metadata } from "next";
import Link from "next/link";
import heroImg from "@/assets/work/christies-app.png";
import appProfile from "@/assets/work/christies/app-profile.png";
import appSearch from "@/assets/work/christies/app-search.png";
import gallery from "@/assets/work/christies/gallery.png";
import nextImg from "@/assets/work/christies/next-christies30.png";
import personalisation from "@/assets/work/christies/personalisation.png";
import BaseLayout from "@/layouts/BaseLayout";
import { getSettings, metadataWithSettings } from "@/prismic/seo";
import { Styles } from "@/utils/styles";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return metadataWithSettings(null, settings, "/work/christies-app");
}

const INTRO =
  "The Christie’s App is one of the key destinations of Christie’s top clients, who are highly engaged in the auction world. After re-launching a new simplified version of the App in 2021, it was necessary to build upon that, focusing on personalisation, new technology and brand. After analysing the data, we moved the overall app’s focus, powering up the three most used areas: My Account, Search and Support. We created a brand new browse experience, combining auctions, private sales, stories and trends, all into one intuitive Explore section.";

const GOAL =
  "Despite a decline in overall traffic during 2024, the redesigned Onboarding journey, Explore page, Calendar page, and My Account have resulted in an increase in qualified users (transactors) entering the sale registration and bidding funnel.";

const STATS = [
  { value: "+6%", label: "Follow sales" },
  { value: "+24%", label: "Sale registrants and bidders" },
  { value: "+90%", label: "Full onboarding registration" },
  { value: "+23%", label: "Online sale registration" },
];

const TEAM = [
  { role: "Head of Digital Design", name: "Jon-Ross Le Haye" },
  { role: "Product Design Lead", name: "Simone Cucchi" },
  { role: "Senior Product Designer", name: "Dan Hart" },
  { role: "Motion video", name: "Services Généraux" },
];

export default function ChristiesAppCaseStudy() {
  return (
    <BaseLayout chrome={false}>
      <article className="cs_wrap">
        <Styles id="cs" css={css} />

        {/* Hero — the teaser grows into this image (shared element). */}
        <header className="cs_hero">
          <img className="cs_hero_img" src={heroImg.src} alt="Christie's App" />
          <div className="cs_tint" aria-hidden="true" />

          <div className="cs_hero_frame">
            <div className="cs_row cs_row-top">
              <Link className="cs_back" href="/work">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span className="cs_label">Back</span>
              </Link>
              <nav className="cs_topnav" aria-label="Sections">
                <Link className="cs_label" href="/work">Work</Link>
                <a className="cs_label" href="#">About</a>
                <a className="cs_label" href="#">Misc</a>
              </nav>
              <p className="cs_label">51.5072° N, 0.1276° W</p>
            </div>

            <div className="cs_hero_lead">
              <h1 className="cs_hero_title">Christie&rsquo;s App</h1>
              <p className="cs_intro text-style-large">{INTRO}</p>
            </div>

            <div className="cs_row cs_row-bottom">
              <p className="cs_label">Volume on</p>
              <p className="cs_label">2011 - 2025 ©</p>
            </div>
          </div>
        </header>

        {/* App screens */}
        <section className="cs_section cs_screens">
          <img className="cs_phone" src={appProfile.src} alt="Christie's App account and bids" />
          <img className="cs_phone cs_phone-raised" src={appSearch.src} alt="Christie's App search" />
          <img className="cs_phone" src={personalisation.src} alt="Christie's App personalised discovery" />
        </section>

        {/* Personalisation + mood image */}
        <section className="cs_section cs_mood">
          <p className="cs_eyebrow">Personalisation</p>
          <img className="cs_mood_img" src={gallery.src} alt="" />
        </section>

        {/* App performance */}
        <section className="cs_section cs_perf">
          <p className="cs_eyebrow">App performance</p>
          <div className="cs_perf_body">
            <p className="cs_change">Change YOY</p>
            <dl className="cs_stats">
              {STATS.map((s) => (
                <div className="cs_stat" key={s.label}>
                  <dt className="cs_stat_value">{s.value}</dt>
                  <dd className="cs_stat_label">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The goal */}
        <section className="cs_section cs_goal">
          <p className="cs_eyebrow">The goal</p>
          <p className="cs_goal_text text-style-lead">{GOAL}</p>
        </section>

        {/* Team */}
        <section className="cs_section cs_team">
          <p className="cs_eyebrow">Team</p>
          <ul className="cs_team_list">
            {TEAM.map((t) => (
              <li className="cs_credit" key={t.role}>
                <span className="cs_credit_role">{t.role}</span>
                <span className="cs_credit_name">{t.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Next project */}
        <Link className="cs_next" href="#">
          <img className="cs_next_img" src={nextImg.src} alt="" />
          <div className="cs_next_content">
            <span className="cs_next_title">Christie&rsquo;s 3.0</span>
            <span className="cs_next_sub">Product design | Web 3 | Art direction</span>
          </div>
        </Link>
      </article>
    </BaseLayout>
  );
}

const css = `
@layer components {
  .cs_wrap {
    position: relative;
    background-color: #0a0607;
    color: var(--light-100);
    overflow: clip;
  }

  .cs_eyebrow {
    font-family: var(--primary-family);
    font-size: var(--text-small);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    color: var(--text-2, rgba(255,255,255,0.6));
    margin: 0;
  }
  .cs_label {
    font-family: var(--primary-family);
    font-size: clamp(0.8125rem, 0.72rem + 0.5vw, 1rem);
    font-weight: var(--primary-regular);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    text-wrap: nowrap;
    color: var(--light-100);
  }
  a.cs_label, .cs_back { transition: opacity var(--hover-duration) var(--hover-ease); }
  a.cs_label:hover, .cs_back:hover { opacity: 0.55; }

  /* HERO */
  .cs_hero {
    position: relative;
    display: flex;
    min-height: 100svh;
    padding: var(--site-margin);
    isolation: isolate;
  }
  .cs_hero_img {
    position: absolute; inset: 0; z-index: -2;
    width: 100%; height: 100%; object-fit: cover;
    view-transition-name: project-hero;
  }
  .cs_tint {
    position: absolute; inset: 0; z-index: -1;
    background: radial-gradient(90% 90% at 50% 40%, rgba(60,6,19,0.1) 0%, rgba(10,3,6,0.78) 100%);
  }
  .cs_hero_frame {
    position: relative; z-index: 1;
    display: flex; flex: 1; flex-direction: column; justify-content: space-between;
    gap: var(--space-6);
  }
  .cs_row { display: flex; justify-content: space-between; gap: var(--space-5); align-items: center; }
  .cs_row-top { position: relative; align-items: flex-start; }
  .cs_row-bottom { align-items: flex-end; }
  .cs_back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--light-100); }
  .cs_topnav { position: absolute; left: 50%; translate: -50% 0; display: flex; gap: var(--space-6); }

  .cs_hero_lead {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    align-items: end;
  }
  .cs_hero_title {
    font-family: var(--primary-family);
    font-size: clamp(2rem, 1.2rem + 3vw, 3.25rem);
    font-weight: var(--primary-regular);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    margin: 0;
  }
  .cs_intro {
    max-width: 48ch;
    color: rgba(255,255,255,0.86);
    margin: 0;
  }

  /* CONTENT SECTIONS */
  .cs_section {
    padding: var(--section-space-medium) var(--site-margin);
  }
  .cs_section .cs_eyebrow { margin-bottom: var(--space-6); }

  .cs_screens {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: clamp(1rem, 3vw, 2.5rem);
    flex-wrap: wrap;
  }
  .cs_phone {
    width: clamp(10rem, 20vw, 16rem);
    height: auto;
    border-radius: var(--radius-main);
  }
  .cs_phone-raised { transform: translateY(-8%); }

  .cs_mood_img {
    width: 100%; height: auto;
    border-radius: var(--radius-main);
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .cs_perf_body { display: grid; grid-template-columns: 1fr; gap: var(--space-6); }
  .cs_change { font-family: var(--primary-family); font-size: var(--text-small); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: rgba(255,255,255,0.6); margin: 0; }
  .cs_stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-7) var(--space-5); margin: 0; }
  @media (width >= 60rem) { .cs_stats { grid-template-columns: repeat(4, 1fr); } }
  .cs_stat { display: flex; flex-direction: column; gap: var(--space-2); }
  .cs_stat_value { font-family: var(--primary-family); font-size: clamp(2rem, 1.4rem + 2vw, 3.25rem); font-weight: var(--primary-regular); letter-spacing: var(--letter-spacing-tight); margin: 0; }
  .cs_stat_label { font-family: var(--primary-family); font-size: var(--text-small); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: rgba(255,255,255,0.55); margin: 0; }

  .cs_goal_text {
    max-width: 22ch;
    font-family: var(--secondary-family);
    color: var(--light-100);
    margin: 0;
  }

  .cs_team_list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    max-width: 24rem;
  }
  .cs_credit { display: flex; flex-direction: column; gap: var(--space-2); }
  .cs_credit_role { font-family: var(--primary-family); font-size: var(--text-small); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: rgba(255,255,255,0.55); }
  .cs_credit_name { font-family: var(--secondary-family); font-size: var(--text-large); }

  /* NEXT PROJECT */
  .cs_next {
    position: relative;
    display: flex;
    min-height: 90svh;
    padding: var(--site-margin);
    align-items: center;
    justify-content: center;
    isolation: isolate;
    color: var(--light-100);
  }
  .cs_next_img { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; }
  .cs_next_content { text-align: center; display: flex; flex-direction: column; gap: var(--space-3); }
  .cs_next_title { font-family: var(--primary-family); font-size: clamp(1.75rem, 1.2rem + 2.4vw, 3rem); font-weight: var(--primary-regular); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; }
  .cs_next_sub { font-family: var(--primary-family); font-size: var(--text-small); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; opacity: 0.85; }

  @media (width < 48rem) {
    .cs_hero_lead { grid-template-columns: 1fr; gap: var(--space-5); }
  }

  ::view-transition-group(project-hero) { animation-duration: 650ms; }
}
`;
