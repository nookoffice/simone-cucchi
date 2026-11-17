import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/consts";
import { isNoindexRoute } from "@/utils/seo";
import type { SeoProps } from "@/types";

/** Page metadata matching the tags `BaseHead` used to render. */
export function pageMetadata(seo: SeoProps = {}, pathname = "/"): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    image = "/og-image.jpg",
    type = "website",
    noindex,
  } = seo;
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const hidden = noindex ?? isNoindexRoute(pathname);

  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: pathname },
    robots: hidden ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      url: pathname,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
  };
}
