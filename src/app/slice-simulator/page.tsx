import { SliceSimulator, SliceSimulatorParams, getSlices } from "@prismicio/next";
import SliceList from "@/prismic/SliceList";
import { components } from "@/slices";

export default async function SliceSimulatorPage({ searchParams }: SliceSimulatorParams) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceList slices={slices} components={components} />
    </SliceSimulator>
  );
}
