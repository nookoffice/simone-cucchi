import type { Metadata } from "next";
import type { ReactNode } from "react";
import Layout from "@/layouts/BaseLayout";
import Section from "@/components/wrapper/Section";
import ContentWrapper from "@/components/wrapper/ContentWrapper";
import Eyebrow from "@/components/typography/Eyebrow";
import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import ButtonWrapper from "@/components/wrapper/ButtonWrapper";
import Button from "@/components/Button";
import Img from "@/components/media/Img";
import lumosBackground from "@/assets/graphics/lumos-background.svg";
import logoIcon from "@/assets/logo/logo-icon.svg";
import Grid from "@/components/wrapper/Grid";
import Card from "@/components/item/Card";
import Form from "@/components/form/Form";
import Fieldset from "@/components/form/Fieldset";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import Choice from "@/components/form/Choice";
import Range from "@/components/form/Range";
import Textarea from "@/components/form/Textarea";
import Tabs from "@/components/interactive/Tabs";
import TabLink from "@/components/interactive/TabLink";
import Dropdown from "@/components/interactive/Dropdown";
import Overlay from "@/components/media/Overlay";
import Modal from "@/components/interactive/Modal";
import Slider from "@/components/interactive/Slider";
import Accordion from "@/components/interactive/Accordion";
import Marquee from "@/components/interactive/Marquee";
import AccordionItem from "@/components/interactive/AccordionItem";
import Video from "@/components/media/Video";
import Icon from "@/components/media/Icon";
import RichText from "@/components/typography/RichText";
import arrow from "@/assets/icons/arrow.svg";
import play from "@/assets/icons/play.svg";
import close from "@/assets/icons/close.svg";
import check from "@/assets/icons/check.svg";
import { pageMetadata } from "@/utils/metadata";

export const metadata: Metadata = pageMetadata(
  {
    title: "Example Components",
    description: "Every layout variant, side by side.",
  },
  "/example-components",
);

const heading = "We build things that help people work smarter";
const text = "We build things that help people work smarter, move faster, and grow further.";
const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const longCopy =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

const visual = <Img src={lumosBackground} width={1920} height={1080} />;

function Block({
  eyebrow,
  reverse = false,
  variant,
  column2 = visual,
  body,
}: {
  eyebrow: string;
  reverse?: boolean;
  variant: "columns" | "breakout" | "contain" | "sticky-content" | "sticky-visual";
  column2?: ReactNode;
  body?: ReactNode;
}) {
  const copy = (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading tag="h2" variant="h3" maxWidth={17}>
        {heading}
      </Heading>
      {body ?? <Paragraph maxWidth={36}>{text}</Paragraph>}
      <ButtonWrapper>
        <Button element="link" href="/about">
          Button Text
        </Button>
      </ButtonWrapper>
    </>
  );

  return (
    <Section paddingTop="small" paddingBottom="small">
      {variant === "sticky-content" || variant === "sticky-visual" ? (
        <ContentWrapper variant={variant} column2={column2}>
          {copy}
        </ContentWrapper>
      ) : (
        <ContentWrapper variant={variant} reverse={reverse} column2={column2}>
          {copy}
        </ContentWrapper>
      )}
    </Section>
  );
}

const card = (title: string, cover = false) =>
  cover ? (
    <Card
      heading={title}
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
      buttonHref="/about"
      buttonLabel="Button Text"
      variant="cover"
      theme="dark"
      image={lumosBackground}
    />
  ) : (
    <Card
      heading={title}
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
      buttonHref="/about"
      buttonLabel="Button Text"
    />
  );

