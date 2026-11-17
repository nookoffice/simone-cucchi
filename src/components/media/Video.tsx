import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cx } from "@/utils/cx";
import { isDev } from "@/utils/dev";

type VideoRatio = "2-1" | "16-9" | "3-2" | "5-4" | "1-1" | "4-5" | "2-3";

type Head = Omit<
  ComponentPropsWithoutRef<"video">,
  "className" | "src" | "poster" | "loop" | "autoPlay" | "muted"
> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Video URL. Omit to render nothing. */
  src?: string;
  /** Poster image URL. */
  poster?: string;
};

type Tail = {
  /** Restart after playback. */
  loop?: boolean;
  /** Start automatically. Requires `muted`. */
  autoplay?: boolean;
  /** Mute audio. */
  muted?: boolean;
  /** Fit without cropping and remove the skeleton tint. */
  transparent?: boolean;
};

type Props = Head &
  (
    | {
        /** Aspect ratio. */
        variant?: VideoRatio;
        ratio?: never;
      }
    | {
        variant: "custom";
        /** CSS `aspect-ratio` value. */
        ratio?: string;
      }
    | {
        variant: "auto";
        ratio?: never;
      }
  ) &
  Tail & { class?: string };

type AllProps = Head &
  Tail & {
    variant?: VideoRatio | "custom" | "auto";
    ratio?: string;
    class?: string;
  };

export default function Video(props: Props) {
  const {
    render = true,
    src,
    poster,
    variant = "16-9",
    ratio,
    loop = true,
    autoplay = true,
    muted = true,
    transparent = false,
    class: className,
    style,
    ...rest
  } = props as AllProps;

  if (isDev && render) {
    if (!src) {
      console.warn("[lumos] <Video> rendered without a `src`; nothing was output.");
    }
    if (autoplay && !muted) {
      console.warn(
        "[lumos] <Video autoplay> without `muted` is blocked by every major browser. Set muted, or drop autoplay and let the viewer start it.",
      );
    }
    if (variant === "custom" && !ratio) {
      console.warn(
        '[lumos] <Video variant="custom"> has no `ratio`, so no aspect ratio is applied. Set one, or pick a preset variant.',
      );
    }
  }

  if (!render || !src) return null;

  const isCustom = variant === "custom";

  return (
    <video
      src={src}
      poster={poster}
      className={cx("video", !isCustom && `ratio-${variant}`, transparent && "transparent", className)}
      style={
        isCustom && ratio
          ? ({ ...style, aspectRatio: ratio } as CSSProperties)
          : style
      }
      loop={loop}
      autoPlay={autoplay}
      muted={muted}
      playsInline
      {...rest}
    />
  );
}
