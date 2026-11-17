"use client";

import { Children, useEffect, useId, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";
import { AccordionContext } from "@/components/interactive/accordion-context";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Keep only one item open. */
  single?: boolean;
  /** Open the first item on load. */
  openFirst?: boolean;
  /** Keep all items open in design mode. */
  preview?: boolean;
  class?: string;
  children?: ReactNode;
};

export default function Accordion({
  render = true,
  single = true,
  openFirst = false,
  preview = false,
  class: className,
  children,
  ...rest
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const group = useId();

  useEffect(() => {
    const accordion = root.current;
    if (!accordion) return;

    const sync = () => {
      const designing = document.documentElement.classList.contains("stacki-designer");
      const showAll = designing && accordion.classList.contains("preview");

      for (const item of accordion.querySelectorAll<HTMLDetailsElement>(".accordion_item")) {
        if (item.closest(".accordion_wrap") !== accordion) continue;

        if (showAll && item.hasAttribute("name")) {
          item.dataset.accordionName = item.getAttribute("name")!;
          item.removeAttribute("name");
        } else if (!showAll && item.dataset.accordionName) {
          item.setAttribute("name", item.dataset.accordionName);
          delete item.dataset.accordionName;
        }

        if (showAll || item.classList.contains("stacki-opened")) item.open = true;
      }
    };

    sync();
    const watcher = new MutationObserver(sync);
    const settings = { attributes: true, attributeFilter: ["class"] };
    watcher.observe(document.documentElement, settings);
    watcher.observe(accordion, { ...settings, subtree: true });
    return () => watcher.disconnect();
  }, []);

  if (!render || !hasContent(children)) return <Styles id="accordion" css={css} />;

  const items = Children.toArray(children);

  return (
    <>
      <Styles id="accordion" css={css} />
      <div
        ref={root}
        className={cx("accordion_wrap", single && "single", preview && "preview", className)}
        {...rest}
      >
        {items.map((child, index) => (
          <AccordionContext.Provider
            key={index}
            value={{ name: single ? group : undefined, open: openFirst && index === 0 }}
          >
            {child}
          </AccordionContext.Provider>
        ))}
      </div>
    </>
  );
}

const css = `
@layer components {
  .accordion_wrap {
    width: 100%;
  }
}
`;
