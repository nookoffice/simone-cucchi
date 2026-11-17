---
name: lumos-upgrade-version
description: Upgrade a Lumos for Next.js site to the latest version of the framework (not Lumos for Webflow or Lumos for Astro). Use when the user asks to upgrade Lumos, update the framework, pull in the newest components, or migrate a site to current conventions. Moves the site onto the latest names, placements and props while keeping every customization the user made.
---

# Upgrading a Lumos site

Two things have to be true when this finishes, and they pull against each
other:

1. **Nothing the user wrote is lost.** Their overrides, their pages, their
   tokens, their components.
2. **Nothing is left on old conventions.** Renamed props renamed, moved
   components moved, retired patterns retired.

Keeping their work by leaving it alone fails the second. Modernising by
overwriting fails the first. The way through is a three-way merge — what they
started from, what they have now, what ships today — and the discipline to ask
rather than guess when those three disagree.

## Where the site started

An upgrade is only as good as its knowledge of the starting point.

```bash
node -p "JSON.parse(require('fs').readFileSync('package.json')).lumos ?? 'unstamped'"
```

- **Stamped** — `{ version, commit, scaffolded }` written by `create-lumos`.
  The version is the release the site came from, for reading; the commit is
  what to merge against, and it is the one that matters. They are not
  redundant: a site scaffolded between releases is that version plus whatever
  landed after it, and only the commit says how much. Sites stamped before the
  version was added carry the commit alone, which is enough. That commit
  is the merge base. Fetch it and you know exactly which lines are the
  framework's and which are the user's.
- **Unstamped** — the site predates stamping. Treat `v0.0.1` as the base. Say
  so in the report, plainly: the base is a guess, so more of the merge will
  land as conflicts and more of it needs eyes.

The site's own `package.json` version says nothing — `create-lumos` sets every
new site to `0.0.1`. Do not read it as a framework version.

## Steps

### 1. Commit what is there

Refuse to start on a dirty tree — a mid-upgrade diff is unreadable if it is
mixed with yesterday's work.

```bash
git status --porcelain          # must be empty
git commit --allow-empty -m "Before Lumos upgrade"
```

The empty commit is deliberate: it is the anchor the whole upgrade is read
against, and `git diff <that commit>` becomes the review.

### 2. Photograph the site

Before anything changes, with the dev server running:

```bash
npm run dev
node .agents/skills/lumos-upgrade-version/visual-check.mjs capture before
```

Every static route at desktop and mobile. This is the evidence that step 8
checks against, and it cannot be taken afterwards.

### 3. Get both reference copies

Latest is the current Lumos for Next.js tree. Do not pull
`lumosframework/lumos-for-astro` — that is a different framework.

```bash
# what ships now, from the framework remote this site tracks
git archive --remote=origin HEAD | tar -x -C .lumos-upgrade/latest
```

And the merge base — the commit in `package.json`'s `lumos.commit`:

```bash
git archive <commit> | tar -x -C .lumos-upgrade/base
```

Now three trees exist: `base` (where they started), the site (where they are),
`latest` (where they are going). If `lumos.commit` is not in this history, say
so and stop rather than guessing the base.

### 4. Sort every file into one of four piles

For each file in the framework's surface — components, layouts, styles, utils:

| base vs site | base vs latest | What it is                             | What to do                               |
| ------------ | -------------- | -------------------------------------- | ---------------------------------------- |
| same         | same           | untouched both sides                   | leave                                    |
| same         | **changed**    | framework moved, user never touched it | take latest wholesale                    |
| **changed**  | same           | user's override, framework unchanged   | keep theirs                              |
| **changed**  | **changed**    | both moved                             | three-way merge, conflicts to the report |

`src/app`, `src/content` and `src/assets` are the user's by definition —
never replace them. They still need migrating in step 6.

**`.agents/skills` upgrades wholesale, with one exception.** A skill's prose is
the framework's and should move to latest, but a skill may hold a section the
project wrote into it — `/lumos-import-webflow`'s **This project** is one, and
it records paths, providers and CMS filters that exist nowhere else. Carry any
such section across verbatim before taking the new file, and say in the report
that you did. Taking latest wholesale destroys a record with no other source.

