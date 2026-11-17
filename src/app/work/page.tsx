import type { Metadata } from "next";
import WorkExperience from "@/components/content/WorkExperience";
import BaseLayout from "@/layouts/BaseLayout";
import { getSettings, metadataWithSettings } from "@/prismic/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return metadataWithSettings(null, settings, "/work");
}

// Full-screen bespoke experience with its own chrome, like the homepage.
export default function WorkPage() {
  return (
    <BaseLayout chrome={false}>
      <WorkExperience />
    </BaseLayout>
  );
}
