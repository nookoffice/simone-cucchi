import type { ReactNode, SVGProps } from "react";
import { cx } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import { Styles } from "@/utils/styles";

export type SvgSource = (props: SVGProps<SVGSVGElement>) => ReactNode;

type Props = SVGProps<SVGSVGElement> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Imported SVG. Omit to render nothing. */
  src?: SvgSource;
  /** Icon size. */
  variant?: "small" | "medium" | "large" | "full-width";
  class?: string;
};

export default function Icon({
  render = true,
  src: Svg,
  variant = "medium",
  class: className,
  className: classNameProp,
  ...rest
}: Props) {
  const labelled = Boolean(rest["aria-label"] ?? rest["aria-labelledby"]);

  if (isDev && render && !Svg) {
    console.warn("[lumos] <Icon> rendered without a `src`; nothing was output.");
  }

  return (
    <>
      <Styles id="icon" css={css} />
      {render && Svg && (
        <Svg
          className={cx("icon", variant, className, classNameProp)}
          aria-hidden={labelled ? undefined : true}
          {...rest}
        />
      )}
    </>
  );
}

const css = `
@layer components {
  .icon {
    --_size: 1.5em;
    flex: none;
    display: block;
    width: var(--_size);
    height: auto;
    aspect-ratio: 1 / 1;
    max-width: 100%;

    &.small {
      --_size: 1em;
    }

    &.large {
      --_size: 2em;
    }

    &.full-width {
      width: 100%;
      aspect-ratio: unset;
    }
  }
}
`;
