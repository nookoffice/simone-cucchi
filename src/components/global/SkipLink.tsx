import Button from "@/components/Button";
import { Styles } from "@/utils/styles";

type Props = {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Target ID, without `#`. */
  target?: string;
  /** Link text. */
  label?: string;
};

export default function SkipLink({
  render = true,
  target = "main",
  label = "Skip to main content",
}: Props) {
  if (!render) return <Styles id="skip-link" css={css} />;

  return (
    <>
      <Styles id="skip-link" css={css} />
      <Button element="link" href={`#${target}`} class="skip-link">
        {label}
      </Button>
    </>
  );
}

const css = `
@layer components {
  .skip-link {
    position: fixed;
    top: var(--space-2);
    inset-inline-start: var(--space-2);
    z-index: 100;
    translate: 0 calc(-100% - var(--space-2) * 2);

    &:focus {
      translate: 0 0;
    }
  }
}
`;
