import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";

type SectionSpace = "none" | "even" | "small" | "medium" | "large" | "navoverlap";

type ContainerGap =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "small"
  | "medium"
  | "large";

type Props = Omit<ComponentPropsWithoutRef<"section">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Color theme of element and its children. */
  theme?: "inherit" | "light" | "dark" | "brand";
  /** Top padding. */
  paddingTop?: SectionSpace;
  /** Bottom padding. */
  paddingBottom?: SectionSpace;
  /** Child gap. */
  gap?: ContainerGap;
  /** Content alignment. */
  align?: "start" | "center" | "end";
  /** Fill the viewport height. */
  fullHeight?: boolean;
  /** Inner container classes. */
  containerClass?: string;
  /** Inner container attributes. */
  containerAttrs?: Omit<ComponentPropsWithoutRef<"div">, "className"> & { class?: string };
  /** Full-bleed background. */
  background?: ReactNode;
  class?: string;
  children?: ReactNode;
};

const padSuffix: Partial<Record<SectionSpace, string>> = {
  none: "0",
  even: "sitemargin",
};

const padClass = (side: "top" | "bottom", value: SectionSpace) =>
  !!value && value !== "medium" && `padding-${side}-${padSuffix[value] ?? value}`;

export default function Section({
  render = true,
  theme = "inherit",
  paddingTop = "medium",
  paddingBottom = "medium",
  gap = "8",
  align,
  fullHeight = false,
  containerClass,
  containerAttrs = {},
  background,
  class: className,
  children,
  ...rest
}: Props) {
  const { class: containerAttrsClass, ...containerRest } = containerAttrs;
  const content = hasContent(children);
  const backdrop = hasContent(background);
  if (!render || (!content && !backdrop)) return null;

  return (
    <section
      className={cx(
        "section",
        padClass("top", paddingTop),
        padClass("bottom", paddingBottom),
        fullHeight && "min-height-screen",
        theme !== "inherit" && `theme-${theme}`,
        align && `alignment-${align}`,
        className,
      )}
      {...rest}
    >
      {background}
      {content && (
        <div
          className={cx("container", gap !== "8" && `gap-${gap}`, containerClass, containerAttrsClass)}
          {...containerRest}
        >
          {children}
        </div>
      )}
    </section>
  );
}
