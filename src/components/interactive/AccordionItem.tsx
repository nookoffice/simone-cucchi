"use client";

import { useContext, useLayoutEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Heading from "@/components/typography/Heading";
import Icon from "@/components/media/Icon";
import arrow from "@/assets/icons/arrow.svg";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";
import { AccordionContext } from "@/components/interactive/accordion-context";

type Props = Omit<ComponentPropsWithoutRef<"details">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Item heading. */
  heading?: string;
  /** Heading level. */
  headingTag?: "h2" | "h3" | "h4" | "h5" | "h6";
  /** Open on load. */
  open?: boolean;
  class?: string;
  children?: ReactNode;
};

export default function AccordionItem({
  render = true,
  heading,
  headingTag = "h3",
  open = false,
  class: className,
  children,
  ...rest
}: Props) {
  const group = useContext(AccordionContext);
  const details = useRef<HTMLDetailsElement>(null);
  const startOpen = open || group.open;

  useLayoutEffect(() => {
    if (details.current && startOpen) details.current.open = true;
  }, [startOpen]);

  if (!render || !heading || !hasContent(children)) return <Styles id="accordion-item" css={css} />;

  return (
    <>
      <Styles id="accordion-item" css={css} />
      <details ref={details} className={cx("accordion_item", className)} name={group.name} {...rest}>
        <summary className="accordion_toggle">
          <Heading tag={headingTag} variant="h5" class="accordion_title">
            {heading}
          </Heading>
          <Icon class="accordion_icon" src={arrow} variant="small" />
        </summary>
        <div className="accordion_body margin-trim">{children}</div>
      </details>
    </>
  );
}

const css = `
@layer components {
  .accordion_item {
    interpolate-size: allow-keywords;
    border-bottom: var(--border-width) solid var(--border);
    transition: border-color var(--hover-duration) var(--hover-ease);
    @media (hover: hover) {
      &:hover {
        border-bottom-color: currentcolor;
      }
    }
  }

  .accordion_toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-block: var(--space-5);
    list-style: none;
    cursor: pointer;
    &::-webkit-details-marker {
      display: none;
    }
  }

  .accordion_title {
    margin-block: 0;
  }

  .accordion_icon {
    rotate: 90deg;
    transition: rotate var(--open-duration) var(--open-ease);
  }

  .accordion_item:is([open], .stacki-opened) .accordion_icon,
  .stacki-designer .accordion_wrap.preview .accordion_icon {
    rotate: -90deg;
  }

  .accordion_item::details-content {
    block-size: 0;
    overflow: hidden;
    content-visibility: hidden;
  }

  @supports (interpolate-size: allow-keywords) {
    .accordion_item::details-content {
      transition:
        block-size var(--open-duration) var(--open-ease),
        content-visibility var(--open-duration) var(--open-ease)
          allow-discrete;
    }
  }

  .accordion_item:is([open], .stacki-opened)::details-content,
  .stacki-designer .accordion_wrap.preview .accordion_item::details-content {
    block-size: auto;
    content-visibility: visible;
  }

  .accordion_body {
    padding-bottom: var(--space-5);
  }
}
`;
