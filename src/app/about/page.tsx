import { NotFoundError, ParsingError } from "@prismicio/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import PrismicSlices from "@/prismic/Slices";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

/** The About page lives in Prismic as the page with UID `about`. */
async function getAbout() {
  const client = createClient();
  try {
    return await client.getByUID("page", "about");
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    // A repository with no Page documents rejects `my.page.uid` until one exists.
    if (error instanceof ParsingError) {
      const pages = await client.getAllByType("page");
      const page = pages.find((item) => item.uid === "about");
      if (!page) notFound();
      return page;
    }
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getAbout(), getSettings()]);
  return metadataWithSettings(page, settings, "/about");
}

export default async function AboutPage() {
  const page = await getAbout();
  // The slice carries its own frame, so render without the global chrome.
  return <PrismicSlices slices={page.data.slices} chrome={false} />;
}
