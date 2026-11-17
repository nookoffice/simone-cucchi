"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/media/Icon";
import NavLink from "@/components/global/NavLink";
import logo from "@/assets/logo/logo.svg";
import { SITE_NAME } from "@/consts";
import type { ChromeLink } from "@/prismic/chromeLinks";
import { cx } from "@/utils/cx";
import { Styles } from "@/utils/styles";

type Props = {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Fix the nav over the page. */
  overlap?: boolean;
  /** Main nav links from the settings document. */
  links?: ChromeLink[];
};

export default function Nav({ render = true, overlap = false, links = [] }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = root.current;
    const toggle = nav?.querySelector<HTMLButtonElement>(".nav_toggle");
    if (!nav || !toggle) return;

    const setOpen = (open: boolean) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    const onToggle = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
    const onLink = () => setOpen(false);
    const links = [...nav.querySelectorAll("a")];
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!nav.classList.contains("open") || !(target instanceof Node)) return;
      if (!nav.contains(target)) setOpen(false);
    };
    const media = window.matchMedia("(width >= 48rem)");
    const onMedia = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    toggle.addEventListener("click", onToggle);
    links.forEach((link) => link.addEventListener("click", onLink));
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    media.addEventListener("change", onMedia);

    return () => {
      toggle.removeEventListener("click", onToggle);
      links.forEach((link) => link.removeEventListener("click", onLink));
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      media.removeEventListener("change", onMedia);
    };
  }, []);

  if (!render) return <Styles id="nav" css={css} />;

  return (
    <>
      <Styles id="nav" css={css} />
      <header ref={root} className={cx("nav_wrap", overlap && "overlap")}>
        <div className="nav_inner">
          <Link className="nav_logo" href="/" aria-label={SITE_NAME}>
            <Icon src={logo} variant="full-width" />
          </Link>
          <button
            className="nav_toggle"
            type="button"
            aria-label="Menu"
            aria-expanded="false"
            aria-controls="nav-menu"
          >
            <span className="nav_toggle_icon" />
          </button>
          <nav className="nav_menu" id="nav-menu" aria-label="Main" data-lenis-prevent>
            <div className="nav_menu_inner">
              <ul className="nav_links">
                {links.map((link) => (
                  <NavLink
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <noscript>
        <style>{`
          .nav_toggle { display: none; }
          .nav_menu { grid-template-rows: 1fr; visibility: visible; }
          .nav_menu_inner { opacity: 1; }
        `}</style>
      </noscript>
    </>
  );
}

const css = `
@layer components {
  .nav_wrap {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    padding-inline: var(--site-margin);
    background-color: var(--background);
    color: var(--text);
    border-bottom: var(--border-width) solid var(--border);

    &.overlap {
      position: fixed;
      inset-inline: 0;
    }
  }

  .nav_inner {
    width: 100%;
    max-width: var(--max-width-main);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0 var(--space-6);
  }

  .nav_logo,
  .nav_toggle {
    min-height: var(--nav-height);
  }

  .nav_logo {
    display: flex;
    align-items: center;
    width: 6.5rem;
    transition: opacity var(--hover-duration) var(--hover-ease);
    @media (hover: hover) {
      &:hover {
        opacity: 0.6;
      }
    }
  }

  .nav_toggle {
    --_icon-width: 1.5rem;
    --_bar-gap: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.75rem;
    margin-right: calc((2.75rem - var(--_icon-width)) / -2);
    color: inherit;
    border-radius: var(--radius-small);
    transition: opacity var(--hover-duration) var(--hover-ease);
    @media (hover: hover) {
      &:hover {
        opacity: 0.6;
      }
    }
  }

  .nav_toggle_icon {
    position: relative;
    display: block;
    width: var(--_icon-width);
    height: calc(var(--_bar-gap) + var(--border-width));
    &::before,
    &::after {
      content: "";
      position: absolute;
      inset-inline: 0;
      height: var(--border-width);
      background-color: currentcolor;
      transition: transform var(--open-duration) var(--open-ease);
    }
    &::before {
      top: 0;
    }
    &::after {
      top: var(--_bar-gap);
    }
  }

  .nav_wrap.open .nav_toggle_icon {
    &::before {
      transform: translateY(calc(var(--_bar-gap) / 2)) rotate(45deg);
    }
    &::after {
      transform: translateY(calc(var(--_bar-gap) / -2)) rotate(-45deg);
    }
  }

  .nav_menu {
    position: absolute;
    top: 100%;
    inset-inline: 0;
    display: grid;
    grid-template-rows: 0fr;
    visibility: hidden;
    max-height: calc(100svh - var(--nav-height));
    overflow-x: clip;
    overflow-y: auto;
    overscroll-behavior: contain;
    background-color: var(--background);
    border-bottom: var(--border-width) solid var(--border);
    transition:
      grid-template-rows var(--open-duration) var(--open-ease),
      visibility var(--open-duration) var(--open-ease);
  }

  .nav_menu_inner {
    overflow: hidden;
    opacity: 0;
    transition: opacity var(--open-duration) var(--open-ease);
  }

  .nav_wrap.open .nav_menu {
    grid-template-rows: 1fr;
    visibility: visible;
  }

  .nav_wrap.open .nav_menu_inner {
    opacity: 1;
    overflow-y: auto;
  }

  .nav_links {
    display: flex;
    flex-direction: column;
    padding: var(--space-2) var(--site-margin) var(--space-4);
    font-size: var(--text-main);
    font-weight: var(--primary-medium);
    & > li + li {
      border-top: var(--border-width) solid var(--border);
    }
  }

  .nav_link {
    display: block;
    padding-block: var(--space-3);
    color: color-mix(in lab, currentcolor 60%, transparent);
    text-decoration: none;
    text-underline-offset: 0.4em;
    text-decoration-thickness: var(--border-width);
    transition: color var(--hover-duration) var(--hover-ease);
    &[aria-current="page"] {
      color: var(--text);
    }
    @media (hover: hover) {
      &:hover {
        color: var(--text);
      }
    }
  }

  @media (width >= 48rem) {
    .nav_toggle {
      display: none;
    }

    .nav_menu {
      position: static;
      display: block;
      visibility: visible;
      background-color: transparent;
      border-bottom: 0;
    }

    .nav_menu_inner {
      overflow: visible;
      opacity: 1;
    }

    .nav_links {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding: 0;
      gap: var(--space-4);
      font-size: var(--text-small);
      & > li + li {
        border-top: 0;
      }
    }

    .nav_link {
      padding-block: 0;
      &[aria-current="page"] {
        text-decoration: underline;
      }
    }
  }
}
`;
