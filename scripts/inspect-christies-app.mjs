import fs from "node:fs";
import { createClient } from "@prismicio/client";
import prismicConfig from "../prismic.config.json" with { type: "json" };

const repo = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || prismicConfig.repositoryName;
const client = createClient(repo, { fetchOptions: { cache: "no-store" } });

const doc = await client.getByUID("page", "christies-app");

fs.writeFileSync(
  new URL("./backup-christies-app.doc.json", import.meta.url),
  JSON.stringify(doc, null, 2),
);
fs.writeFileSync(
  new URL("./backup-christies-app.slices.json", import.meta.url),
  JSON.stringify(doc.data.slices, null, 2),
);

console.log("repo:", repo);
console.log("doc.id:", doc.id, "uid:", doc.uid, "lang:", doc.lang);
console.log(
  "slices:",
  doc.data.slices.map((s) => `${s.slice_type}/${s.variation}`).join(", "),
);
const si = doc.data.slices.find((s) => s.slice_type === "section_image");
console.log("\nsection_image sample shape:\n", JSON.stringify(si, null, 2));
const sg = doc.data.slices.find((s) => s.slice_type === "stat_grid");
console.log("\nstat_grid keys:", sg && Object.keys(sg));
