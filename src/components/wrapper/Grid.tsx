import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx, vars } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Base = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  class?: string;
  children?: ReactNode;
};

type Props = Base &
  (
    | {
        /** Grid mode. */
        variant?: "columns";
        /**
         * Columns below 30rem. Defaults to `1`.
         *
         * @min 1
         * @max 12
         * @int
         */
        xsmall?: number;
        /**
         * Columns from 30rem. Inherits `xsmall`.
         *
         * @min 1
         * @max 12
         * @int
         */
        small?: number;
        /**
         * Columns from 48rem. Inherits `small`.
         *
         * @min 1
         * @max 12
         * @int
         */
        medium?: number;
        /**
         * Columns from 64rem. Inherits `medium`.
         *
         * @min 1
         * @max 12
         * @int
         */
        large?: number;
        maxColumnCount?: never;
        minColumnWidth?: never;
      }
    | {
        variant: "autofit" | "autofill";
        /**
         * Maximum columns. Defaults to `12`.
         *
         * @min 1
         * @max 12
         * @int
         */
        maxColumnCount?: number;
        /** Minimum column width in rem. Defaults to `12`.
         *
         * @min 1 */
        minColumnWidth?: number;
        xsmall?: never;
        small?: never;
        medium?: never;
        large?: never;
      }
  );

type AllProps = Base & {
  variant?: "columns" | "autofit" | "autofill";
  xsmall?: number;
  small?: number;
  medium?: number;
  large?: number;
  maxColumnCount?: number;
  minColumnWidth?: number;
};

export default function Grid(props: Props) {
  const {
    render = true,
    variant = "columns",
    xsmall = 1,
    small,
    medium,
    large,
    maxColumnCount,
    minColumnWidth,
    class: className,
    children,
    style,
    ...rest
  } = props as AllProps;

  const validMinColumnWidth =
    minColumnWidth !== undefined && Number.isFinite(minColumnWidth) && minColumnWidth > 0;

  if (isDev && minColumnWidth !== undefined && !validMinColumnWidth) {
    console.warn(
      `[lumos] <Grid minColumnWidth={${minColumnWidth}}> must be greater than 0; the default is used instead.`,
    );
  }

  const columns =
    variant !== "columns"
      ? vars({
          "--_max-cols": maxColumnCount,
          "--_min-col-width": validMinColumnWidth ? minColumnWidth : undefined,
        })
      : vars({
          "--_cols-xs": xsmall !== 1 ? xsmall : undefined,
          "--_cols-sm": small,
          "--_cols-md": medium,
          "--_cols-lg": large,
        });

  if (!render || !hasContent(children)) return <Styles id="grid" css={css} />;

  return (
    <>
      <Styles id="grid" css={css} />
      <div
        className={cx("grid", variant !== "columns" && variant, className)}
        style={{ ...style, ...columns }}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

const css = `
@layer components {
  .grid {
    --_cols: var(--_cols-xs);
    --_cols-xs: 1;
    --_cols-sm: var(--_cols-xs);
    --_cols-md: var(--_cols-sm);
    --_cols-lg: var(--_cols-md);
    --_gap-size: var(--site-gutter);
    width: 100%;
    display: grid;
    grid-column-gap: var(--_gap-size);
    grid-row-gap: var(--_gap-size);
    grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
    @media (width >= 30rem) {
      --_cols: var(--_cols-sm);
    }
    @media (width >= 48rem) {
      --_cols: var(--_cols-md);
    }
    @media (width >= 64rem) {
      --_cols: var(--_cols-lg);
    }
    &:is(.autofit, .autofill) {
      --_max-cols: 12;
      --_min-col-width: 12;
      --_fit: calc(
        (100% - (var(--_max-cols) - 1) * var(--_gap-size)) / var(--_max-cols)
      );
      --_track: min(
        max(calc(var(--_min-col-width) * 1rem), var(--_fit)),
        100%
      );
    }
    &.autofit {
      grid-template-columns: repeat(auto-fit, minmax(var(--_track), 1fr));
    }
    &.autofill {
      grid-template-columns: repeat(auto-fill, minmax(var(--_track), 1fr));
    }
  }
}
`;
