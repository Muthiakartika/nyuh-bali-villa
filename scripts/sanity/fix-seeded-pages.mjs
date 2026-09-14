/**
 * Three corrections to documents this project seeded, applied in place.
 *
 *   npm run sanity:fix-pages:dry   # report only, writes nothing
 *   npm run sanity:fix-pages       # apply
 *
 * ── Why a patch script and not `migrate.ts --replace` ────────────────
 *
 * `--only=pages --replace` rebuilds all 31 page documents from `src/data` and
 * would discard every edit an author has made in the Studio since the import.
 * These three faults are in specific fields of specific documents, so this
 * reads what is published, changes only those fields, and writes it back —
 * the same rule `upload-images.mjs` and `migrate-rich-text.mjs` follow.
 *
 * ── The three faults ─────────────────────────────────────────────────
 *
 * **1. A second awards strip on the four in-room / staff pages.** Those four
 * routes render `AwardsRow` *outside* `ManagedPage`, so the page already has
 * one; the seeded `awardsSection` drew another underneath it.
 *
 * **2. Two package CTAs whose `inScope` disagreed with the coded page.** The
 * seed's `linkValue` defaults `inScope` to `true`; `PackageList` used to read
 * a missing `inScope` as *out* of scope while `ActionLink` read it the other
 * way. One field, two readings.
 *
 * Resolved in favour of linking: `/ubud/fitness` is a route this project
 * builds, so both "Explore More" labels now say `inScope: true` in `src/data`,
 * `PackageList` reads a missing flag the way the rest of the site does, and
 * this puts the published documents back in step. An earlier run of this
 * script set them inert to match the code as it stood then; running it again
 * corrects them.
 *
 * **3. Nothing to do for anchors.** The third fault found in the same diff —
 * anchored sections landing under the sticky header — was in `Section`
 * itself, not in the data, and is fixed in code.
 *
 * All of it was found by diffing the raw markup of a CMS build against a
 * build with Sanity switched off. The visible text and the heading tags
 * matched on all 78 pages; only the markup diff showed these.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

for (const file of [".env.local", ".env"]) {
  let contents;
  try {
    contents = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    continue;
  }
  for (const line of contents.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

const dryRun = process.argv.includes("--dry-run");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error(
    "\n  Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.\n" +
      "  The write token is an Editor token from sanity.io/manage.\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  token,
  useCdn: false,
});

/** The four routes that render their own AwardsRow outside ManagedPage. */
const SELF_AWARDING = new Set([
  "/seminyak-directory",
  "/ubud-directory",
  "/suite-directory",
  "/welcomeaboard",
]);

/**
 * Package CTAs whose `inScope` must be `true`. Matched on destination rather
 * than on label, because "Explore More" is the label of a dozen other links.
 */
const LIVE_CTA_HREFS = new Set(["/ubud/fitness"]);

function fixAwards(document) {
  if (!SELF_AWARDING.has(document.path)) return 0;
  const before = document.sections?.length ?? 0;
  document.sections = (document.sections ?? []).filter(
    (section) => section?._type !== "awardsSection",
  );
  return before - document.sections.length;
}

function fixCtas(node) {
  if (Array.isArray(node)) {
    let n = 0;
    for (const item of node) n += fixCtas(item);
    return n;
  }
  if (!node || typeof node !== "object") return 0;
  let n = 0;
  if (node._type === "packageItem" && Array.isArray(node.ctas)) {
    for (const cta of node.ctas) {
      if (cta && LIVE_CTA_HREFS.has(cta.href) && cta.inScope !== true) {
        cta.inScope = true;
        n += 1;
      }
    }
  }
  for (const [field, value] of Object.entries(node)) {
    if (field.startsWith("_")) continue;
    if (value && typeof value === "object") n += fixCtas(value);
  }
  return n;
}

console.log(
  "\n  " +
    (dryRun ? "DRY RUN — nothing will be written" : "WRITING") +
    "  project " +
    projectId +
    ", dataset " +
    dataset +
    "\n",
);

const documents = await client.fetch('*[_type == "page"] | order(_id asc)');
let written = 0;
let awards = 0;
let ctas = 0;

for (const document of documents) {
  const copy = JSON.parse(JSON.stringify(document));
  const a = fixAwards(copy);
  const c = fixCtas(copy);
  if (!a && !c) continue;
  awards += a;
  ctas += c;
  written += 1;
  const notes = [];
  if (a) notes.push(a + " duplicate awards strip" + (a === 1 ? "" : "s") + " removed");
  if (c) notes.push(c + " CTA" + (c === 1 ? "" : "s") + " set live");
  console.log(
    "  " + (dryRun ? "would fix" : "fixing") + "  " + copy.path + " — " + notes.join(", "),
  );
  if (!dryRun) await client.createOrReplace(copy);
}

console.log(
  "\n  " +
    (dryRun ? "would write" : "wrote") +
    " " +
    written +
    " document" +
    (written === 1 ? "" : "s") +
    " (" +
    awards +
    " awards strips, " +
    ctas +
    " CTAs); " +
    (documents.length - written) +
    " already correct.\n",
);
if (dryRun) console.log("  Dry run complete — nothing was written.\n");
