"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import Button from "@/components/Button";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Accessible label. Defaults to `Marquee`. */
  label?: string;
  /** Travel direction. */
  direction?: "forwards" | "backwards";
  class?: string;
  children?: ReactNode;
};

export default function Marquee({
  render = true,
  label = "Marquee",
  direction = "forwards",
  class: className,
  children,
  style,
  ...rest
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children).filter((child) =>
    typeof child === "string" ? child.trim().length > 0 : child != null,
  );

  useEffect(() => {
    const marquee = root.current;
    const toggle = marquee?.querySelector<HTMLButtonElement>("[data-marquee-toggle]");
    if (!marquee || !toggle) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const setPlaying = (playing: boolean) => {
      marquee.dataset.state = playing ? "playing" : "paused";
      toggle.setAttribute("aria-pressed", String(playing));
      toggle.setAttribute("aria-label", playing ? "Pause" : "Play");
    };
    const onMotion = () => setPlaying(!reduced.matches);
    const onToggle = () => setPlaying(marquee.dataset.state !== "playing");

    setPlaying(!reduced.matches);
    reduced.addEventListener("change", onMotion);
    toggle.addEventListener("click", onToggle);
    return () => {
      reduced.removeEventListener("change", onMotion);
      toggle.removeEventListener("click", onToggle);
    };
  }, []);

  if (!render || !hasContent(children)) return <Styles id="marquee" css={css} />;

  const copy = items.map((child, index) =>
    isValidElement(child) ? cloneElement(child, { key: `loop-${index}` }) : child,
  );

  return (
    <>
      <Styles id="marquee" css={css} />
      <div
        ref={root}
        className={cx("marquee_wrap", direction !== "forwards" && direction, className)}
        style={{ ...style, ["--_count" as string]: String(items.length || 1) } as CSSProperties}
        role="group"
        aria-label={label}
        {...rest}
      >
        <div className="marquee_viewport">
          <div className="marquee_track">
            <div className="marquee_panel">{items}</div>
            <div className="marquee_panel" aria-hidden="true" inert>
              {copy}
            </div>
          </div>
        </div>
        <Button
          variant="play"
          emphasis="secondary"
          pressed={true}
          class="marquee_toggle"
          data-marquee-toggle
        />
      </div>
    </>
  );
}

const css = `
@layer components {
  .marquee_wrap {
    --_gap-size: var(--space-6);
    --_item-height: 3rem;
    --_speed: 4s;
    --_count: 1;
    --_duration: calc(var(--_count) * var(--_speed));
    display: flex;
    align-items: center;
    gap: var(--space-4);
    width: 100%;
  }

  .marquee_viewport {
    flex: 1 1 auto;
    min-width: 0;
    overflow: clip;
    container-type: inline-size;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 3%,
      black 97%,
      transparent
    );
  }

  .marquee_track {
    display: flex;
    width: max-content;
    align-items: center;
    gap: var(--_gap-size);
    animation: marquee var(--_duration) linear infinite;

    .marquee_wrap.backwards & {
      animation-direction: reverse;
    }

    &:focus-within,
    .marquee_wrap[data-state="paused"] & {
      animation-play-state: paused;
    }
  }

  .marquee_panel {
    display: flex;
    flex: none;
    min-width: 100cqw;
    justify-content: space-around;
    align-items: center;
    gap: var(--_gap-size);

    > * {
      flex: none;
      margin-block: 0;
    }

    > :is(.image, .video) {
      width: auto;
      height: var(--_item-height);
    }
  }

  .marquee_toggle {
    flex: none;
  }

  @keyframes marquee {
    to {
      translate: calc(-50% - var(--_gap-size) / 2) 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee_track {
      animation-name: none;
    }

    .marquee_wrap[data-state="playing"] .marquee_track {
      animation-name: marquee;
      animation-duration: var(--_duration) !important;
    }
  }
}
`;
