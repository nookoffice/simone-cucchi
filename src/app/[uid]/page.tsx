import { NotFoundError, ParsingError } from "@prismicio/client";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import PrismicSlices from "@/prismic/Slices";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

const RESERVED = new Set(["style-guide", "example-components", "slice-simulator"]);

/** Case studies live under /work/[study], not at the top level. */
function isCaseStudy(page: { data: { slices: { slice_type: string }[] } }) {
  return page.data.slices.some((s) => s.slice_type === "case_study_hero");
}

async function getPage(uid: string) {
  if (RESERVED.has(uid)) notFound();

  const client = createClient();

  try {
    const page = await client.getByUID("page", uid);
    if (isCaseStudy(page)) notFound();
    return page;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    // A repository with no Page documents rejects `my.page.uid` until one exists.
    if (error instanceof ParsingError) {
      const pages = await client.getAllByType("page");
      const page = pages.find((item) => item.uid === uid);
      if (!page || isCaseStudy(page)) notFound();
      return page;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  const [page, settings] = await Promise.all([getPage(uid), getSettings()]);

  return metadataWithSettings(page, settings, `/${uid}`);
}

export default async function Page({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  const page = await getPage(uid);

  return <PrismicSlices slices={page.data.slices} />;
}

export async function generateStaticParams() {
  const pages = await createClient().getAllByType("page");

  return pages
    .filter((page) => page.uid && !RESERVED.has(page.uid) && !isCaseStudy(page))
    .map((page) => ({ uid: page.uid }));
}
