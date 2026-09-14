/**
 * Converts the two fields that became rich text into portable-text blocks.
 *
 *   npm run sanity:rich-text:dry   # report only, writes nothing
 *   npm run sanity:rich-text       # convert
 *
 * ── What changed and why this exists ──────────────────────────────────
 *
 * `packageItem.description` and `packageListSection.intro` were plain `text`
 * fields. They render inside a `<p>` the layout already draws, and that
 * paragraph has carried **bold** since the in-room directory pages shipped —
 * `PackageRun` in PackageList.tsx is what draws it — but only from
 * `src/data`. An editor had no way to bold a word, which is the gap the CMS
 * audit was asked to close. Both are `inlineRichText` now: one paragraph,
 * bold / italic / links, no headings or lists, because anything block-level
 * inside that `<p>` would be invalid HTML.
 *
 * A schema whose type no longer matches its published data shows the field as
 * invalid in the Studio and refuses to edit it — which would have made the
 * content *less* editable, the opposite of the point. So the data moves too,
 * and this is what moves it.
 *
 * ── Safety properties ────────────────────────────────────────────────
 *
 * **Nothing breaks if this is never run.** `richText()` in lib/queries.ts
 * checks for a block before projecting, and `toRuns` in lib/richText.ts
 * accepts a string, so the website renders both shapes identically. This
 * fixes the *Studio*, not the site.
 *
 * **Idempotent.** A value that is already an array of blocks is skipped, so a
 * rerun writes nothing and an interrupted run resumes.
 *
 * **It reads what is published and writes that back**, like
 * `upload-images.mjs` and unlike `migrate.ts --replace`: an editor's copy, a
 * swapped heading and a reordered section all survive, because the script
 * only ever replaces the one field's value in the document it just read.
 *
 * **Drafts are converted too.** A draft left open in the Studio holds its own
 * copy of the field; converting only the published document would leave that
 * draft invalid and the next Publish would put the string back.
 *
 * **A document with nothing to convert is not written at all**, so the
 * publish webhook — and the Cloudflare purge behind it — does not fire for
 * documents that did not change.
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
      "  The write token is an **Editor** token from sanity.io/manage -> API -> Tokens.\n" +
      "  See .env.example.\n",
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

// ── Conversion ─────────────────────────────────────────────────────────

let keySeq = 0;
const nextKey = (prefix) => prefix + "-" + (keySeq += 1).toString(36);

/**
 * One paragraph per blank-line-separated run of the string.
 *
 * The old field was a `text` area, so an author could press Return twice and
 * mean a new paragraph. Splitting on that keeps the intent; `toRuns` joins
 * multiple blocks with a space, which is what the single `<p>` can show.
 */
function toBlocks(value) {
  if (typeof value !== "string") return null;
  const paragraphs = value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (!paragraphs.length) return null;
  return paragraphs.map((text) => ({
    _type: "block",
    _key: nextKey("block"),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: nextKey("span"), text, marks: [] }],
  }));
}

/**
 * Walks a document and rewrites the two fields wherever they appear, at any
 * depth. Keyed on the parent object's `_type` rather than on the field name
 * alone: `intro` is still a plain string on four other section types, and
 * converting one of those would hand its renderer an array it reads as empty.
 */
function convert(node) {
  if (Array.isArray(node)) {
    let total = 0;
    for (const item of node) total += convert(item);
    return total;
  }
  if (!node || typeof node !== "object") return 0;

  let changed = 0;
  if (node._type === "packageItem" && typeof node.description === "string") {
    const blocks = toBlocks(node.description);
    if (blocks) {
      node.description = blocks;
      changed += 1;
    }
  }
  if (node._type === "packageListSection" && typeof node.intro === "string") {
    const blocks = toBlocks(node.intro);
    if (blocks) {
      node.intro = blocks;
      changed += 1;
    }
  }
  for (const [field, value] of Object.entries(node)) {
    if (field.startsWith("_")) continue;
    if (value && typeof value === "object") changed += convert(value);
  }
  return changed;
}

// ── Run ────────────────────────────────────────────────────────────────

console.log(
  "\n  " +
    (dryRun ? "DRY RUN — nothing will be written" : "WRITING") +
    "  project " +
    projectId +
    ", dataset " +
    dataset +
    "\n",
);

// Every page and package set, drafts included. No GROQ filter: each document
// is checked in JavaScript before anything is written, so a filter could only
// have made the script miss something, never made it faster in any way worth
// the risk on 31 documents.
const documents = await client.fetch(
  '*[_type in ["page", "packageSet"]] | order(_id asc)',
);

let written = 0;
let fields = 0;
let skipped = 0;

for (const document of documents) {
  const copy = JSON.parse(JSON.stringify(document));
  const changed = convert(copy);
  if (!changed) {
    skipped += 1;
    continue;
  }
  fields += changed;
  written += 1;
  const label = document._id.startsWith("drafts.") ? " (draft)" : "";
  console.log(
    "  " +
      (dryRun ? "would convert" : "converting") +
      "  " +
      (document.path ?? document._id) +
      label +
      "  — " +
      changed +
      " field" +
      (changed === 1 ? "" : "s"),
  );
  if (!dryRun) {
    // `createOrReplace` on the document we just read, not one rebuilt from
    // src/data: every other field travels back exactly as the editor left it.
    await client.createOrReplace(copy);
  }
}

console.log(
  "\n  " +
    (dryRun ? "would write" : "wrote") +
    " " +
    written +
    " document" +
    (written === 1 ? "" : "s") +
    ", " +
    fields +
    " field" +
    (fields === 1 ? "" : "s") +
    " converted; " +
    skipped +
    " already up to date.\n",
);
if (dryRun) console.log("  Dry run complete — nothing was written.\n");
