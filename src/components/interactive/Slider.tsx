"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Button from "@/components/Button";
import { cx, vars } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Accessible label. Defaults to `Slider`. */
  label?: string;
  /** Slider bounds. */
  variant?: "bleed" | "crop-start" | "contained";
  /** Slides shown below 30rem. Defaults to `1.02`.
   *
   * @min 1
   * @max 12 */
  xsmall?: number;
  /** Slides shown from 30rem. Inherits `xsmall`.
   *
   * @min 1
   * @max 12 */
  small?: number;
  /** Slides shown from 48rem. Inherits `small`.
   *
   * @min 1
   * @max 12 */
  medium?: number;
  /** Slides shown from 64rem. Inherits `medium`.
   *
   * @min 1
   * @max 12 */
  large?: number;
  class?: string;
  children?: ReactNode;
};

const THRESHOLD = 4;

export default function Slider({
  render = true,
  label = "Slider",
  variant = "bleed",
  xsmall = 1.02,
  small,
  medium,
  large,
  class: className,
  children,
  style,
  ...rest
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const counts = { xs: xsmall, sm: small, md: medium, lg: large };
  const invalid = Object.entries(counts).filter(
    ([, count]) => count !== undefined && !(Number.isFinite(count) && count > 0),
  );

  if (isDev && invalid.length) {
    console.warn(
      `[lumos] <Slider> ignores ${invalid.map(([size]) => size).join(", ")}: slides in view must be greater than 0.`,
    );
  }

  const set = (count: number | undefined) => count !== undefined && Number.isFinite(count) && count > 0;
  const visible = vars({
    "--_visible-xs": xsmall !== 1.02 && set(xsmall) ? xsmall : undefined,
    "--_visible-sm": set(small) ? small : undefined,
    "--_visible-md": set(medium) ? medium : undefined,
    "--_visible-lg": set(large) ? large : undefined,
  });

  useEffect(() => {
    const slider = root.current;
    const list = slider?.querySelector<HTMLElement>(".slider_list");
    const markers = slider?.querySelector<HTMLElement>(".slider_markers");
    const controls = slider?.querySelector<HTMLElement>(".slider_controls");
    const steps = [...(slider?.querySelectorAll<HTMLButtonElement>("[data-step]") ?? [])];
    if (!slider || !list) return;

    const slides = [...list.children] as HTMLElement[];
    if (slides.length === 0) return;

    slides.forEach((slide, i) => {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
    });

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const behavior = () => (reduced.matches ? "auto" : "smooth") as ScrollBehavior;
    const stride = () => {
      const first = slides[0].getBoundingClientRect();
      if (slides.length < 2) return first.width;
      return slides[1].getBoundingClientRect().left - first.left;
    };
    const view = () => {
      const box = getComputedStyle(list);
      return list.clientWidth - parseFloat(box.paddingInlineStart) - parseFloat(box.paddingInlineEnd);
    };
    const pages = () => {
      const step = stride();
      if (step <= 0) return 1;
      return Math.max(1, slides.length - Math.round(view() / step) + 1);
    };
    const current = () => {
      const step = stride();
      return step > 0 ? Math.round(list.scrollLeft / step) : 0;
    };

    let drawn = 0;
    const markerClicks: Array<{ marker: HTMLButtonElement; onClick: () => void }> = [];

    const draw = (total: number) => {
      if (!markers) return;
      drawn = total;
      markers.replaceChildren(
        ...Array.from({ length: total }, (_, i) => {
          const marker = document.createElement("button");
          marker.type = "button";
          marker.className = "slider_marker";
          marker.setAttribute("aria-label", `Go to slide ${i + 1}`);
          const onClick = () => list.scrollTo({ left: i * stride(), behavior: behavior() });
          marker.addEventListener("click", onClick);
          markerClicks.push({ marker, onClick });
          return marker;
        }),
      );
    };

    const sync = () => {
      const total = pages();
      if (total !== drawn) draw(total);
      const end = list.scrollWidth - list.clientWidth;
      const atStart = list.scrollLeft <= 1;
      const atEnd = list.scrollLeft >= end - 1;
      for (const step of steps) step.disabled = Number(step.dataset.step) < 0 ? atStart : atEnd;
      const index = current();
      markers?.querySelectorAll(".slider_marker").forEach((marker, i) => {
        marker.classList.toggle("is-active", i === index);
        if (i === index) marker.setAttribute("aria-current", "true");
        else marker.removeAttribute("aria-current");
      });
      controls?.classList.toggle("is-empty", end <= 1);
    };

    const onStep = (event: Event) => {
      const step = event.currentTarget as HTMLButtonElement;
      list.scrollBy({ left: Number(step.dataset.step) * stride(), behavior: behavior() });
    };
    for (const step of steps) step.addEventListener("click", onStep);

    let origin = 0;
    let from = 0;
    let pressed = false;
    let dragged = false;
    const restore = () => {
      if (!pressed) list.classList.remove("is-dragging");
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (list.scrollWidth <= list.clientWidth) return;
      pressed = true;
      dragged = false;
      origin = event.clientX;
      from = list.scrollLeft;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pressed) return;
      const shift = event.clientX - origin;
      if (!dragged) {
        if (Math.abs(shift) < THRESHOLD) return;
        dragged = true;
        list.setPointerCapture(event.pointerId);
        list.classList.add("is-dragging");
      }
      list.scrollLeft = from - shift;
    };
    const release = () => {
      if (!pressed) return;
      pressed = false;
      const step = stride();
      if (dragged && step > 0) {
        list.scrollTo({ left: Math.round(list.scrollLeft / step) * step, behavior: behavior() });
      }
      list.addEventListener("scrollend", restore, { once: true });
      setTimeout(restore, 400);
    };
    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };

    list.addEventListener("pointerdown", onPointerDown);
    list.addEventListener("pointermove", onPointerMove);
    list.addEventListener("pointerup", release);
    list.addEventListener("pointercancel", release);
    list.addEventListener("dragstart", (event) => event.preventDefault());
    list.addEventListener("click", onClickCapture, true);
    list.addEventListener("scroll", onScroll, { passive: true });

    slider.classList.add("is-ready");
    const resize = new ResizeObserver(sync);
    resize.observe(list);
    const onLoad = () => sync();
    addEventListener("load", onLoad);
    sync();

    return () => {
      for (const step of steps) step.removeEventListener("click", onStep);
      for (const { marker, onClick } of markerClicks) marker.removeEventListener("click", onClick);
      list.removeEventListener("pointerdown", onPointerDown);
      list.removeEventListener("pointermove", onPointerMove);
      list.removeEventListener("pointerup", release);
      list.removeEventListener("pointercancel", release);
      list.removeEventListener("click", onClickCapture, true);
      list.removeEventListener("scroll", onScroll);
      resize.disconnect();
      removeEventListener("load", onLoad);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!render || !hasContent(children)) return <Styles id="slider" css={css} />;

  return (
    <>
      <Styles id="slider" css={css} />
      <div
        ref={root}
        className={cx("slider_wrap", variant !== "bleed" && variant, className)}
        style={{ ...style, ...visible }}
        {...rest}
      >
        <div className="slider_list" role="group" aria-label={label} tabIndex={0} data-lenis-prevent-horizontal>
          {children}
        </div>
        <div className="slider_controls">
          <div className="slider_markers" />
          <div className="slider_steps">
            <Button variant="arrow" emphasis="secondary" direction="back" label="Previous slide" data-step="-1" />
            <Button variant="arrow" emphasis="secondary" label="Next slide" data-step="1" />
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
@layer components {
  .slider_wrap {
    --_gap-size: var(--site-gutter);
    --_edge: max(var(--site-margin), (100vw - var(--max-width-main)) / 2);
    --_visible: var(--_visible-xs);
    --_visible-xs: 1.02;
    --_visible-sm: var(--_visible-xs);
    --_visible-md: var(--_visible-sm);
    --_visible-lg: var(--_visible-md);
    display: grid;
    gap: var(--space-6);
    width: 100%;

    @media (width >= 30rem) {
      --_visible: var(--_visible-sm);
    }
    @media (width >= 48rem) {
      --_visible: var(--_visible-md);
    }
    @media (width >= 64rem) {
      --_visible: var(--_visible-lg);
    }
  }

  .slider_list {
    display: flex;
    gap: var(--_gap-size);
    min-width: 0;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    cursor: grab;
    margin-inline: calc(-1 * var(--_edge));
    padding-inline: var(--_edge);
    scroll-padding-inline: var(--_edge);

    &::-webkit-scrollbar {
      display: none;
    }

    &:active {
      cursor: grabbing;
    }

    &.is-dragging {
      scroll-snap-type: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .slider_wrap:not(.is-ready) &,
    .slider_wrap:has(.slider_controls.is-empty) & {
      cursor: auto;
    }

    & > * {
      flex: 0 0
        calc(
          (100% - (var(--_visible) - 1) * var(--_gap-size)) / var(--_visible)
        );
      min-width: 0;
      scroll-snap-align: start;
    }

    .slider_wrap.crop-start & {
      margin-inline-start: 0;
      padding-inline-start: 0;
      scroll-padding-inline-start: 0;
    }

    .slider_wrap.contained & {
      margin-inline: 0;
      padding-inline: 0;
      scroll-padding-inline: 0;
    }
  }

  .slider_controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);

    .slider_wrap:not(.is-ready) &,
    &.is-empty {
      display: none;
    }
  }

  .slider_markers {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .slider_marker {
    width: 0.75rem;
    height: 0.75rem;
    padding: 0;
    border: var(--border-width) solid var(--text);
    border-radius: var(--radius-round);
    background: none;
    transition: background-color var(--hover-duration) var(--hover-ease);

    &.is-active {
      background-color: var(--text);
    }
    @media (hover: hover) {
      &:hover {
        background-color: var(--text);
      }
    }
  }

  .slider_steps {
    display: flex;
    gap: var(--space-2);
  }
}
`;
