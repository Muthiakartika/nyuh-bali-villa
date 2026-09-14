/**
 * Uploads the site's photographs into Sanity and points the CMS at them.
 *
 *   npm run sanity:images:dry     # report only, writes nothing
 *   npm run sanity:images         # upload and patch
 *
 * ── What this is for ──────────────────────────────────────────────────
 *
 * Every image field in the CMS was seeded as a *hotlink*: an `externalUrl`
 * naming a file on nyuhbalivillas.com. Those files now live in this repo
 * (`public/uploads/`, see next.config.ts) because WordPress is being switched
 * off. That alone keeps the site working — but a photograph can still only be
 * changed by a developer editing a data file and deploying.
 *
 * After this runs, each image field carries a real uploaded asset, and
 * `resolveImageUrl` prefers an asset over `externalUrl`. Swapping a photograph
 * becomes dragging a file onto a field in the Studio: no code change, no
 * deploy. That is the whole point of running it — it is a capability change,
 * not a saving. `public/uploads/` stays exactly as it is, because it is still
 * the fallback that renders when Sanity is unconfigured or a document has not
 * been published.
 *
 * ── Why it is not `migrate.ts --upload-images --replace` ──────────────
 *
 * That flag exists and does the uploading, but it reaches the documents
 * through `--replace`, which is `createOrReplace` from the constants in
 * `src/data/`. It would therefore also overwrite every edit an author has made
 * in the Studio since the migration ran. This script never builds a document:
 * it reads whatever is published right now, changes only the image objects
 * inside it, and writes that same document back. An editor's copy, a swapped
 * heading, a reordered section — all survive, because they are carried along
 * untouched.
 *
 * ── Safety properties ────────────────────────────────────────────────
 *
 * **Idempotent.** Each asset is keyed by `source.id`, so a rerun finds the
 * existing asset instead of uploading a second copy, and an interrupted run
 * resumes rather than starting over.
 *
 * **`externalUrl` is kept, not replaced.** The asset wins at render time; the
 * URL stays as a second line of defence, and it is what the dry run diffs
 * against. Nothing is deleted by this script, ever.
 *
 * **Documents with no image change are not written at all**, so the publish
 * webhook does not fire 101 times for documents that did not change.
 *
 * **A document is only written if its own upload succeeded.** An image that
 * cannot be read or uploaded leaves that one field hotlinked and is reported;
 * it never blanks a field.
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

// ── Environment ────────────────────────────────────────────────────────
// Same handful of lines as scripts/cloudflare/env.mjs: Next loads .env.local
// for the app, a plain `node` script gets nothing, and `--env-file` would have
// to be remembered at every call site.
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
      "  The write token is an **Editor** token from sanity.io/manage → API → Tokens.\n" +
      "  See .env.example.\n",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", token, useCdn: false });

// ── Mapping a stored URL to a file on disk ─────────────────────────────

/**
 * The three host spellings the source uses, matching src/sanity/lib/uploads.ts.
 * Documents seeded before the assets were brought in-house hold absolute URLs;
 * anything seeded since holds `/uploads/...`. Both resolve to the same file.
 */
const LEGACY = /^https?:\/\/(?:www\.|preview\.)?nyuhbalivillas\.com\/wp-content\/uploads\//;

