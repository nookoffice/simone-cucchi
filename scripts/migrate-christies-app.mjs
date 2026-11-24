/**
 * Rebuild the `christies-app` case study body to match Figma, pushing content to
 * live Prismic via the Migration API. Keeps the existing hero, stat grid, goal
 * statement, credits and next-project slices; replaces the empty phone-screens +
 * single Personalisation image with the full Figma section sequence, each with a
 * desktop + mobile image. Video slots stay empty.
 *
 * Dry run (assemble + log, no write):   node --env-file=.env.local scripts/migrate-christies-app.mjs
 * Commit (upload assets + publish):      node --env-file=.env.local scripts/migrate-christies-app.mjs --commit
 */
import fs from "node:fs";
import {
  createClient,
  createMigration,
  createWriteClient,
} from "@prismicio/client";
import prismicConfig from "../prismic.config.json" with { type: "json" };

const COMMIT = process.argv.includes("--commit");
const repo = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || prismicConfig.repositoryName;
const writeToken = process.env.PRISMIC_WRITE_TOKEN;
if (!writeToken) throw new Error("PRISMIC_WRITE_TOKEN missing (run with --env-file=.env.local)");

const read = createClient(repo, { fetchOptions: { cache: "no-store" } });
const existing = await read.getByUID("page", "christies-app");
console.log("Loaded christies-app:", existing.id, "— current slices:",
  existing.data.slices.map((s) => s.slice_type).join(", "));

const migration = createMigration();
const migrationDoc = migration.updateDocument(existing, "christies-app");

// --- helpers -------------------------------------------------------------
const ASSET_DIR = new URL("../src/assets/work/christies/", import.meta.url);
function asset(file, alt) {
  const buf = fs.readFileSync(new URL(file, ASSET_DIR));
  return migration.createAsset(new Blob([buf]), file, { alt });
}
const keep = (type) => {
  const s = existing.data.slices.find((x) => x.slice_type === type);
  if (!s) throw new Error(`existing slice "${type}" not found`);
  const { id, ...rest } = s; // drop server id; keep resolved content (assets by url)
  return rest;
};
const oneUp = ({ tone = "dark", layout = "full", eyebrow = "", caption = "", image, imageMobile }) => ({
  slice_type: "media_block",
  slice_label: null,
  version: "",
  items: [],
  variation: "oneUp",
  primary: { eyebrow, tone, layout, image, image_mobile: imageMobile, caption },
});
const twoUp = ({ tone = "dark", eyebrow = "", left, leftMobile, right, rightMobile }) => ({
  slice_type: "media_block",
  slice_label: null,
  version: "",
  items: [],
  variation: "twoUp",
  primary: {
    eyebrow, tone,
    left_image: left, left_image_mobile: leftMobile,
    right_image: right, right_image_mobile: rightMobile,
  },
});

const INTRO =
  "The Christie's App is one of the key destinations of Christie's top clients, who are highly engaged in the auction world. After re-launching a new simplified version of the App in 2021, it was necessary to build upon that, focusing on personalisation, new technology and brand. After analysing the data, we moved the overall app's focus, powering up the three most used areas: My Account, Search and Support. We created a brand new browse experience, combining auctions, private sales, stories and trends, all into one intuitive Explore section.";

const introSlice = {
  slice_type: "lead_statement",
  slice_label: null,
  version: "",
  items: [],
  variation: "default",
  primary: {
    eyebrow: "",
    title: "Christie's app",
    text: [{ type: "paragraph", text: INTRO, spans: [] }],
    wide: true,
  },
};

// --- new body order (matches Figma Page 62, top → bottom) ----------------
migrationDoc.document.data.slices = [
  keep("case_study_hero"),
  introSlice,
  oneUp({ tone: "dark", layout: "full", image: asset("app-devices.png", "Christie's App — My Christie's, bids and collecting stories across devices"), imageMobile: asset("app-devices-m.png", "Christie's App devices") }),
  oneUp({ tone: "black", layout: "phone", eyebrow: "Personalisation", image: asset("app-personalisation.png", "Christie's App personalised Discover screen"), imageMobile: asset("app-personalisation-m.png", "Christie's App Discover screen") }),
  oneUp({ tone: "dark", layout: "full", image: asset("app-newtech.png", "Christie's App Explore screen shown in a gallery"), imageMobile: asset("app-newtech-m.png", "Christie's App Explore screen") }),
  twoUp({
    tone: "dark",
    left: asset("app-pair-left.png", "Christie's App loading screen"),
    leftMobile: asset("app-pair-left-m.png", "Christie's App loading screen"),
    right: asset("app-pair-right.png", "Christie's App My Lots bids screen"),
    rightMobile: asset("app-pair-right-m.png", "Christie's App My Lots bids screen"),
  }),
  keep("stat_grid"),
  oneUp({ tone: "dark", layout: "full", image: asset("app-gallery.png", "Christie's App brand photography"), imageMobile: asset("app-gallery-m.png", "Christie's App brand photography") }),
  keep("lead_statement"),
  keep("credit_list"),
  keep("next_project"),
];

console.log("\nNew slice order:");
migrationDoc.document.data.slices.forEach((s, i) =>
  console.log(`  ${i}. ${s.slice_type}${s.variation ? `/${s.variation}` : ""}`));

if (!COMMIT) {
  console.log("\nDRY RUN — no write. Re-run with --commit to upload assets and publish.");
  process.exit(0);
}

const writeClient = createWriteClient(repo, { writeToken });
console.log("\nMigrating (uploading assets + updating document)…");
await writeClient.migrate(migration, {
  reporter: (event) => console.log("  ·", event.type ?? event),
});
console.log("Publishing migration release…");
await writeClient.publishMigrationRelease();
console.log("Done. christies-app updated and published.");
