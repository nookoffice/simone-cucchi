import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type RichTextStyle =
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

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Type style. */
  variant?: RichTextStyle;
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

export default function RichText({
  render = true,
  variant = "inherit",
  maxWidth,
  class: className,
  children,
  style,
  ...rest
}: Props) {
  if (!render || !hasContent(children)) return null;

  const vars = {
    ...style,
    ...(maxWidth ? { ["--_mw" as string]: `${maxWidth}ch` } : {}),
  } as CSSProperties;

  return (
    <>
      <Styles id="rich-text" css={css} />
      <div
        className={cx("text", "rich-text", variant !== "inherit" && `text-style-${variant}`, className)}
        style={vars}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

const css = `
@layer components {
  .rich-text {
    & :is(h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, figure, pre, table) {
      margin-top: var(--_margin-top);
      margin-bottom: var(--_margin-bottom);
    }

    & > :first-child,
    & :is(blockquote, li) > :first-child:not(:is(ul, ol)) {
      margin-top: 0;
    }
    & > :last-child,
    & :is(blockquote, li) > :last-child {
      margin-bottom: 0;
    }

    & :is(ul, ol) {
      padding-left: 1.5em;
    }
    & ul {
      list-style-type: disc;
    }
    & ul ul {
      list-style-type: circle;
    }
    & ul ul ul {
      list-style-type: square;
    }
    & ol {
      list-style-type: decimal;
    }
    & li::marker {
      color: color-mix(in lab, currentcolor 60%, transparent);
    }
    & li + li {
      margin-top: var(--space-2);
    }

    & li > :is(ul, ol) {
      margin-block: var(--space-2);
    }

    & blockquote {
      padding-left: var(--space-4);
      border-left: var(--border-width) solid var(--border);
    }
  }
}
`;