### 5. Merge `base.css` rather than replacing it

Global CSS is the file most likely to be in the fourth pile: the framework adds
tokens, the user changes brand colours and fonts. Merge it three ways, token by
token, and hold to two rules:

- A token the user changed keeps their value, even when the framework changed
  the default. Their brand colour is not a stale default.
- A token the framework added arrives with the framework's value, placed in its
  own section — not appended to the end.

Every token where both sides changed goes in the report with both values. Do
not pick for them.

### 6. Migrate the site's own code

Diff `base` against `latest` to learn what moved, then apply it to `src/app`
and anything the user wrote:

- **Renamed or moved components** — update every import and tag. A component
  that moved folders and lost a prefix (`FormInput` → `Form/Input.tsx`) is
  two changes in one; get both.
- **Renamed props** — rename at every call site.
- **Removed props** — **stop and ask.** For each one, offer the three real
  options: keep the prop as a local override, drop it, or move to whatever
  replaced it. Never decide silently; a removed prop usually meant something.
- **Deleted components** — **keep the user's copy.** Copy the component from
  `base` into the site's own component folder so the site still builds and
  still looks the same, and flag it: it is no longer maintained by the
  framework, and here is what replaced it, if anything.

### 7. Prove it builds

```bash
npx tsc --noEmit && npx next build
```

Both clean before going near the screenshots. A type error found now is a
migration that was missed.

**Check the Next.js pairing while you are already here.** Next.js, React, and
React DOM are the site's own dependencies — Lumos is scaffolded in, not
installed — so an upgrade is the natural moment to look, not a licence to force
one. Compare the site's `next` against the release being merged in; if the site
is behind on a major, say so in the report and let its owner decide.

Bump `next`, `react`, and `react-dom` together. A mismatched pair installs
without a word and turns up as a build failure.

### 8. Prove nothing moved

```bash
node .agents/skills/lumos-upgrade-version/visual-check.mjs capture after
node .agents/skills/lumos-upgrade-version/visual-check.mjs compare
```

Pixel-diffs every route against step 2 with a tolerance for antialiasing, and
writes a highlighted diff for anything above 0.1% of pixels. Exit code is
non-zero when something moved.

**An upgrade that changes the design has gone wrong somewhere** — a token
merged the wrong way, a prop dropped, a component swapped for one that is not
quite the same. Work backwards from the diff image until each one is explained.
Some are legitimate: a genuine bug fix upstream will move pixels. The rule is
not "no differences", it is **"no unexplained differences"**.

### 9. Commit the result

```bash
git add -A && git commit -m "Upgrade Lumos to <commit>"
```

Update the stamp in `package.json` to the commit just merged, so the next
upgrade has an exact base. Then delete `.lumos-upgrade/`.

## The report

- **Taken from latest** — files replaced wholesale, because they were untouched.
- **Kept as yours** — overrides preserved, framework changes declined.
- **Merged** — files where both sides moved, with what came from where.
- **Migrated** — renames and moves applied to the user's own code, counted.
- **Kept alive** — components deleted upstream that were copied into the site,
  with what replaced them.
- **Answered** — removed props and how the user chose to resolve each.
- **Visual differences** — every view that moved, and why.
- **Still open** — anything unresolved. An upgrade may finish with this list
  non-empty, as long as it is stated.

## Versions

- **Skill version** — 1.0.0.
- **Framework** — there are no releases to speak of yet: `create-lumos` scaffolds
  from `main`'s HEAD, so "latest" means the newest commit, and the merge base is
  a commit rather than a tag. If tagged releases arrive, prefer the tag in the
  stamp and read the changelog in step 4 rather than diffing blind.

## Using this without Claude Code

The steps are plain git and node. `visual-check.mjs` needs headless Chrome and
sharp, which this project keeps as a dev dependency. Only the automatic
triggering and `/lumos-upgrade` are Claude Code features.
