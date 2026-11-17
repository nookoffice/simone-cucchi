# Lumos for Next.js

This is **Lumos for Next.js**, a Next.js component framework styled with plain CSS
and custom properties. Do not apply conventions from **Lumos for Webflow** or
**Lumos for Astro**. Project conventions live in `LUMOS.md` and `.agents/skills/`.

## Development

Start the dev server:

```
npm run dev
```

Next.js serves it at <http://localhost:3000>. Stop it with Ctrl+C in that terminal.
`npm run check` type-checks the project, and `npm run build` produces the static
output.

## Next.js documentation

Use the relevant [Next.js documentation](https://nextjs.org/docs) before working
on these areas:

- [Project structure, pages, and layouts](https://nextjs.org/docs/app/getting-started/project-structure)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [CSS](https://nextjs.org/docs/app/getting-started/css)
- [Images and fonts](https://nextjs.org/docs/app/getting-started/images)
- [Metadata and Open Graph](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Internationalization](https://nextjs.org/docs/app/guides/internationalization)

## Building

Read [LUMOS.md](LUMOS.md) before adding pages, components, or styles.

Components are React Server Components. A component that owns a DOM script or
browser state starts with `"use client"` and keeps that script in the same file.
`children` is the default slot. Named slots are props: `column2`, `background`,
`links`, and `head`. Callers pass utility classes with `class`.

## Prismic

Read `.agents/skills/lumos-prismic/SKILL.md` before changing models or content.

A page is a list of content slices. Every slice includes one Settings group: padding top, padding bottom, and theme (default `inherit` in the model and in code — never fall back to `dark` / `light` / `brand`). Those values are passed to the Lumos `Section` around the slice. The field options and defaults are in the skill. Render slices with a thin mapper such as `SliceList`, not Prismic’s default `SliceZone` comment markers.

When a design arrives, ask every question that would change the result, once, in one batch. Then build every section and page without waiting for a check between them: set that slice’s padding and theme from the design, and fill its Prismic content (copy, links, images, settings) in the same step. Do not leave empty slices for later. Treat the design or prototype as the source of truth for structure, content, motion, and behavior; stay within Lumos conventions. Publish after writing — drafts are not enough. `prismic push` updates models only.

When a page leaves its meta title, description, or image empty, use the settings document. A filled field on that page wins.

Photos from a design go in the Prismic media library: useful upright sources only, once. Skip textures, frames, wordmarks, icons, and hidden layers. No duplicate assets; descriptive alts in the project language. Videos are self-hosted link fields, not media library uploads. Nav and footer live on the settings singleton — not as page slices.

### Slices

No CSS in the slice React file. Styles live in `src/slices/<Name>/index.css` under `@layer components`, imported from `index.tsx`. The `Styles` helper remains for `src/components/` only. After a visual build or change, save `screenshot-default.png` in that slice folder (about one viewport of the section from the local site).

For scroll- or text-driven motion, use GSAP with ScrollTrigger and SplitText; clean up and handle resize. Details are in the skill and in `LUMOS.md`.

When a model changes:

1. Edit it with the Prismic CLI (`prismic type`, `prismic field`).
2. Commit the model files locally.
3. Run `prismic push`.

That commit stays local. Push the branch to GitHub only when asked. `prismic push` updates models, not document content.

## Skills

Task-specific procedures live in `.agents/skills/<name>/SKILL.md`, alongside
any scripts they need.

- `lumos-prismic` — the Prismic repository, the settings type (SEO, theme, nav/footer), the Settings group on every slice, media/alts, and where design photos go.
- `lumos-import-figma` — build pages or variables from a Figma file.
- `lumos-audit-props` — check prop order and tooltip consistency.
- `lumos-scaling-graphic` — build an editable graphic that scales as one piece.
- `lumos-import-webflow` — migrate a Webflow export and connect its CMS.
- `lumos-upgrade-version` — upgrade Lumos without losing customizations.

`.agents/skills/` is the source of truth. Claude Code loads the same skills from
relative symlinks in `.claude/skills/`. For each new skill, add
`.claude/skills/<name>` pointing to `../../.agents/skills/<name>`.

- Codex: use `$lumos-import-figma` or ask for the skill by name. Restart Codex
  if a new skill does not appear.
- Claude Code: use `/lumos-import-figma` or let it load the skill when relevant.
- Other assistants: read `SKILL.md` directly. Instructions are Markdown and
  scripts are Node.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
