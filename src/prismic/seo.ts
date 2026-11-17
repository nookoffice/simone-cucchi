import type { ImageField, KeyTextField } from "@prismicio/client";
import { asImageSrc, isFilled, NotFoundError } from "@prismicio/client";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { pageMetadata } from "@/utils/metadata";

type PageSeo = {
  meta_title: KeyTextField;
  meta_description: KeyTextField;
  meta_image: ImageField;
};

type SettingsSeo = {
  meta_title: KeyTextField;
  meta_description: KeyTextField;
  og_image: ImageField;
};

export async function getSettings() {
  return createClient()
    .getSingle("settings")
    .catch((error: unknown) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    });
}

/** Page SEO fields win. Empty fields use the settings document. */
export function metadataWithSettings(
  page: { data: PageSeo } | null,
  settings: { data: SettingsSeo } | null,
  pathname: string,
): Metadata {
  const title = page?.data.meta_title || settings?.data.meta_title || undefined;
  const description = page?.data.meta_description || settings?.data.meta_description || undefined;
  const imageField = isFilled.image(page?.data.meta_image)
    ? page.data.meta_image
    : isFilled.image(settings?.data.og_image)
      ? settings.data.og_image
      : null;
  const image = imageField ? (asImageSrc(imageField) ?? undefined) : undefined;

  const metadata = pageMetadata(
    {
      description,
      ...(image ? { image } : {}),
    },
    pathname,
  );

  if (!title) return metadata;

  return {
    ...metadata,
    title: { absolute: title },
    openGraph: { ...metadata.openGraph, title },
    twitter: { ...metadata.twitter, title },
  };
}