export default function ExampleComponentsPage() {
  return (
    <Layout title="Example Components" description="Every layout variant, side by side.">
      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper column2={<Img src={lumosBackground} />}>
          <Eyebrow>stack</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <Paragraph maxWidth={36}>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
            <Dropdown label="Dropdown">
              <Paragraph>Some text</Paragraph>
            </Dropdown>
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper centered column2={<Img src={lumosBackground} />}>
          <Eyebrow>stack · centered</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <Paragraph maxWidth={36}>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
            <Button emphasis="secondary">Button Text</Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper
          variant="auto-width"
          column2={
            <>
              <Paragraph maxWidth={28}>{text}</Paragraph>
              <ButtonWrapper marginTop="4">
                <Button element="link" href="/about">
                  Button Text
                </Button>
              </ButtonWrapper>
            </>
          }
        >
          <Eyebrow>auto-width</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
      </Section>

      <Block eyebrow="columns" variant="columns" />
      <Block eyebrow="columns · reverse" variant="columns" reverse />
      <Block eyebrow="breakout" variant="breakout" />
      <Block eyebrow="breakout · reverse" variant="breakout" reverse />
      <Block eyebrow="contain" variant="contain" />
      <Block eyebrow="contain · reverse" variant="contain" reverse />
      <Block eyebrow="sticky-content" variant="sticky-content" />
      <Block eyebrow="sticky-visual" variant="sticky-visual" body={<Paragraph>{longCopy}</Paragraph>} />

      <Section paddingTop="small" paddingBottom="large">
        <ContentWrapper variant="card" mediaOpacity={50} column2={visual}>
          <Eyebrow variant="tag">card</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <Paragraph maxWidth={36}>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper
          variant="auto-width"
          column2={
            <>
              <Paragraph maxWidth={28}>{text}</Paragraph>
              <ButtonWrapper marginTop="4">
                <Button element="link" href="/about">
                  Button Text
                </Button>
              </ButtonWrapper>
            </>
          }
        >
          <Eyebrow>auto-width</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Grid medium={3}>
          <Card
            heading="Heading"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
            buttonHref="/about"
            buttonLabel="Button Text"
          />
          <Card
            heading="Heading"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
            buttonHref="/about"
            buttonLabel="Button Text"
            variant="cover"
            image={lumosBackground}
          />
          <Card
            heading="Heading"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
            buttonHref="/about"
            buttonLabel="Button Text"
            variant="stacked"
            image={lumosBackground}
          />
        </Grid>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>form</Eyebrow>
        </ContentWrapper>
        <Form name="contact">
          <Fieldset legend="Contact Details" variant="columns">
            <Input required variant="first-name" />
            <Input variant="last-name" required />
            <Input variant="email" label="Email Address" placeholder="email@company.com" required />
            <Grid medium={2}>
              <Select variant="state" />
              <Input variant="zip-code" placeholder="" />
            </Grid>
            <Fieldset legend="Date of Birth" variant="thirds" legendStyle="label">
              <Select variant="month" labelHidden />
              <Select variant="day" labelHidden />
              <Select variant="year" from={1920} labelHidden />
            </Fieldset>
            <Input variant="phone" label="Phone Number" placeholder="000-000-0000" />
          </Fieldset>
          <Fieldset legend="Legend" variant="columns">
            <Fieldset legend="Favorite Color" variant="inline" legendStyle="label">
              <Choice type="radio" name="color" label="Red" value="red" checked />
              <Choice type="radio" name="color" label="Green" value="green" />
              <Choice type="radio" name="color" label="Blue" value="blue" />
            </Fieldset>
            <Fieldset legend="Terms & Conditions" variant="inline" legendStyle="label">
              <Choice label="I agree to the terms" name="terms" checked />
              <Choice label="I agree to the terms" name="updates" />
            </Fieldset>
            <Select label="Job Title" options={["Designer", "Developer", "Producer", "Something else"]} />
            <Input variant="date" label="Completion Date" />
            <Range label="Label" unit="%" />
            <Textarea label="Message" placeholder="Your message" required value="" />
          </Fieldset>
          <ButtonWrapper marginTop="4">
            <Button type="submit">Submit</Button>
          </ButtonWrapper>
        </Form>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>buttons</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
            <Button emphasis="secondary">Button Text</Button>
            <Button variant="link">Button Text</Button>
          </ButtonWrapper>
          <ButtonWrapper>
            <Button variant="arrow" direction="back" />
            <Button variant="arrow" />
            <Button variant="play" />
            <Button variant="play" pressed />
            <Button variant="close" />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button variant="arrow" emphasis="secondary" direction="back" />
            <Button variant="arrow" emphasis="secondary" />
            <Button variant="play" emphasis="secondary" />
            <Button variant="play" emphasis="secondary" pressed />
            <Button variant="close" emphasis="secondary" />
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>tabs · horizontal</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Tabs
          links={
            <>
              <TabLink>Strategy</TabLink>
              <TabLink>Design</TabLink>
              <TabLink>Development</TabLink>
            </>
          }
        >
          <ContentWrapper variant="columns" column2={visual}>
            <Heading tag="h3" variant="h4" maxWidth={17}>
              &quot;Strategy&quot;
            </Heading>
            <Paragraph maxWidth={36}>{text}</Paragraph>
            <ButtonWrapper>
              <Button element="link" href="/about">
                Button Text
              </Button>
            </ButtonWrapper>
          </ContentWrapper>
          <ContentWrapper variant="columns" column2={visual}>
            <Heading tag="h3" variant="h4" maxWidth={17}>
              &quot;Design&quot;
            </Heading>
            <Paragraph maxWidth={36}>{text}</Paragraph>
            <ButtonWrapper>
              <Button element="link" href="/about">
                Button Text
              </Button>
            </ButtonWrapper>
          </ContentWrapper>
          <ContentWrapper variant="columns" column2={visual}>
            <Heading tag="h3" variant="h4" maxWidth={17}>
              &quot;Development&quot;
            </Heading>
            <Paragraph maxWidth={36}>{text}</Paragraph>
            <ButtonWrapper>
              <Button element="link" href="/about">
                Button Text
              </Button>
            </ButtonWrapper>
          </ContentWrapper>
        </Tabs>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>tabs · side</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            Services
          </Heading>
        </ContentWrapper>
        <Tabs
          id="services"
          variant="side"
          links={
            <>
              <TabLink>Strategy</TabLink>
              <TabLink>Design</TabLink>
              <TabLink>Development</TabLink>
            </>
          }
        >
          {card("Strategy", true)}
          {card("Design", true)}
          {card("Development", true)}
        </Tabs>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>tabs · auto playback</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Tabs
          playback="auto"
          id="showcase"
          links={
            <>
              <TabLink>Tab Link 1</TabLink>
              <TabLink>Tab Link 2</TabLink>
              <TabLink>Tab Link 3</TabLink>
            </>
          }
        >
          {["Tab Content 1", "Tab Content 2", "Tab Content 3"].map((title) => (
            <ContentWrapper key={title} variant="columns" column2={visual}>
              <Heading tag="h3" variant="h4" maxWidth={17}>
                &quot;{title}&quot;
              </Heading>
              <Paragraph maxWidth={36}>{text}</Paragraph>
              <ButtonWrapper>
                <Button element="link" href="/about">
                  Button Text
                </Button>
              </ButtonWrapper>
            </ContentWrapper>
          ))}
        </Tabs>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>slider · bleed</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Slider label="Services" small={2} medium={3}>
          {card("Strategy")}
          {card("Design")}
          {card("Development")}
          {card("Research")}
          {card("Support")}
        </Slider>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>slider · crop-start</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Slider variant="crop-start" label="Case studies" small={2} medium={3} large={3.27}>
          {card("Strategy", true)}
          {card("Design", true)}
          {card("Development", true)}
          {card("Research", true)}
          {card("Support", true)}
        </Slider>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>slider · contained</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Slider variant="contained" label="Services" small={2} medium={3}>
          {card("Strategy")}
          {card("Design")}
          {card("Development")}
          {card("Research")}
          {card("Support")}
        </Slider>
      </Section>

      <Section>
        <ContentWrapper>
          <Eyebrow>marquee</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
        <Marquee label="What we do">
          <Paragraph variant="large">Strategy</Paragraph>
          <Icon src={logoIcon} variant="large" />
          <Paragraph variant="large">Design</Paragraph>
          <Icon src={logoIcon} variant="large" />
          <Paragraph variant="large">Development</Paragraph>
          <Icon src={logoIcon} variant="large" />
          <Paragraph variant="large">Research</Paragraph>
          <Icon src={logoIcon} variant="large" />
        </Marquee>
        <Marquee label="What we do" direction="backwards">
          <Paragraph variant="large">Strategy</Paragraph>
          <Icon src={logoIcon} variant="large" />
          <Paragraph variant="large">Design</Paragraph>
          <Icon src={logoIcon} variant="large" />
          <Paragraph variant="large">Development</Paragraph>
          <Icon src={logoIcon} variant="large" />
          <Paragraph variant="large">Research</Paragraph>
          <Icon src={logoIcon} variant="large" />
        </Marquee>
      </Section>

      <Section paddingTop="small" paddingBottom="small" fullHeight background={
        <>
          <Img src={lumosBackground} />
          <Overlay />
        </>
      }>
        <ContentWrapper centered>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <Paragraph maxWidth={36}>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
            <Dropdown label="Dropdown">
              <Paragraph />
            </Dropdown>
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper column2={
          <Video
            src="https://timothyricks.us.getafile.online/background-video"
            variant="16-9"
            loop
            autoplay
            muted
          />
        }>
          <Eyebrow>video</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <Paragraph maxWidth={36}>{text}</Paragraph>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>rich-text</Eyebrow>
          <RichText maxWidth={60}>
            <h2>A heading the editor wrote</h2>
            <p>
              Rich text takes whatever a CMS hands it and gives every element the same rhythm the
              rest of the page uses, without a class on any of them.
            </p>
            <h3>A second level</h3>
            <ul>
              <li>An item in a list</li>
              <li>
                Another item, longer, so it wraps onto a second line and the spacing between items
                can be read
              </li>
            </ul>
            <blockquote>A pull quote, styled from the parent.</blockquote>
            <p>
              A closing paragraph with <a href="/about">a link</a> inside it.
            </p>
          </RichText>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper>
          <Eyebrow>icon</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <ButtonWrapper>
            <Icon src={arrow} variant="small" />
            <Icon src={play} variant="medium" />
            <Icon src={close} variant="large" />
            <Icon src={check} variant="medium" />
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper
          variant="sticky-content"
          column2={
            <Accordion openFirst>
              {Array.from({ length: 5 }, (_, i) => (
                <AccordionItem key={i} heading="This is some text inside of a div block.">
                  <Paragraph>{lorem}</Paragraph>
                </AccordionItem>
              ))}
            </Accordion>
          }
        >
          <Eyebrow>accordion</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
        </ContentWrapper>
      </Section>

      <Section paddingTop="small" paddingBottom="small">
        <ContentWrapper centered>
          <Eyebrow>modal</Eyebrow>
          <Heading tag="h2" variant="h3" maxWidth={17}>
            {heading}
          </Heading>
          <Paragraph maxWidth={36}>{text}</Paragraph>
          <ButtonWrapper>
            <Button data-modal-open="modal-small">Open Modal</Button>
            <Button data-modal-open="modal-side" emphasis="secondary">
              Open Side Panel
            </Button>
            <Button data-modal-open="modal-full" emphasis="secondary">
              Open Full Screen
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Section>

      <Modal id="modal-small" label="Small modal">
        <ContentWrapper centered>
          <Heading tag="h2" variant="h4">
            {heading}
          </Heading>
          <Paragraph>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Modal>
      <Modal id="modal-side" label="Side panel" variant="side-panel">
        <ContentWrapper>
          <Heading tag="h2" variant="h4">
            {heading}
          </Heading>
          <Paragraph>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Modal>
      <Modal id="modal-full" label="Full screen" variant="full-screen">
        <ContentWrapper centered>
          <Heading tag="h2" variant="h3">
            {heading}
          </Heading>
          <Paragraph>{text}</Paragraph>
          <ButtonWrapper>
            <Button element="link" href="/about">
              Button Text
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Modal>
    </Layout>
  );
}
