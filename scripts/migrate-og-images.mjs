import fs from "node:fs";
import path from "node:path";
import {
  createClient,
  createMigration,
  createWriteClient,
} from "@prismicio/client";

// Per-case-study OpenGraph images: give each case study its own 1200x630 share
// card (its signature render) instead of all of them falling back to the generic
// branded settings OG. Only `meta_image` is touched; every other field on each
// doc round-trips through the migration untouched.

const REPO = "simone-cucchi";
const writeToken = process.env.PRISMIC_WRITE_TOKEN;
if (!writeToken) throw new Error("PRISMIC_WRITE_TOKEN missing");

const OG = [
  {
    uid: "christies-app",
    file: "src/assets/og/christies-app-og.jpg",
    alt: "Christie's App — multi-device app design by Simone Cucchi",
  },
  {
    uid: "christies-30",
    file: "src/assets/og/christies-30-og.jpg",
    alt: "Christie's 3.0 — mirrored pavilion render by Simone Cucchi",
  },
  {
    uid: "project-t",
    file: "src/assets/og/project-t-og.jpg",
    alt: "Fashion product design and art direction by Simone Cucchi",
  },
];

const read = createClient(REPO, { routes: [] });
const writeClient = createWriteClient(REPO, { writeToken });
const migration = createMigration();

// Backup current docs (full data) before any write.
const backup = {};
for (const { uid } of OG) {
  backup[uid] = (await read.getByUID("page", uid)).data;
}
fs.writeFileSync(
  path.join("scripts", "backup-og-images.json"),
  JSON.stringify(backup, null, 2),
);
console.log("backup written → scripts/backup-og-images.json");

for (const { uid, file, alt } of OG) {
  const existing = await read.getByUID("page", uid);
  const filename = path.basename(file);
  const asset = migration.createAsset(
    new Blob([fs.readFileSync(file)]),
    filename,
    { alt },
  );
  const doc = migration.updateDocument(existing, uid);
  doc.document.data.meta_image = asset;
  console.log(`queued meta_image for ${uid} ← ${filename}`);
}

await writeClient.migrate(migration, { reporter: (e) => console.log(e) });
await writeClient.publishMigrationRelease();
console.log("published ✓");
