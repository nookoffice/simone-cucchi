---
name: lumos-prismic
description: Work with this template's Prismic repository. Use when creating or editing slices, the settings custom type, SEO fields, header/footer links, prismic.config.json, design photos for the media library, or when starting a project by duplicating the Prismic repository.
---

# Prismic in this template

The code reads one Prismic repository. Its name is `repositoryName` in `prismic.config.json`. A new project duplicates that repository in Prismic, then changes `repositoryName` to the copy. `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` overrides it for one environment without changing the file.

## Settings

`settings` is a singleton custom type (`repeatable: false`). Fetch it with `client.getSingle("settings")`. The model is `customtypes/settings/index.json`.

### SEO

| API ID | Field | Editor guidance |
| --- | --- | --- |
| `meta_title` | Text | 50–60 characters. Search results and the browser tab. |
| `meta_description` | Text | 150–160 characters. The snippet under the title. |
| `og_image` | Image | 1200 × 630. The share image. The field constraint is that size. |

### Theme

| API ID | Control | Options | Default |
| --- | --- | --- | --- |
| `theme` | Select | `light`, `dark`, `brand` | `light` |

The root layout reads this and sets it on `<html>`. A slice theme of `inherit` follows it. A slice set to `light`, `dark`, or `brand` replaces it for that section.

### Navigation and footer

Nav and footer are site chrome, not page slices. Their content lives on the settings singleton (links, labels, and related fields). Pages are an ordered list of content sections only. Keep `header_links` and the footer equivalent on settings.

| API ID | Field | Editor guidance |
| --- | --- | --- |
| `header_links` | Group | Each item: `label` (text) and `link` (may open in a new tab). Main nav. |
| `footer_links` | Group | Same shape as `header_links`. Footer nav. |

## Pages

`homepage` is a single page. Its route is `/`, and it is fetched with `getSingle("homepage")`.

`page` is repeatable. Its route is `/:uid`, and it is fetched with `getByUID("page", uid)`.

Both have a slice zone and an SEO & Metadata tab: `meta_title` (50–60 characters), `meta_description` (150–160 characters), and `meta_image` at 1200 × 630.

When a page SEO field is empty, every page uses the settings document: `meta_title`, `meta_description`, and `og_image`. A filled field on that page wins.

## Slices

A designed section becomes one slice. A page is an ordered list of slices. The slice's other fields are that section's content.

Every slice includes one non-repeatable group, `settings`, passed to the Lumos `Section` that wraps the slice.

| API ID | Control | Options | Default |
| --- | --- | --- | --- |
| `padding_top` | Select | `none`, `even`, `small`, `medium`, `large`, `navoverlap` | `medium` |
| `padding_bottom` | Select | `none`, `even`, `small`, `medium`, `large`, `navoverlap` | `medium` |
| `theme` | Select | `inherit`, `light`, `dark`, `brand` | `inherit` |

Theme options are `inherit`, `light`, `dark`, and `brand`. Set `theme.default_value` to `inherit` in the model. In the component always use `theme={settings?.theme ?? "inherit"}` (or the equivalent path on `slice.primary.settings`). Never fall back to `dark`, `light`, or `brand`. Set an explicit theme only when the design asks for it.

### Slice files

No CSS in the slice React file: no `Styles` helper, no `const css = \`...\``. Put styles in `src/slices/<Name>/index.css` under `@layer components`, and import them at the top of `index.tsx`:

```tsx
import "./index.css";
```

The `Styles` helper stays for library components under `src/components/` only. A DOM script or browser state belongs in the same `index.tsx` when the slice is a Client Component (`"use client"`).

After building or changing a slice visually, capture `screenshot-default.png` from the local site. Crop roughly one viewport of the section (~1280 × 800–900), not an entire sticky scroll track. Save it at `src/slices/<Name>/screenshot-default.png`. That file is the equivalent of Slice Machine’s “Update screenshots” when that button is not usable.

### Rendering

Do not render with Prismic’s default `SliceZone` output that injects `prismic-slice-start` / `prismic-slice-end` comments between slices. Use a thin helper (for example `SliceList` in `src/prismic/SliceList.tsx`) that maps `slice_type` → component with no toolbar comment markers.

## Images

### Alt text

Every asset gets a descriptive alt in the language of the project. Describe what is in the photo: who or what, where it helps, and any detail a screen reader needs. Do not use the filename, a city name alone, or a bare label (for example a venue name with no context). Prefer the design’s alt when it has one. Write the same alt on the image field of every document that uses that asset. Apply this on upload and when updating an existing asset.

### No duplicate assets

One source file = one asset. Never re-upload an image already in the media library. Before every upload, list the media library and match on filename (and any obvious same source). If the image is already there, reuse its id — do not import it again. A failed write, a retry, or a second script is not a reason to upload again. If duplicates already exist, delete the extras, keep a single asset, and point documents at that one.

### What goes in the media library

Upload useful photos from the design only: the upright source, once. A card rotated in the design stays upright in the library. Two crops of the same photo are still one asset. Exclude textures, frames, wordmarks, icons, and photos hidden under another layer.

### Videos

Videos are always self-hosted. Use a link / URL field pointing at the `.mp4` (or other hosted file). Do not upload video into the Prismic media library.

## Writing content

Writing content needs `PRISMIC_WRITE_TOKEN` in `.env.local`. After creating or updating documents, publish them so the site can see the content. Drafts alone are not enough. `prismic push` updates models only — not document content.

## Building from a design

When a design or HTML prototype arrives:

1. Ask every question that would change the result, once, in one batch.
2. Then build every section and page without waiting for a check between them.
3. In the same step as the slice model and component, fill that section’s Prismic content: copy, links, images, and settings (`padding_top`, `padding_bottom`, `theme` from the design). Do not leave empty slices to fill later.
4. Treat the provided design or prototype as the source of truth for structure, content, motion, and behavior — match it with clean code. Stay within Lumos conventions (tokens, layout, components); do not invent one-off layout rules that break the system.
5. Ask again only when something cannot be decided from the design.

Header and footer links stay on the settings document.

### Motion (GSAP)

For scroll- or text-driven animation, use GSAP, ScrollTrigger, and SplitText as the default stack. Clean up timelines, ScrollTriggers, and SplitText instances on unmount or before recreation (`kill` / `revert`). Handle resize correctly (ScrollTrigger refresh, kill-and-rebuild, or the APIs GSAP already provides) so scrub, pin, and split state stay correct after viewport changes. See also the Motion section in `LUMOS.md`.

## Changing a model

1. Edit it with the Prismic CLI (`prismic type`, `prismic field`).
2. Commit the model files locally.
3. Run `prismic push`.

Leave that commit local. Push the branch to GitHub only when asked. `prismic push` updates models, not document content.
