import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cx } from "@/utils/cx";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Overlay style. */
  variant?: "solid" | "gradient";
  /**
   * Tint strength as a percentage.
   *
   * @min 0
   * @max 100
   * @int
   */
  strength?: number;
  class?: string;
};

export default function Overlay({
  render = true,
  variant = "solid",
  strength = 50,
  class: className,
  style,
  ...rest
}: Props) {
  if (!render) return <Styles id="overlay" css={css} />;

  return (
    <>
      <Styles id="overlay" css={css} />
      <div
        className={cx("overlay", variant !== "solid" && variant, className)}
        style={{ ...style, ["--_strength" as string]: String(strength) } as CSSProperties}
        {...rest}
      />
    </>
  );
}

const css = `
@layer components {
  .overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: color-mix(
      in srgb,
      black calc(var(--_strength, 50) / 100 * 80%),
      transparent
    );

    &.gradient {
      background-color: color-mix(
        in srgb,
        black calc(var(--_strength, 50) / 100 * 60%),
        transparent
      );
      background-image: linear-gradient(
        to bottom,
        transparent,
        color-mix(
            in srgb,
            black calc(var(--_strength, 50) / 100 * 62%),
            transparent
          )
          84%
      );
    }
  }
}
`;
