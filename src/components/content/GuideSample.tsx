import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx, vars } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Sample = "swatch" | "space" | "radius" | "column" | "theme" | "type";

type TextStyle =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "lead"
  | "large"
  | "main"
  | "small";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className" | "children"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Sample name. */
  name: string;
  /** What the sample shows. */
  variant?: Sample;
  /** CSS value painted on the sample, usually a token such as `var(--light-100)`. */
  token?: string;
  /** Written value beside the name, such as a hex or a size range. */
  value?: string;
  /** Theme applied to the panel. */
  theme?: "light" | "dark" | "brand";
  /** Type style for a type sample. */
  textStyle?: TextStyle;
  class?: string;
  children?: ReactNode;
};

export default function GuideSample({
  render = true,
  name,
  variant = "swatch",
  token,
  value,
  theme,
  textStyle,
  class: className,
  children,
  style,
  ...rest
}: Props) {
  if (!render || !hasContent(name)) return null;

  const needsToken = variant === "swatch" || variant === "space" || variant === "radius";
  if (needsToken && !token) {
    if (isDev) console.warn(`[lumos] <GuideSample variant="${variant}"> needs a token.`);
    return null;
  }
  if (variant === "theme" && !theme) {
    if (isDev) console.warn(`[lumos] <GuideSample variant="theme"> needs a theme.`);
    return null;
  }
  if (variant === "type" && (!textStyle || !hasContent(children))) {
    if (isDev) console.warn(`[lumos] <GuideSample variant="type"> needs a textStyle and sample text.`);
    return null;
  }

  return (
    <>
      <Styles id="guide-sample" css={css} />
      <div className={cx("guide-sample_wrap", variant, className)} style={style} {...rest}>
        {variant === "theme" ? (
          <div className={cx("guide-sample_panel", `theme-${theme}`)}>
            <h3 className="heading text-style-h4 margin-block-0">{name}</h3>
            {children}
          </div>
        ) : variant === "type" ? (
          <>
            <p className="guide-sample_meta text-style-small">
              <span className="guide-sample_name">{name}</span>
            </p>
            <p className={cx("text", "guide-sample_type", `text-style-${textStyle}`, "margin-block-0")}>
              {children}
            </p>
          </>
        ) : (
          <>
            <div
              className="guide-sample_chip"
              style={token ? vars({ "--_sample": token }) : undefined}
              aria-hidden={variant === "column" ? undefined : true}
            >
              {variant === "column" ? <span className="text-style-small">{name}</span> : null}
            </div>
            {variant !== "column" ? (
              <p className="guide-sample_meta text-style-small">
                <span className="guide-sample_name">{name}</span>
                {value ? <span className="guide-sample_value">{value}</span> : null}
              </p>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}

const css = `
@layer components {
  .guide-sample_wrap {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
    min-width: 0;
    height: 100%;
  }

  .guide-sample_chip {
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius-small);
    background: var(--_sample, var(--background-3));
    min-height: 5rem;
  }

  .guide-sample_wrap.space .guide-sample_chip {
    min-height: 0;
    height: var(--_sample);
    background: var(--text);
    border: 0;
  }

  .guide-sample_wrap.radius {
    align-items: flex-start;
  }

  .guide-sample_wrap.radius .guide-sample_chip {
    width: 5rem;
    height: 5rem;
    min-height: 0;
    background: var(--background-3);
    border-radius: var(--_sample);
  }

  .guide-sample_wrap.column .guide-sample_chip {
    display: grid;
    place-items: center;
    min-height: 4rem;
    background: var(--background-3);
    color: var(--text);
  }

  .guide-sample_meta {
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--space-3);
    row-gap: var(--space-1);
    justify-content: space-between;
    margin: 0;
    color: var(--text-2);
  }

  .guide-sample_name {
    color: var(--text);
  }

  .guide-sample_type {
    margin: 0;
  }

  .guide-sample_panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--space-5);
    padding: var(--space-6);
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius-main);
    background: var(--background);
    color: var(--text);
  }

  .guide-sample_panel > * {
    margin-block: 0;
  }
}
`;
