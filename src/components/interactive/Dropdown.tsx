"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Icon from "@/components/media/Icon";
import arrow from "@/assets/icons/arrow.svg";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"details">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Trigger text. */
  label?: string;
  /** Keep the panel open in design mode. */
  preview?: boolean;
  class?: string;
  children?: ReactNode;
};

export default function Dropdown({
  render = true,
  label,
  preview = false,
  class: className,
  children,
  ...rest
}: Props) {
  const root = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const dropdown = root.current;
    const summary = dropdown?.querySelector<HTMLElement>(".dropdown_toggle");
    const content = dropdown?.querySelector<HTMLElement>(".dropdown_content");
    if (!dropdown || !summary || !content) return;

    const onKey = (event: KeyboardEvent) => {
      if (!dropdown.open) return;
      if (event.key === "Escape") {
        dropdown.open = false;
        summary.focus();
        return;
      }
      const forward = event.key === "ArrowDown";
      if (!forward && event.key !== "ArrowUp") return;
      if (!dropdown.contains(document.activeElement)) return;
      const items = [...content.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)")];
      if (items.length === 0) return;
      event.preventDefault();
      const from = items.indexOf(document.activeElement as HTMLElement);
      const step = forward ? 1 : -1;
      const next =
        from === -1 ? (forward ? 0 : items.length - 1) : (from + step + items.length) % items.length;
      items[next].focus();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!dropdown.open || !(target instanceof Node)) return;
      if (!dropdown.contains(target)) dropdown.open = false;
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!render || !label || !hasContent(children)) return <Styles id="dropdown" css={css} />;

  return (
    <>
      <Styles id="dropdown" css={css} />
      <details ref={root} className={cx("dropdown_wrap", preview && "preview", className)} {...rest}>
        <summary className="dropdown_toggle">
          <span className="dropdown_label text-style-trim">{label}</span>
          <Icon class="dropdown_icon" src={arrow} variant="small" />
        </summary>
        <div className="dropdown_content">
          <div className="dropdown_body margin-trim">{children}</div>
        </div>
      </details>
    </>
  );
}

const css = `
@layer components {
  .dropdown_wrap {
    --_control-pad: 0.75em;
    --_leaving: calc(var(--open-duration) * 0.7);
    position: relative;
    z-index: 10;
    display: inline-block;
  }

  .dropdown_toggle {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: var(--_control-pad) 0;
    color: inherit;
    list-style: none;
    cursor: pointer;
    transition: color var(--hover-duration) var(--hover-ease);
    &::-webkit-details-marker {
      display: none;
    }
    @media (hover: hover) {
      &:hover {
        color: color-mix(in lab, currentcolor 60%, transparent);
      }
    }
  }

  .dropdown_icon {
    flex: none;
    rotate: 90deg;
    transition: rotate var(--open-duration) var(--open-ease);
  }

  .dropdown_wrap:is([open], .stacki-opened) .dropdown_icon,
  .stacki-designer .dropdown_wrap.preview .dropdown_icon {
    rotate: -90deg;
  }

  .dropdown_wrap::details-content {
    opacity: 0;
    content-visibility: hidden;
    transition:
      opacity var(--_leaving) var(--open-ease),
      content-visibility var(--_leaving) var(--open-ease) allow-discrete;
  }

  .dropdown_wrap:is([open], .stacki-opened)::details-content,
  .stacki-designer .dropdown_wrap.preview::details-content {
    opacity: 1;
    content-visibility: visible;
    transition:
      opacity var(--open-duration) var(--open-ease),
      content-visibility var(--open-duration) var(--open-ease) allow-discrete;
  }

  .dropdown_content {
    position: absolute;
    top: calc(100% - var(--_control-pad) + var(--space-2));
    inset-inline-start: 0;
    width: max-content;
    min-width: 100%;
    max-width: min(22rem, calc(100vw - var(--site-margin) * 2));
    background-color: var(--background-2);
    border-radius: var(--radius-small);
    transform-origin: top left;
    translate: 0 -0.5rem;
    scale: 0.98;
    transition:
      translate var(--_leaving) var(--open-ease),
      scale var(--_leaving) var(--open-ease);
  }

  .dropdown_wrap:is([open], .stacki-opened) .dropdown_content,
  .stacki-designer .dropdown_wrap.preview .dropdown_content {
    translate: 0 0;
    scale: 1;
    transition:
      translate var(--open-duration) var(--open-ease),
      scale var(--open-duration) var(--open-ease);
  }

  .dropdown_body {
    padding: var(--space-5);
  }
}
`;