function localFileFor(url) {
  if (typeof url !== "string") return null;
  const relative = LEGACY.test(url)
    ? url.replace(LEGACY, "")
    : url.startsWith("/uploads/")
      ? url.slice("/uploads/".length)
      : null;
  if (!relative) return null;
  // Strip any query or fragment, and refuse to climb out of public/uploads.
  const clean = decodeURIComponent(relative.split(/[?#]/)[0]);
  if (clean.includes("..")) return null;
  const path = resolve(process.cwd(), "public", "uploads", clean);
  return existsSync(path) && statSync(path).isFile() ? path : null;
}

const CONTENT_TYPE = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
};

// ── Uploading ──────────────────────────────────────────────────────────

const assetCache = new Map();
const stats = { uploaded: 0, reused: 0, failed: 0, patched: 0, skipped: 0 };
const failures = [];

async function assetIdFor(url) {
  if (assetCache.has(url)) return assetCache.get(url);

  const file = localFileFor(url);
  if (!file) {
    failures.push(`no local file for ${url}`);
    stats.failed += 1;
    assetCache.set(url, null);
    return null;
  }

  // Keyed on the file's own path rather than the URL it happens to be stored
  // under, so the absolute and `/uploads/...` spellings of one photograph
  // share a single asset instead of uploading it twice.
  const relative = file.split(/[\\/]public[\\/]uploads[\\/]/)[1]?.replace(/\\/g, "/");
  const sourceId = `nbv-local:/uploads/${relative}`;

  if (dryRun) {
    stats.uploaded += 1;
    const stub = `image-DRYRUN-${assetCache.size}`;
    assetCache.set(url, stub);
    return stub;
  }

  let assetId = await client.fetch(
    `*[_type == "sanity.imageAsset" && source.id == $sourceId][0]._id`,
    { sourceId },
  );

  if (assetId) {
    stats.reused += 1;
  } else {
    try {
      const filename = relative.split("/").pop();
      const extension = filename.split(".").pop().toLowerCase();
      const asset = await client.assets.upload("image", readFileSync(file), {
        filename,
        contentType: CONTENT_TYPE[extension],
        source: { id: sourceId, name: "Nyuh Bali site assets", url: `/uploads/${relative}` },
      });
      assetId = asset._id;
      stats.uploaded += 1;
    } catch (error) {
      failures.push(`${relative}: ${error.message}`);
      stats.failed += 1;
      assetCache.set(url, null);
      return null;
    }
  }

  assetCache.set(url, assetId);
  return assetId;
}

// ── Walking a document ─────────────────────────────────────────────────

/**
 * Returns a copy of `value` with an `asset` reference added to every image
 * object that has a resolvable `externalUrl` and no asset yet, and reports
 * whether anything actually changed.
 *
 * An object already carrying an `asset` is left alone — that is an editor's
 * own upload, and this must never overwrite one.
 */
async function withAssets(value, changed) {
  if (Array.isArray(value)) {
    const next = [];
    for (const item of value) next.push(await withAssets(item, changed));
    return next;
  }

  if (!value || typeof value !== "object") return value;

  const next = {};
  for (const [key, item] of Object.entries(value)) {
    next[key] = await withAssets(item, changed);
  }

  const isImage = typeof next.externalUrl === "string" && !("_ref" in next);
  if (isImage && !next.asset) {
    const assetId = await assetIdFor(next.externalUrl);
    if (assetId) {
      next.asset = { _type: "reference", _ref: assetId };
      changed.count += 1;
      return next;
    }
  } else if (isImage && next.asset) {
    stats.skipped += 1;
  }

  return next;
}

// ── Run ────────────────────────────────────────────────────────────────

console.log(
  `\n  ${dryRun ? "DRY RUN — nothing will be written" : "Uploading"}  ` +
    `project ${projectId} / dataset ${dataset}\n`,
);

const documents = await client.fetch(
  `*[!(_id in path("drafts.**")) && !(_type match "sanity.*") && !(_type match "system.*")]`,
);
console.log(`  ${documents.length} published documents\n`);

let written = 0;
for (const document of documents) {
  const changed = { count: 0 };
  const next = await withAssets(document, changed);
  if (!changed.count) continue;

  stats.patched += changed.count;
  written += 1;
  const label = `${document._type} ${document.path ?? document.slug?.current ?? document._id}`;
  console.log(`  ${changed.count.toString().padStart(3)} image(s)  ${label}`);
  if (!dryRun) await client.createOrReplace(next);
}

console.log(
  `\n  documents ${dryRun ? "that would change" : "written"}: ${written}` +
    `\n  image fields given an asset: ${stats.patched}` +
    `\n  assets uploaded: ${stats.uploaded}   reused: ${stats.reused}` +
    `\n  fields left alone (already had an upload): ${stats.skipped}` +
    `\n  failures: ${stats.failed}`,
);
for (const failure of failures.slice(0, 20)) console.log(`    ! ${failure}`);
if (failures.length > 20) console.log(`    … and ${failures.length - 20} more`);

console.log(
  dryRun
    ? "\n  Dry run complete — nothing was written.\n"
    : "\n  Done. Publishing is unaffected: externalUrl was kept on every field.\n",
);

if (stats.failed) process.exitCode = 1;
