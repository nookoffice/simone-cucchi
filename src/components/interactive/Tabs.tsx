"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Button from "@/components/Button";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Tab layout. */
  variant?: "horizontal" | "side";
  /** Panel playback. */
  playback?: "manual" | "auto";
  /** Show all panels in design mode. */
  preview?: boolean;
  /** Tab triggers. One per panel, in order. */
  links?: ReactNode;
  class?: string;
  children?: ReactNode;
};

const INTERVAL = 6000;
const SLIDE = 500;

export default function Tabs({
  render = true,
  variant = "horizontal",
  playback = "manual",
  preview = false,
  links,
  class: className,
  children,
  ...rest
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const auto = playback === "auto";
  const ready = hasContent(links) && hasContent(children);

  useEffect(() => {
    const tabs = root.current;
    if (!tabs) return;
    const tabLinks = [...tabs.querySelectorAll<HTMLButtonElement>(".tabs_link")];
    const panelList = tabs.querySelector<HTMLElement>(".tabs_panels");
    const panels = [...(panelList?.children ?? [])] as HTMLElement[];
    if (tabLinks.length === 0 || tabLinks.length !== panels.length) return;

    const uid = Math.random().toString(36).slice(2, 8);
    const playing = tabs.classList.contains("auto");
    const toggle = tabs.querySelector<HTMLButtonElement>("[data-toggle]");
    const bar = tabs.querySelector<HTMLElement>(".tabs_links");

    const keepInView = (link: HTMLElement) => {
      if (!bar) return;
      const list = bar.getBoundingClientRect();
      const box = link.getBoundingClientRect();
      if (box.left < list.left) bar.scrollBy({ left: box.left - list.left });
      else if (box.right > list.right) bar.scrollBy({ left: box.right - list.right });
    };

    let current = 0;
    let timer: number | undefined;
    let paused = false;

    const key = tabs.id || "tab";
    const slugs = tabLinks.map((link) =>
      (link.textContent ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );

    const remember = (index: number) => {
      const url = new URL(location.href);
      url.searchParams.set(key, slugs[index]);
      history.replaceState(history.state, "", url);
    };

    tabLinks.forEach((link, i) => {
      link.id = `tab-${uid}-${i}`;
      link.setAttribute("role", "tab");
      link.setAttribute("aria-controls", `panel-${uid}-${i}`);
      panels[i].id = `panel-${uid}-${i}`;
      panels[i].setAttribute("role", "tabpanel");
      panels[i].setAttribute("aria-labelledby", link.id);
      panels[i].tabIndex = 0;
    });

    const restart = () => {
      window.clearTimeout(timer);
      if (!playing || paused) return;
      tabs.classList.remove("running");
      void tabs.offsetWidth;
      tabs.classList.add("running");
      timer = window.setTimeout(() => show(current + 1, false, false), INTERVAL);
    };

    const show = (next: number, focus = false, share = true) => {
      const index = (next + tabLinks.length) % tabLinks.length;
      if (index !== current) {
        tabs.style.setProperty("--_dir", next > current ? "1" : "-1");
        tabs.dataset.moved = "";
        const leaving = panels[current];
        leaving.classList.add("is-leaving");
        window.setTimeout(() => leaving.classList.remove("is-leaving"), SLIDE + 50);
      }
      tabLinks.forEach((link, i) => {
        link.classList.toggle("is-active", i === index);
        link.setAttribute("aria-selected", String(i === index));
        link.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((panel, i) => panel.classList.toggle("is-active", i === index));
      current = index;
      if (share) remember(index);
      if (focus) tabLinks[index].focus();
      keepInView(tabLinks[index]);
      restart();
    };

    const onClicks: Array<() => void> = [];
    const onKeys: Array<(event: KeyboardEvent) => void> = [];
    tabLinks.forEach((link, i) => {
      const onClick = () => show(i);
      const onKey = (event: KeyboardEvent) => {
        const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
        const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
        if (!forward && !back) return;
        event.preventDefault();
        show(current + (forward ? 1 : -1), true);
      };
      link.addEventListener("click", onClick);
      link.addEventListener("keydown", onKey);
      onClicks.push(onClick);
      onKeys.push(onKey);
    });

    const stepButtons = [...tabs.querySelectorAll<HTMLButtonElement>("[data-step]")];
    const onSteps = stepButtons.map((step) => {
      const onClick = () => show(current + Number(step.dataset.step));
      step.addEventListener("click", onClick);
      return onClick;
    });

    const setPaused = (value: boolean) => {
      paused = value;
      tabs.classList.toggle("is-paused", value);
      toggle?.setAttribute("aria-pressed", String(!value));
      toggle?.setAttribute("aria-label", value ? "Start automatic rotation" : "Pause automatic rotation");
      restart();
    };

    tabs.classList.add("is-ready");
    const wanted = slugs.indexOf(new URLSearchParams(location.search).get(key) ?? "");
    show(wanted === -1 ? 0 : wanted, false, false);
    if (wanted !== -1) tabs.scrollIntoView({ block: "nearest" });

    const cleaners: Array<() => void> = [];
    if (playing) {
      const holds = { motion: false, focus: false, offscreen: false, asked: wanted !== -1 };
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      holds.motion = motion.matches;
      const settle = () => setPaused(Object.values(holds).some(Boolean));
      const onMotion = (event: MediaQueryListEvent) => {
        holds.motion = event.matches;
        settle();
      };
      const onFocusIn = () => {
        holds.focus = true;
        settle();
      };
      const onFocusOut = (event: FocusEvent) => {
        if (tabs.contains(event.relatedTarget as Node)) return;
        holds.focus = false;
        settle();
      };
      const onToggle = () => {
        holds.asked = false;
        setPaused(!paused);
      };
      const observer = new IntersectionObserver((entries) => {
        holds.offscreen = !entries[0].isIntersecting;
        settle();
      });
      motion.addEventListener("change", onMotion);
      tabs.addEventListener("focusin", onFocusIn);
      tabs.addEventListener("focusout", onFocusOut);
      toggle?.addEventListener("click", onToggle);
      observer.observe(tabs);
      settle();
      cleaners.push(() => {
        motion.removeEventListener("change", onMotion);
        tabs.removeEventListener("focusin", onFocusIn);
        tabs.removeEventListener("focusout", onFocusOut);
        toggle?.removeEventListener("click", onToggle);
        observer.disconnect();
      });
    }

    return () => {
      window.clearTimeout(timer);
      tabLinks.forEach((link, i) => {
        link.removeEventListener("click", onClicks[i]);
        link.removeEventListener("keydown", onKeys[i]);
      });
      stepButtons.forEach((step, i) => step.removeEventListener("click", onSteps[i]));
      cleaners.forEach((clean) => clean());
    };
  }, []);

  if (!render || !ready) return <Styles id="tabs" css={css} />;

  return (
    <>
      <Styles id="tabs" css={css} />
      <div
        ref={root}
        className={cx("tabs_wrap", variant !== "horizontal" && variant, auto && "auto", preview && "preview", className)}
        {...rest}
      >
        <div className="tabs_bar">
          <div
            className="tabs_links"
            role="tablist"
            aria-orientation={variant === "side" ? "vertical" : "horizontal"}
          >
            {links}
          </div>
        </div>
        <div className="tabs_panels">{children}</div>
        {auto && (
          <div className="tabs_controls">
            <div className="tabs_steps">
              <Button variant="arrow" emphasis="secondary" direction="back" label="Previous tab" data-step="-1" />
              <Button variant="arrow" emphasis="secondary" label="Next tab" data-step="1" />
            </div>
            <Button
              variant="play"
              emphasis="secondary"
              label="Pause automatic rotation"
              pressed
              data-toggle
            />
          </div>
        )}
      </div>
      <noscript>
        <style>{`
          .tabs_bar, .tabs_controls { display: none; }
          .tabs_wrap { grid-template-columns: none; }
          .tabs_panels { gap: var(--space-6); overflow: visible; }
          .tabs_panels > * { grid-area: auto; opacity: 1; visibility: visible; translate: none; }
        `}</style>
      </noscript>
    </>
  );
}

const css = `
@layer components {
  .tabs_wrap {
    --_dir: 1;
    --_interval: 6s;
    --_slide: 500ms;
    display: grid;
    gap: var(--space-6);
    width: 100%;

    &.side {
      @media (width >= 48rem) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        align-items: start;
      }
    }
  }

  .tabs_bar {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .tabs_links {
    display: flex;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
    .tabs_wrap.side & {
      flex-direction: column;
      gap: var(--space-2);
      overflow-x: visible;
    }
  }

  .tabs_link {
    flex: 1;
    min-width: 8rem;
    padding-block: var(--space-3);
    background: none;
    border-bottom: var(--border-width) solid var(--border);
    color: color-mix(in lab, currentcolor 60%, transparent);
    text-align: center;
    transition:
      color var(--hover-duration) var(--hover-ease),
      border-color var(--hover-duration) var(--hover-ease);
    &.is-active {
      border-bottom-color: var(--text);
      color: var(--text);
    }
    @media (hover: hover) {
      &:hover {
        color: var(--text);
      }
    }
    .tabs_wrap.side & {
      flex: none;
      min-width: 0;
      padding: var(--space-3) var(--space-5);
      border: var(--border-width) solid var(--border);
      border-radius: var(--radius-round);
      text-align: start;
      &.is-active {
        background-color: var(--text);
        color: var(--background);
      }
    }
  }

  .tabs_wrap.auto:not(.side) {
    & .tabs_link.is-active {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        inset-inline: 0;
        bottom: calc(var(--border-width) * -1);
        height: var(--border-width);
        background-color: var(--text);
        transform-origin: left;
        scale: 0 1;
      }
    }
    &.running:not(.is-paused) .tabs_link.is-active {
      border-bottom-color: var(--border);
      &::after {
        animation: tabs-progress var(--_interval) linear forwards;
      }
    }
  }

  @keyframes tabs-progress {
    from { scale: 0 1; }
    to { scale: 1 1; }
  }

  .tabs_panels {
    display: grid;
    min-width: 0;
    overflow: clip;
  }

  .tabs_panels > * {
    grid-area: 1 / 1;
    min-width: 0;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity var(--open-duration) var(--open-ease),
      visibility var(--open-duration) var(--open-ease);
    .tabs_wrap:not(.is-ready) &:first-child,
    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }

  .stacki-designer .tabs_wrap.preview .tabs_panels {
    gap: var(--space-6);
    overflow: visible;
  }

  .stacki-designer .tabs_wrap.preview .tabs_panels > * {
    grid-area: auto;
    opacity: 1;
    visibility: visible;
    translate: none;
    animation: none;
  }

  .tabs_wrap.auto[data-moved] .tabs_panels > * {
    &.is-active {
      animation: tabs-in var(--_slide) var(--open-ease) both;
    }
    &.is-leaving {
      visibility: visible;
      animation: tabs-out var(--_slide) var(--open-ease) both;
    }
  }

  @keyframes tabs-in {
    from { translate: calc(var(--_dir) * 100%) 0; opacity: 0; }
    to { translate: 0 0; opacity: 1; }
  }

  @keyframes tabs-out {
    from { translate: 0 0; opacity: 1; }
    to { translate: calc(var(--_dir) * -100%) 0; opacity: 0; }
  }

  .tabs_controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .tabs_steps {
    display: flex;
    gap: var(--space-2);
  }
}
`;
