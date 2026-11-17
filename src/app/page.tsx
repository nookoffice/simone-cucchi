import { NotFoundError } from "@prismicio/client";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import PrismicSlices from "@/prismic/Slices";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

async function getHomepage() {
  return createClient()
    .getSingle("homepage")
    .catch((error: unknown) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    });
}

export async function generateMetadata() {
  const [page, settings] = await Promise.all([getHomepage(), getSettings()]);
  return metadataWithSettings(page, settings, "/");
}

export default async function HomePage() {
  const page = await getHomepage();
  if (!page) notFound();

  return <PrismicSlices slices={page.data.slices} />;
}
