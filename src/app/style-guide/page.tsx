import type { Metadata } from "next";
import Layout from "@/layouts/BaseLayout";
import Section from "@/components/wrapper/Section";
import Grid from "@/components/wrapper/Grid";
import ButtonWrapper from "@/components/wrapper/ButtonWrapper";
import Button from "@/components/Button";
import Eyebrow from "@/components/typography/Eyebrow";
import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import GuideSample from "@/components/content/GuideSample";
import { pageMetadata } from "@/utils/metadata";

export const metadata: Metadata = pageMetadata(
  {
    title: "Style Guide",
    description: "Type, color, spacing, radius, and the grid this site is built from.",
  },
  "/style-guide",
);

const sentence = "The quick brown fox jumps over the lazy dog.";

const swatches = [
  ["--light-100", "#ffffff"],
  ["--light-200", "#ebebeb"],
  ["--light-300", "#d9d9d9"],
  ["--dark-700", "#453e42"],
  ["--dark-800", "#2f2b2d"],
  ["--dark-900", "#1f1d1e"],
  ["--brand-500", "#c6fb50"],
  ["--brand-text", "#1f1d1e · dark-900"],
] as const;

const semantics = [
  ["--background", "Background"],
  ["--background-2", "Background 2"],
  ["--background-3", "Background 3"],
  ["--text", "Text"],
  ["--text-2", "Text 2"],
  ["--border", "Border"],
  ["--heading-accent", "Heading accent"],
] as const;

const spaces = [
  ["--space-1", "6–8"],
  ["--space-2", "10–12"],
  ["--space-3", "14–16"],
  ["--space-4", "20–24"],
  ["--space-5", "28–32"],
  ["--space-6", "32–40"],
  ["--space-7", "36–48"],
  ["--space-8", "40–64"],
  ["--site-margin", "16–48"],
  ["--site-gutter", "16–32"],
  ["--section-space-small", "48–80"],
  ["--section-space-medium", "64–112"],
  ["--section-space-large", "88–160"],
  ["--section-space-nav-overlap", "160–224"],
] as const;

const radii = [
  ["--radius-small", "0.5rem"],
  ["--radius-main", "1rem"],
  ["--radius-round", "100vw"],
] as const;

const typeScale = [
  ["display", "Display", "64–112", "Lumos"],
  ["h1", "Heading 1", "48–80", "Lumos"],
  ["h2", "Heading 2", "40–64", "Lumos"],
  ["h3", "Heading 3", "36–48", "Lumos"],
  ["h4", "Heading 4", "28–32", "Lumos"],
  ["h5", "Heading 5", "22–24", "Lumos"],
  ["h6", "Heading 6", "16–18", "Lumos"],
  ["large", "Large", "18–20", sentence],
  ["main", "Main", "16–18", sentence],
  ["small", "Small", "14–16", sentence],
] as const;

const themes = [
  ["Light", "light"],
  ["Dark", "dark"],
  ["Brand", "brand"],
] as const;

