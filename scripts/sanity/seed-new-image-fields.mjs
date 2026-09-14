/**
 * Fills the image fields added after the import had already run.
 *
 *   npm run sanity:seed-images:dry   # report only, writes nothing
 *   npm run sanity:seed-images       # fill, then run `npm run sanity:images`
 *
 * Three fields, all of them pictures that used to be written into a `.tsx`
 * file with no way to change them from the Studio:
 *
 *   siteSettings.homeLogo    the wordmark over the landing page's photographs
 *                            — the one route with no property document to
 *                            take a logo from, so it had none at all
 *   siteSettings.footerLogo  the mark in the footer's first column
 *   experience.cardImage     the thumbnail each personalised retreat shows
 *                            when it is listed at the foot of another one's
 *                            page, from `PERSONALISED_RETREATS`
 *
 * It sets `externalUrl` only. `npm run sanity:images` gives them real assets
 * afterwards, exactly as it does for every other image field — run it next.
 * Both are idempotent: a field that already holds something is left alone, so
 * this cannot overwrite an editor's own choice.
 *
 * The seeds are in `migrate.ts` too, so a fresh import needs none of this.
 */
import fs from "node:fs";
import { createClient } from "@sanity/client";
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
}
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
const dry = process.argv.includes("--dry-run");
const img = (url, alt) => ({ _type: "imageWithAlt", externalUrl: url, alt });

const CARD = {
  "retreat/couples": "/uploads/2023/03/ubud-yoga-4.webp",
  "retreat/luxury/balinese-healing": "/uploads/2023/04/Foto-09-11-20-16.49.06-2-Copy-min-1.jpg",
  "retreat/luxury/holistic-balancing": "/uploads/2023/03/Spa-ubud-slider-1.jpg",
  "retreat/luxury/new-beginning": "/uploads/2023/04/New-Beginning-1-min-1.jpg",
};

const settings = await client.fetch('*[_id == "siteSettings"][0]');
const settingsPatch = {};
if (!settings?.homeLogo) settingsPatch.homeLogo = img("/uploads/2023/04/logonyuhbali.webp", "Nyuh Bali Villas");
// The footer mark is decorative: the link around it already says where it goes.
if (!settings?.footerLogo) settingsPatch.footerLogo = img("/uploads/2022/12/Logo-Nyuh-Bali.png", "Nyuh Bali Villas");
if (Object.keys(settingsPatch).length) {
  console.log("  siteSettings <- " + Object.keys(settingsPatch).join(", "));
  if (!dry) await client.patch("siteSettings").set(settingsPatch).commit();
} else console.log("  siteSettings already set");

const experiences = await client.fetch('*[_type == "experience" && slug in $s]', { s: Object.keys(CARD) });
for (const e of experiences) {
  if (e.cardImage) { console.log("  " + e.slug + " already set"); continue; }
  console.log("  " + e.slug + " <- cardImage");
  if (!dry) await client.patch(e._id).set({ cardImage: img(CARD[e.slug], e.title) }).commit();
}
console.log(dry ? "\n  Dry run — nothing written.\n" : "\n  Done.\n");
