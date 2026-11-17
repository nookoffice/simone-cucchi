import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";

type ParagraphStyle =
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

type Tag = "p" | "span" | "div";

type Props = Omit<ComponentPropsWithoutRef<"p">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** HTML element. */
  tag?: Tag;
  /** Type style. */
  variant?: ParagraphStyle;
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

export default function Paragraph({
  render = true,
  tag: Tag = "p",
  variant = "inherit",
  maxWidth,
  class: className,
  children,
  style,
  ...rest
}: Props) {
  if (!render || !hasContent(children)) return null;

  const html = typeof children === "string" && /[<&]/.test(children) ? children : null;
  const vars = {
    ...style,
    ...(maxWidth ? { ["--_mw" as string]: `${maxWidth}ch` } : {}),
  } as CSSProperties;

  return (
    <Tag
      className={cx("text", variant !== "inherit" && `text-style-${variant}`, className)}
      style={vars}
      {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}
      {...rest}
    >
      {html ? undefined : children}
    </Tag>
  );
}
