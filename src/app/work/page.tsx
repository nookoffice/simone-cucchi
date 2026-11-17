import { NotFoundError, ParsingError } from "@prismicio/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import PrismicSlices from "@/prismic/Slices";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

/** The editable work index lives in Prismic as the page with UID `work`. */
async function getWork() {
  const client = createClient();
  try {
    return await client.getByUID("page", "work");
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    // A repository with no Page documents rejects `my.page.uid` until one exists.
    if (error instanceof ParsingError) {
      const pages = await client.getAllByType("page");
      const page = pages.find((item) => item.uid === "work");
      if (!page) notFound();
      return page;
    }
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getWork(), getSettings()]);
  return metadataWithSettings(page, settings, "/work");
}

export default async function WorkPage() {
  const page = await getWork();
  // The slice carries its own frame, so render without the global chrome.
  return <PrismicSlices slices={page.data.slices} chrome={false} />;
}
