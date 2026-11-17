import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** HTML element. */
  tag?: Tag;
  /** Eyebrow style. */
  variant?: "default" | "tag";
  class?: string;
  children?: ReactNode;
};

export default function Eyebrow({
  render = true,
  tag: Tag = "p",
  variant = "default",
  class: className,
  children,
  ...rest
}: Props) {
  if (!render || !hasContent(children)) return null;

  const html = typeof children === "string" && /[<&]/.test(children) ? children : null;

  return (
    <>
      <Styles id="eyebrow" css={css} />
      <div className={cx("eyebrow_wrap", variant !== "default" && variant, className)} {...rest}>
        {variant === "default" && <span className="eyebrow_marker" aria-hidden="true" />}
        <Tag
          className="eyebrow_text text-style-small"
          {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}
        >
          {html ? undefined : children}
        </Tag>
      </div>
    </>
  );
}

const css = `
@layer components {
  .eyebrow_wrap {
    display: inline-flex;
    align-items: center;
    justify-content: var(--_alignment, start);
    gap: var(--space-2);

    &.tag {
      background-color: var(--text);
      color: var(--background);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-small);
    }
    .eyebrow_marker {
      flex: none;
      width: var(--border-width);
      height: 0.75rem;
      background-color: currentcolor;
    }
  }
}
`;
