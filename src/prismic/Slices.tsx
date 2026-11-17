import type { SliceZone as SliceZoneField } from "@prismicio/client";
import Layout from "@/layouts/BaseLayout";
import SliceList from "@/prismic/SliceList";

export default function PrismicSlices({
  slices,
  chrome = true,
}: {
  slices: SliceZoneField;
  chrome?: boolean;
}) {
  return (
    <Layout chrome={chrome}>
      <SliceList slices={slices} />
    </Layout>
  );
}