export default function StyleGuidePage() {
  return (
    <Layout>
      <Section>
        <Eyebrow>Foundations</Eyebrow>
        <Heading tag="h1">Style Guide</Heading>
        <Paragraph maxWidth={46}>
          The type, color, spacing, and grid this site is built from. Sizes are fluid from 320 to
          1440 pixels wide, and the figures below are that minimum and maximum.
        </Paragraph>
      </Section>

      <Section>
        <Eyebrow>Type</Eyebrow>
        <Heading tag="h2">Typography</Heading>
        <Paragraph maxWidth={48}>
          Inter is the primary family. Regular is 400, medium is 500, and bold is 700. Headings use
          medium weight, tight letter spacing, and a line height of 1 or 1.1. Body text uses regular
          weight, normal letter spacing, and a line height of 1.3 or 1.5.
        </Paragraph>
        {typeScale.map(([style, name, range, text]) => (
          <GuideSample key={style} variant="type" name={`${name} · ${range}`} textStyle={style}>
            {text}
          </GuideSample>
        ))}
        <Heading tag="h3" variant="h4">
          Weights
        </Heading>
        <Grid xsmall={1} small={3}>
          <Paragraph class="margin-block-0 weight-regular">Regular 400</Paragraph>
          <Paragraph class="margin-block-0 weight-medium">Medium 500</Paragraph>
          <Paragraph class="margin-block-0 weight-bold">Bold 700</Paragraph>
        </Grid>
        <Heading tag="h3" variant="h4">
          Letter spacing
        </Heading>
        <Paragraph class="margin-block-0 letter-spacing-tight" maxWidth={42}>
          Tight −0.03em. {sentence}
        </Paragraph>
        <Paragraph class="margin-block-0 letter-spacing-normal" maxWidth={42}>
          Normal 0em. {sentence}
        </Paragraph>
        <Heading tag="h3" variant="h4">
          Line height
        </Heading>
        <Grid xsmall={1} medium={2}>
          <Paragraph class="margin-block-0 line-height-small" maxWidth={28}>
            1. {sentence}
          </Paragraph>
          <Paragraph class="margin-block-0 line-height-medium" maxWidth={28}>
            1.1. {sentence}
          </Paragraph>
          <Paragraph class="margin-block-0 line-height-large" maxWidth={28}>
            1.3. {sentence}
          </Paragraph>
          <Paragraph class="margin-block-0 line-height-huge" maxWidth={28}>
            1.5. {sentence}
          </Paragraph>
        </Grid>
      </Section>

      <Section>
        <Eyebrow>Color</Eyebrow>
        <Heading tag="h2">Palette</Heading>
        <Paragraph maxWidth={46}>
          These are the raw swatches. The themes below remap them to background, text, border, and
          buttons.
        </Paragraph>
        <Grid xsmall={2} small={3} medium={4}>
          {swatches.map(([token, value]) => (
            <GuideSample key={token} name={token} token={`var(${token})`} value={value} />
          ))}
        </Grid>
      </Section>

      <Section>
        <Eyebrow>Color</Eyebrow>
        <Heading tag="h2">Themes</Heading>
        <Paragraph maxWidth={46}>
          Light, dark, and brand each set the semantic colors and the two button styles. Chips
          inside a panel use the tokens of that theme.
        </Paragraph>
        <Grid xsmall={1} medium={3}>
          {themes.map(([name, theme]) => (
            <GuideSample key={theme} variant="theme" name={name} theme={theme}>
              <Paragraph>Background, text, and buttons on the {name.toLowerCase()} theme.</Paragraph>
              <Grid xsmall={1}>
                {semantics.map(([token, role]) => (
                  <GuideSample key={token} name={token} value={role} token={`var(${token})`} />
                ))}
              </Grid>
              <ButtonWrapper marginTop="0">
                <Button>Primary</Button>
                <Button emphasis="secondary">Secondary</Button>
                <Button variant="link">Text link</Button>
              </ButtonWrapper>
            </GuideSample>
          ))}
        </Grid>
      </Section>

      <Section>
        <Eyebrow>Space</Eyebrow>
        <Heading tag="h2">Spacing</Heading>
        <Paragraph maxWidth={46}>
          Each bar is the live token, so it grows with the viewport. The range is the minimum and
          maximum in pixels.
        </Paragraph>
        <Grid xsmall={1} medium={2}>
          {spaces.map(([token, range]) => (
            <GuideSample key={token} variant="space" name={token} token={`var(${token})`} value={range} />
          ))}
        </Grid>
      </Section>

      <Section>
        <Eyebrow>Shape</Eyebrow>
        <Heading tag="h2">Radius</Heading>
        <Paragraph maxWidth={42}>
          Small and main round the corners. Round is a full pill, so a square becomes a circle.
        </Paragraph>
        <Grid xsmall={1} small={3}>
          {radii.map(([token, value]) => (
            <GuideSample key={token} variant="radius" name={token} token={`var(${token})`} value={value} />
          ))}
        </Grid>
      </Section>

      <Section>
        <Eyebrow>Layout</Eyebrow>
        <Heading tag="h2">Grid</Heading>
        <Paragraph maxWidth={48}>
          Twelve columns. This sample shows 2, then 4, 6, and 12 at 30rem, 48rem, and 64rem. The gap
          is the site gutter.
        </Paragraph>
        <Grid xsmall={2} small={4} medium={6} large={12}>
          {Array.from({ length: 12 }, (_, index) => (
            <GuideSample key={index} variant="column" name={String(index + 1)} />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}
