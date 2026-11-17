import { NotFoundError, ParsingError } from "@prismicio/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import PrismicSlices from "@/prismic/Slices";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

/** A case study is a page whose slices open with the case study hero. */
function isCaseStudy(page: { data: { slices: { slice_type: string }[] } }) {
  return page.data.slices.some((s) => s.slice_type === "case_study_hero");
}

async function getCaseStudy(uid: string) {
  const client = createClient();
  try {
    const page = await client.getByUID("page", uid);
    if (!isCaseStudy(page)) notFound();
    return page;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    // A repository with no Page documents rejects `my.page.uid` until one exists.
    if (error instanceof ParsingError) {
      const pages = await client.getAllByType("page");
      const page = pages.find((item) => item.uid === uid);
      if (!page || !isCaseStudy(page)) notFound();
      return page;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/work/[study]">): Promise<Metadata> {
  const { study } = await params;
  const [page, settings] = await Promise.all([getCaseStudy(study), getSettings()]);
  return metadataWithSettings(page, settings, `/work/${study}`);
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[study]">) {
  const { study } = await params;
  const page = await getCaseStudy(study);
  // The slices carry their own frame, so render without the global chrome.
  return <PrismicSlices slices={page.data.slices} chrome={false} />;
}

export async function generateStaticParams() {
  const pages = await createClient().getAllByType("page");
  return pages.filter((p) => p.uid && isCaseStudy(p)).map((p) => ({ study: p.uid as string }));
}
