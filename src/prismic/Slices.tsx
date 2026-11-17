import type { SliceZone as SliceZoneField } from "@prismicio/client";
import Layout from "@/layouts/BaseLayout";
import SliceList from "@/prismic/SliceList";

export default function PrismicSlices({ slices }: { slices: SliceZoneField }) {
  return (
    <Layout>
      <SliceList slices={slices} />
    </Layout>
  );
}
