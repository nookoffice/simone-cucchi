import { getImageProps, type StaticImageData } from "next/image";
import type { ComponentPropsWithoutRef, SVGProps } from "react";
import { cx } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import type { SvgSource } from "@/components/media/Icon";

export type ImageSource = StaticImageData | string | SvgSource;

type ImageVariant = "full-width" | "constrained" | "densities";
type ImageQuality = "low" | "mid" | "high" | "max";

type Base = Omit<
  ComponentPropsWithoutRef<"img">,
  "className" | "src" | "width" | "height" | "loading" | "fetchPriority"
> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Image source. Imports are optimized; `public/` files are served as-is. */
  src: ImageSource;
  /** Alt text. Omit for decorative images. */
  alt?: string;
  /** Image width. The other dimension is inferred.
   *
   * @min 1
   * @int */
  width?: number;
  /** Image height. The other dimension is inferred.
   *
   * @min 1
   * @int */
  height?: number;
  /** Fit without cropping and remove the skeleton tint. */
  transparent?: boolean;
  /** Loading behavior. */
  loading?: "lazy" | "eager";
  /** Fetch priority. */
  fetchPriority?: "auto" | "high" | "low";
  class?: string;
};

type Props = Base &
  (
    | {
        /** Responsive image mode. */
        variant?: "full-width";
        sizes?: never;
      }
    | {
        variant: "constrained";
        /** Responsive `sizes` value. */
        sizes?: string;
      }
    | { variant: "densities"; sizes?: never }
  ) & {
    /** Output quality. */
    quality?: ImageQuality;
  };

type AllProps = Base & {
  variant?: ImageVariant;
  sizes?: string;
  quality?: ImageQuality;
};

const QUALITY: Record<ImageQuality, number | undefined> = {
  low: 50,
  mid: 65,
  high: undefined,
  max: 90,
};

const VIEWPORT_MAX = 1440;

function isSvgComponent(src: ImageSource): src is SvgSource {
  return typeof src === "function";
}

function isStatic(src: ImageSource): src is StaticImageData {
  return typeof src === "object" && src !== null && "src" in src;
}

export default function Img(props: Props) {
  const {
    render = true,
    src,
    alt: altProp,
    variant = "full-width",
    width,
    height,
    sizes,
    quality = "high",
    transparent = false,
    loading = "lazy",
    fetchPriority = "auto",
    class: className,
    ...attrs
  } = props as AllProps;

  const alt = altProp ?? "";

  if (isDev && !src) {
    console.warn("[lumos] <Img> rendered without a `src`; nothing was output.");
  }

  if (!render || !src) return null;

  const svg = isSvgComponent(src);
  const remote = typeof src === "string" && /^https?:\/\//i.test(src);
  const publicPath = typeof src === "string" && !remote;
  const svgFile = typeof src === "string" && /\.svg(\?|#|$)/i.test(src);
  const classes = cx("image", variant === "densities" && "densities", transparent && "transparent", className);

  if (isDev && (publicPath || svg || svgFile)) {
    const inert: string[] = [];
    if ((props as AllProps).quality !== undefined) inert.push("quality");
    if (sizes !== undefined) inert.push("sizes");
    if (inert.length) {
      const why = publicPath
        ? "files in public/ are served as-is — import from src/assets to optimize"
        : "SVG sources are passed through unoptimized";
      console.warn(`[lumos] <Img> ignores ${inert.join(", ")}: ${why}.`);
    }
  }

  const staticImage = isStatic(src) ? src : undefined;
  const hasEither = width !== undefined || height !== undefined || staticImage !== undefined;

  if (isDev && !publicPath && !svg && !svgFile && variant === "densities" && !hasEither) {
    console.warn(
      `[lumos] <Img variant="densities"> has no width or height, so both densities resolve to the source's own size and each srcset entry points at the same file. Set the size it displays at.`,
    );
  }

  if (isDev && remote && (props as AllProps).variant !== undefined) {
    console.warn(
      `[lumos] <Img src="${src}"> generates a srcset for a remote host. Every entry repeats the original URL unless the host is listed in images.remotePatterns.`,
    );
  }

  if (svg) {
    const Svg = src;
    return (
      <Svg
        className={classes}
        width={width}
        height={height}
        role={alt ? "img" : "presentation"}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        preserveAspectRatio={transparent ? "xMidYMid meet" : "xMidYMid slice"}
        {...(attrs as SVGProps<SVGSVGElement>)}
      />
    );
  }

  const displayWidth = (width ?? staticImage?.width ?? VIEWPORT_MAX) / 16;
  const defaultSizes = `(min-width: ${displayWidth}rem) ${displayWidth}rem, 100vw`;
  const resolvedWidth = width ?? staticImage?.width ?? (height ? undefined : VIEWPORT_MAX);
  const resolvedHeight = height ?? staticImage?.height ?? (width ? undefined : Math.round(VIEWPORT_MAX * 0.5625));

  if (publicPath || svgFile || remote || !resolvedWidth || !resolvedHeight) {
    const url = typeof src === "string" ? src : src.src;
    return (
      <img
        src={url}
        alt={alt}
        width={width ?? staticImage?.width}
        height={height ?? staticImage?.height}
        loading={loading}
        fetchPriority={fetchPriority === "auto" ? undefined : fetchPriority}
        className={classes}
        {...attrs}
      />
    );
  }

  const imageSizes =
    variant === "densities"
      ? undefined
      : variant === "constrained"
        ? (sizes ?? defaultSizes)
        : loading === "lazy"
          ? "auto"
          : "100vw";

  const { props: imageProps } = getImageProps({
    src,
    alt,
    width: resolvedWidth,
    height: resolvedHeight,
    sizes: imageSizes,
    quality: QUALITY[quality],
    priority: fetchPriority === "high" || loading === "eager",
  });

  const { style: _ignored, ...img } = imageProps;

  return (
    <img
      {...img}
      {...attrs}
      alt={alt}
      className={classes}
      loading={loading}
      fetchPriority={fetchPriority === "auto" ? undefined : fetchPriority}
    />
  );
}
