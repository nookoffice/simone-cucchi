import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";

type HeadingStyle =
  | "inherit"
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "large"
  | "main"
  | "small";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = Omit<ComponentPropsWithoutRef<"h2">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Heading level. */
  tag?: Tag;
  /** Type style. */
  variant?: HeadingStyle;
  /**
   * Maximum line length in characters.
   *
   * @min 1
   * @int
   */
  maxWidth?: number;
  class?: string;
  children?: ReactNode;
};

export default function Heading({
  render = true,
  tag: Tag = "h2",
  variant,
  maxWidth,
  class: className,
  children,
  style,
  ...rest
}: Props) {
  const styleName = variant ?? Tag;
  if (!render || !hasContent(children)) return null;

  const html = typeof children === "string" && /[<&]/.test(children) ? children : null;

  return (
    <Tag
      className={cx("heading", styleName !== "inherit" && `text-style-${styleName}`, className)}
      style={{ ...style, ...(maxWidth ? { ["--_mw" as string]: `${maxWidth}ch` } : {}) }}
      {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}
      {...rest}
    >
      {html ? undefined : children}
    </Tag>
  );
}
