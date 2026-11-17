import { NotFoundError, ParsingError } from "@prismicio/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import PrismicSlices from "@/prismic/Slices";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

const UID = "christies-app";

/** The Christie's App case study lives in Prismic as a page with its own slices. */
async function getCaseStudy() {
  const client = createClient();
  try {
    return await client.getByUID("page", UID);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    // A repository with no Page documents rejects `my.page.uid` until one exists.
    if (error instanceof ParsingError) {
      const pages = await client.getAllByType("page");
      const page = pages.find((item) => item.uid === UID);
      if (!page) notFound();
      return page;
    }
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getCaseStudy(), getSettings()]);
  return metadataWithSettings(page, settings, `/work/${UID}`);
}

export default async function ChristiesAppCaseStudy() {
  const page = await getCaseStudy();
  // The slices carry their own frame, so render without the global chrome.
  return <PrismicSlices slices={page.data.slices} chrome={false} />;
}
