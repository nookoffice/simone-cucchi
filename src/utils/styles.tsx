/** Component CSS, hoisted once. The Next.js stand-in for `<style is:global>`. */
export function Styles({ id, css }: { id: string; css: string }) {
  return (
    <style href={`lumos-${id}`} precedence="lumos-components">
      {css}
    </style>
  );
}
