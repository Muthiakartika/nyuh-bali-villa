/**
 * Points the two Dining pages at the same menu files the in-room pages serve.
 *
 *   npm run sanity:menus:dry   # report only, writes nothing
 *   npm run sanity:menus       # apply
 *
 * ── The problem ──────────────────────────────────────────────────────
 *
 * The same menu existed as two different PDFs. `/seminyak/dining` linked what
 * the live dining page linked in 2023; `/seminyak-directory` — built later,
 * from the cards guests actually scan in their rooms — linked a newer file.
 * So a guest at the QR code and a guest on the website could be reading
 * different prices for the same dish.
 *
 * Six pairs, established from each PDF's own `ModDate` rather than its
 * `/YYYY/MM/` folder, because the folder is only when WordPress received the
 * upload:
 *
 *   Seminyak à la carte     2023-01-27  ->  (2025/03 upload)
 *   Seminyak breakfast      2022-08-04  ->  2023-12-08
 *   Seminyak CLD + BBQ      (2023/03)   ->  2023-12-22
 *   Ubud breakfast          2023-08-19  ->  (2024/08 upload)
 *   Ubud all-day/à la carte 2025-06-13  ->  2025-10-08
 *   Ubud candle-light       2023-05-01  ->  2023-11-19
 *
 * ── Safety ───────────────────────────────────────────────────────────
 *
 * Matches on the exact old path and rewrites only that, so it cannot touch a
 * button an editor has since repointed. Idempotent: a document already on the
 * new file is skipped and not written, so the publish webhook does not fire
 * for it. `src/data/pages/*-dining.ts` carries the same six changes, so the
 * CMS and the fallback stay in step.
 *
 * It does **not** touch the in-room pages: those are the source of truth here.
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

for (const file of [".env.local", ".env"]) {
  let contents;
  try {
    contents = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
  } catch {
    continue;
  }
  for (const line of contents.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const dryRun = process.argv.includes("--dry-run");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error("\n  Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.\n");
  process.exit(1);
}

const client = createClient({
  projectId, dataset, apiVersion: "2025-02-19", token, useCdn: false,
});

/** old path fragment -> new path fragment. */
const MOVES = new Map([
  ["2023/03/Nyuh-Bali-Villas-Ala-Carte-Menu.pdf", "2025/03/Seminyak-Ala-carte-Menu.pdf"],
  ["2023/03/Breakfast-Menu-Seminyak.pdf", "2023/12/Breakfast-Menu-Seminyak.pdf"],
  ["2023/03/CLD-BBQ-Menu-Seminyak.pdf", "2023/12/CLD-BBQ-Menu-Seminyak.pdf"],
  ["2023/08/Villas-Breakfast-Ubud.pdf", "2024/08/Breakfast-Menu-Ubud-Nyuh-Bali-Resort.pdf"],
  ["2025/06/All-Day-Menu-Villa.pdf", "2025/10/Ala-Carte-Villa.pdf"],
  ["2023/05/CLD-Menu-Ubud-010523.pdf", "2023/11/CLD-Menu-Ubud.pdf"],
]);

// Every target must be on disk, or the button would 404 once WordPress is off.
const missing = [...MOVES.values()].filter((f) => !fs.existsSync(path.join("public/uploads", f)));
if (missing.length) {
  console.error("\n  These replacement files are not in public/uploads:\n" +
    missing.map((f) => "   " + f).join("\n") + "\n");
  process.exit(1);
}

function rewrite(node, hits) {
  if (Array.isArray(node)) return node.forEach((n) => rewrite(n, hits));
  if (!node || typeof node !== "object") return;
  if (typeof node.href === "string") {
    for (const [from, to] of MOVES) {
      if (node.href.includes(from)) {
        hits.push(`${node.label ?? "(no label)"}: ${from} -> ${to}`);
        node.href = node.href.replace(from, to);
        break;
      }
    }
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("_")) continue;
    if (v && typeof v === "object") rewrite(v, hits);
  }
}

console.log(`\n  ${dryRun ? "DRY RUN — nothing will be written" : "WRITING"}  ${projectId}/${dataset}\n`);

// Only the two Dining pages. The in-room pages already hold the current files
// and are what the rest is being brought into line with.
const docs = await client.fetch(
  '*[_type == "page" && path in ["/seminyak/dining", "/ubud/dining"]] | order(path asc)',
);

let written = 0;
let changes = 0;
for (const doc of docs) {
  const copy = JSON.parse(JSON.stringify(doc));
  const hits = [];
  rewrite(copy, hits);
  if (!hits.length) {
    console.log(`  ${doc.path} — already current`);
    continue;
  }
  written += 1;
  changes += hits.length;
  console.log(`  ${doc.path}`);
  hits.forEach((h) => console.log("      " + h));
  if (!dryRun) await client.createOrReplace(copy);
}

console.log(
  `\n  ${dryRun ? "would update" : "updated"} ${written} document${written === 1 ? "" : "s"}, ` +
    `${changes} menu link${changes === 1 ? "" : "s"}.\n`,
);
if (dryRun) console.log("  Dry run complete — nothing was written.\n");
