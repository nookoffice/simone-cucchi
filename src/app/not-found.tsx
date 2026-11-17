import type { Metadata } from "next";
import Layout from "@/layouts/BaseLayout";
import Section from "@/components/wrapper/Section";
import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import ButtonWrapper from "@/components/wrapper/ButtonWrapper";
import Button from "@/components/Button";
import ContentWrapper from "@/components/wrapper/ContentWrapper";
import { pageMetadata } from "@/utils/metadata";

export const metadata: Metadata = pageMetadata(
  {
    title: "Page not found",
    description: "The page you're looking for doesn't exist.",
    noindex: true,
  },
  "/404",
);

export default function NotFound() {
  return (
    <Layout
      title="Page not found"
      description="The page you're looking for doesn't exist."
      overlap
    >
      <Section paddingTop="navoverlap" paddingBottom="navoverlap" class="flex-grow">
        <ContentWrapper centered>
          <Heading variant="h3" tag="h1" maxWidth={17}>
            This page doesn&apos;t exist
          </Heading>
          <Paragraph variant="large" maxWidth={36}>
            The page you&apos;re looking for may have moved, or the link that brought you here
            might be out of date.
          </Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/">
              Back to home
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Section>
    </Layout>
  );
}
