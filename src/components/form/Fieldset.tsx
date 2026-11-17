import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"fieldset">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Field group label. */
  legend?: string;
  /** Field layout. */
  variant?: "stack" | "columns" | "thirds" | "inline";
  /** Legend style. */
  legendStyle?: "heading" | "label" | "hidden";
  class?: string;
  children?: ReactNode;
};

const LEGEND_STYLES: Record<NonNullable<Props["legendStyle"]>, string> = {
  heading: "text-style-h5",
  label: "field-label text-style-main",
  hidden: "sr-only",
};

export default function Fieldset({
  render = true,
  legend,
  variant = "stack",
  legendStyle = "heading",
  class: className,
  children,
  ...rest
}: Props) {
  if (!render || !legend || !hasContent(children)) return <Styles id="fieldset" css={css} />;

  return (
    <>
      <Styles id="fieldset" css={css} />
      <fieldset className={cx("form-fieldset", variant !== "stack" && variant, className)} {...rest}>
        <legend
          className={cx(
            "form-fieldset_legend",
            `form-fieldset_legend-${legendStyle}`,
            LEGEND_STYLES[legendStyle],
          )}
        >
          {legend}
        </legend>
        <div className="form-fieldset_fields">{children}</div>
      </fieldset>
    </>
  );
}

const css = `
@layer components {
  .form-fieldset {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
  }

  .form-fieldset_legend {
    padding: 0;
    margin-bottom: var(--space-2);
  }

  .form-fieldset_legend-heading {
    margin-bottom: var(--space-3);
  }

  .form-fieldset_fields {
    display: grid;
    gap: var(--space-5);

    .form-fieldset.inline & {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3) var(--space-5);
      > * {
        width: auto;
      }
    }

    @media (width >= 48rem) {
      .form-fieldset.columns & {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .form-fieldset.thirds & {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  }
}
`;
