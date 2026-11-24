import {
  type ImageField,
  isFilled,
  type LinkToMediaField,
} from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ResponsiveImage from "@/components/ResponsiveImage";
import Video from "@/components/media/Video";
import { cx } from "@/utils/cx";
import "./index.css";

export type MediaBlockProps = SliceComponentProps<Content.MediaBlockSlice>;

/**
 * A flexible case-study media section: one column or two, each holding an image
 * (separate desktop + mobile crops) or a self-hosted video. Images are the
 * primary content; a filled video link takes over its slot when present.
 */
function MediaSlot({
  image,
  imageMobile,
  video,
  videoMobile,
  className,
}: {
  image: ImageField;
  imageMobile?: ImageField;
  video?: LinkToMediaField;
  videoMobile?: LinkToMediaField;
  className?: string;
}) {
  const deskVideo = video && isFilled.linkToMedia(video) ? video.url : undefined;
  const mobVideo =
    videoMobile && isFilled.linkToMedia(videoMobile) ? videoMobile.url : undefined;

  // Self-hosted video takes over the slot when a link is set (none yet — the
  // slots exist so Simone can add motion later without a code change).
  if (deskVideo || mobVideo) {
    return (
      <>
        <Video
          class={cx(className, deskVideo && mobVideo && "csm_media-desk")}
          src={deskVideo ?? mobVideo}
          variant="auto"
        />
        {deskVideo && mobVideo && (
          <Video class={cx(className, "csm_media-mob")} src={mobVideo} variant="auto" />
        )}
      </>
    );
  }

  return <ResponsiveImage className={className} desktop={image} mobile={imageMobile} />;
}

export default function MediaBlock({ slice }: MediaBlockProps) {
  const { eyebrow, tone } = slice.primary;
  const toneAttr = tone || "dark";

  if (slice.variation === "twoUp") {
    const p = slice.primary;
    return (
      <section className="csm_section" data-tone={toneAttr} data-variation="two" data-reveal>
        {isFilled.keyText(eyebrow) && <p className="csm_eyebrow">{eyebrow}</p>}
        <div className="csm_grid">
          <div className="csm_col">
            <MediaSlot
              image={p.left_image}
              imageMobile={p.left_image_mobile}
              video={p.left_video}
              className="csm_media"
            />
          </div>
          <div className="csm_col">
            <MediaSlot
              image={p.right_image}
              imageMobile={p.right_image_mobile}
              video={p.right_video}
              className="csm_media"
            />
          </div>
        </div>
      </section>
    );
  }

  const p = slice.primary;
  const layout = p.layout || "full";
  return (
    <section
      className="csm_section"
      data-tone={toneAttr}
      data-variation="one"
      data-layout={layout}
      data-reveal
    >
      {isFilled.keyText(eyebrow) && <p className="csm_eyebrow">{eyebrow}</p>}
      <div className="csm_single">
        <MediaSlot
          image={p.image}
          imageMobile={p.image_mobile}
          video={p.video}
          videoMobile={p.video_mobile}
          className="csm_media"
        />
      </div>
      {isFilled.keyText(p.caption) && <p className="csm_caption">{p.caption}</p>}
    </section>
  );
}
