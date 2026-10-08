/**
 * Fills Site settings → "Retreat enquiry form" on a dataset imported before
 * that group existed.
 *
 *   npm run sanity:retreat-inquiry:dry   # report only, writes nothing
 *   npm run sanity:retreat-inquiry       # fill
 *
 * **Run it after the deploy that adds the fields, not before** — until the
 * Studio has the schema, it shows what this writes as unknown fields.
 *
 * The six questions at the foot of every retreat programme used to be a
 * constant in `ExperienceDetail.tsx`. The page reads them from Site settings
 * now and falls back to that same list when the field is empty, so nothing on
 * the site changes whether or not this has run. What it changes is the
 * Studio: without it an editor opens an empty "Fields" list and has to rebuild
 * all six from memory to reword one label.
 *
 * Two fields, each written only when it is empty, so an editor's own form is
 * never overwritten and a rerun is a no-op:
 *
 *   retreatInquiryFields       RETREAT_INQUIRY_FIELDS from src/data/experiences.ts
 *   retreatInquirySubmitLabel  "Send", the label the form has always had
 *
 * The confirmation message is left unset on purpose: empty already renders
 * the form's own message, and the field's description quotes it.
 *
 * **The draft is patched too, if there is one.** Publishing a draft replaces
 * the published document with it, so seeding only the published copy would
 * be undone by the next Publish of a draft opened before this ran.
 *
 * Needs SANITY_API_WRITE_TOKEN (an Editor token) in .env.local, like the
 * other `.mjs` scripts here. Runs under `--experimental-strip-types` so it can
 * read the list straight from the TypeScript data file — one copy of it.
 */
import fs from "node:fs";
import { createClient } from "@sanity/client";
import { RETREAT_INQUIRY_FIELDS } from "../../src/data/experiences.ts";

for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
}

const dry = process.argv.includes("--dry-run");
if (!dry && !process.env.SANITY_API_WRITE_TOKEN) {
  console.error("  SANITY_API_WRITE_TOKEN is not set in .env.local — nothing written.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  // The draft is only visible to an authenticated read.
  perspective: "raw",
});

// Same keys `migrate.ts` writes for a fresh import (`key("retreat-inquiry", i)`).
const fields = RETREAT_INQUIRY_FIELDS.map((field, index) => ({
  _type: "inquiryField",
  _key: `retreat-inquiry-${String(index + 1).padStart(3, "0")}`,
  kind: field.kind,
  name: field.name,
  label: field.label,
  ...(field.options?.length ? { options: field.options } : {}),
  ...(field.required ? { required: true } : {}),
}));

const ids = ["siteSettings", "drafts.siteSettings"];
const documents = await client.fetch(
  "*[_id in $ids]{ _id, retreatInquiryFields, retreatInquirySubmitLabel }",
  { ids },
);
if (!documents.some((doc) => doc._id === "siteSettings")) {
  console.error("  No published Site settings document — run the migration's settings step first.");
  process.exit(1);
}

for (const doc of documents) {
  const patch = {};
  if (!doc.retreatInquiryFields?.length) patch.retreatInquiryFields = fields;
  if (!doc.retreatInquirySubmitLabel?.trim()) patch.retreatInquirySubmitLabel = "Send";

  const names = Object.keys(patch);
  if (!names.length) {
    console.log(`  ${doc._id} already set — left alone`);
    continue;
  }
  console.log(`  ${doc._id} <- ${names.join(", ")}`);
  if (names.includes("retreatInquiryFields")) {
    for (const field of fields) {
      console.log(`      ${field.label.padEnd(12)} ${field.kind}${field.required ? ", required" : ""}`);
    }
  }
  if (!dry) await client.patch(doc._id).set(patch).commit();
}

console.log(dry ? "\n  Dry run — nothing written.\n" : "\n  Done.\n");
