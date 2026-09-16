/**
 * The zone's Cache Rules, as data — and the script that applies them.
 *
 *     npm run cloudflare:rules:dry    # print what would be sent
 *     npm run cloudflare:rules        # apply to CLOUDFLARE_ZONE_ID
 *
 * They live here rather than only in the dashboard so that what the edge is
 * doing is reviewable in a diff, and so a zone can be rebuilt from the repo.
 * README-CLOUDFLARE.md walks through the same four rules for anyone who would
 * rather click them in.
 *
 * ## The one idea the whole design rests on
 *
 * **Long edge TTL, no browser TTL of our own.** Cloudflare holds a page for a
 * day so almost no visitor waits for the origin; the browser is left with
 * whatever Next already sends for a prerendered page (`max-age=0,
 * must-revalidate`), so it re-asks Cloudflare on every navigation. That is
 * what makes a purge take effect for everyone at once: there is no copy
 * anywhere that a purge cannot reach. Override `browser_ttl` with a long value
 * and you buy a little speed and lose that property completely — a visitor who
 * loaded the old page keeps it until their own clock runs out, and no purge,
 * publish or redeploy can reach them.
 *
 * ## Why the four expressions do not overlap
 *
 * Cloudflare evaluates every matching rule in this phase and later matches win
 * on conflicting settings. Rather than depend on that, the three expressions
 * below are written to be mutually exclusive, so the order they sit in cannot
 * change the outcome. Rule 4 carries the exclusions that make that true: it is
 * "everything the first three did not claim", spelled out.
 */

import { pathToFileURL } from "node:url";

import { rulesToken, cloudflareOrThrow, requireEnv, zoneId } from "./env.mjs";

/**
 * The hostnames this site answers on, and the reason every rule below is
 * scoped to them.
 *
 * A Cloudflare zone covers the apex *and every subdomain of it*, so a rule
 * matched on path alone applies to all of them — including
 * `booking.nyuhbalivillas.com`, which is the STAAH booking engine. Telling
 * Cloudflare to hold that for a day would freeze a live availability calendar
 * with a nightly rate on every date. The zone's previous WordPress rules were
 * scoped this way too (`URI Full wildcard https://nyuhbalivillas.com/*`), just
 * by accident of how the template was written — and they missed `www.`
 * entirely, which is the one thing to fix rather than copy.
 *
 * `ubudnyuhbali.com` is deliberately absent: it carries Ubud's email and does
 * not serve this site.
 */
const HOSTS = '(http.host in {"nyuhbalivillas.com" "www.nyuhbalivillas.com"})';

/** Requests that must never be served from a cache. */
const NEVER_CACHE =
  '(starts_with(http.request.uri.path, "/api/")) or ' +
  '(http.request.uri.path eq "/api") or ' +
  '(starts_with(http.request.uri.path, "/studio")) or ' +
  '(starts_with(http.request.uri.path, "/_next/image")) or ' +
  '(http.cookie contains "__prerender_bypass") or ' +
  '(http.cookie contains "__next_preview_data")';

export const CACHE_RULES = [
  {
    // 1. Anything dynamic or private.
    //
    //  - /api/*   every form posts to /api/contact, and /api/revalidate/sanity
    //             is the publish webhook. A cached answer to either is a bug.
    //  - /studio  the embedded Sanity Studio, which is an application, not a
    //             page, and is signed in as a person.
    //  - /_next/image  the optimizer answers WebP or AVIF depending on the
    //             request's Accept header and marks that with `Vary: Accept`.
    //             Cloudflare ignores Vary outside Enterprise, so caching this
    //             here risks handing AVIF to a browser that cannot read it.
    //             Vercel caches these at its own edge already, so bypassing
    //             costs a hop rather than the work. (If you ever want them at
    //             Cloudflare's edge, drop AVIF first: `images.formats:
    //             ["image/webp"]` in next.config.ts removes the ambiguity.)
    //  - the two draft-mode cookies. A visitor never has them; an editor
    //             previewing unpublished content does, and that content must
    //             not be stored at the edge where the public would be served
    //             it.
    description: "nbv: bypass cache (API, Studio, image optimizer, draft mode)",
    expression: `${HOSTS} and (${NEVER_CACHE})`,
    action: "set_cache_settings",
    action_parameters: { cache: false },
  },
  {
    // 2. Next's build output. Every filename carries a content hash and the
    // origin already says `immutable`, so there is nothing to decide here —
    // respecting the origin is both correct and self-maintaining.
    description: "nbv: immutable build assets",
    expression: `${HOSTS} and (starts_with(http.request.uri.path, "/_next/static/"))`,
    action: "set_cache_settings",
    action_parameters: {
      cache: true,
      edge_ttl: { mode: "respect_origin" },
      browser_ttl: { mode: "respect_origin" },
    },
  },
  {
    // 3. The 352 files carried over from WordPress's media library — 315
    // photographs and 37 menu PDFs, under its own /YYYY/MM/ layout.
    //
    // Respect origin rather than a number here, because `next.config.ts`
    // already sends `public, max-age=2592000` for `/uploads/*` and one place
    // to state a figure is better than two that can drift apart. If that
    // header ever goes missing the fallback is Vercel's `max-age=0,
    // must-revalidate`, so the edge stops caching these rather than caching
    // them wrongly — the safe direction to fail in.
    //
    // They need their own rule because rule 4's one-day edge TTL is chosen
    // for *pages*, whose whole point is that a publish changes them. A
    // photograph at a fixed path does not change; capping it at a day would
    // have Cloudflare re-fetch 352 files from Vercel daily for nothing.
    description: "nbv: media library",
    expression: `${HOSTS} and (starts_with(http.request.uri.path, "/uploads/"))`,
    action: "set_cache_settings",
    action_parameters: {
      cache: true,
      edge_ttl: { mode: "respect_origin" },
      browser_ttl: { mode: "respect_origin" },
    },
  },
  {
    // 4. Everything else — which on this site means the 74 prerendered pages.
    //
    // Vercel sends `max-age=0, must-revalidate` for a prerendered page, which
    // is right for the browser and wrong for a CDN: taken literally it would
    // make Cloudflare re-ask the origin for every visitor and the zone would
    // buy nothing. So the edge TTL is overridden and the browser TTL is left
    // alone.
    //
    // **One day, not thirty.** Publishing drops the edge copy within the
    // second, so this number is only ever how long a page nobody edited stays
    // warm — which makes it worth choosing for the case where the purge
    // *fails* rather than the case where it works. A token revoked, a WAF rule
    // added in front of the webhook, an outage: with a month the wrong page
    // survives a month, and nothing in the Studio would say so. With a day the
    // site heals itself overnight. The speed difference is close to nil — a
    // page anyone visits stays hot, and one nobody visits was cold either way.
    description: "nbv: cache pages at the edge",
    expression:
      `${HOSTS} and ` +
      '(not starts_with(http.request.uri.path, "/api/")) and ' +
      '(http.request.uri.path ne "/api") and ' +
      '(not starts_with(http.request.uri.path, "/studio")) and ' +
      '(not starts_with(http.request.uri.path, "/_next/")) and ' +
      '(not starts_with(http.request.uri.path, "/uploads/")) and ' +
      '(not http.cookie contains "__prerender_bypass") and ' +
      '(not http.cookie contains "__next_preview_data")',
    action: "set_cache_settings",
    action_parameters: {
      cache: true,
      edge_ttl: { mode: "override_origin", default: 86400 },
      browser_ttl: { mode: "respect_origin" },
    },
  },
];

const PHASE = "http_request_cache_settings";
const ENTRYPOINT = `/zones/${zoneId}/rulesets/phases/${PHASE}/entrypoint`;

/** Rules this file owns. Anything else in the zone was put there by a person. */
const isOurs = (rule) => (rule.description ?? "").startsWith("nbv: ");

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");

  if (dryRun) {
    console.log(JSON.stringify({ rules: CACHE_RULES }, null, 2));
    return;
  }

  requireEnv(
    { CLOUDFLARE_ZONE_ID: zoneId, CLOUDFLARE_RULES_TOKEN: rulesToken },
    "This needs the WIDER token — Zone → Cache Rules → Edit — not the " +
      "purge-only\n  one the site runs on. See README-CLOUDFLARE.md.",
  );

  // A PUT replaces the entire phase, so look at what is there first — a rule
  // somebody added in the dashboard would disappear without this check.
  let existing = [];
  try {
    existing = (await cloudflareOrThrow(rulesToken, ENTRYPOINT))?.rules ?? [];
  } catch (error) {
    // A zone with no cache rules yet has no entrypoint ruleset at all.
    if (!/10\d{3}|not found/i.test(String(error.message))) throw error;
  }

  const foreign = existing.filter((rule) => !isOurs(rule));
  if (foreign.length > 0 && !force) {
    console.error(
      `Refusing to overwrite ${foreign.length} cache rule(s) this script did not write:`,
    );
    for (const rule of foreign) {
      console.error(`  - ${rule.description || "(no description)"}\n      ${rule.expression}`);
    }
    console.error(
      "\nFold them into scripts/cloudflare/cache-rules.mjs, or re-run with --force to discard them.",
    );
    process.exit(1);
  }

  const result = await cloudflareOrThrow(rulesToken, ENTRYPOINT, {
    method: "PUT",
    body: JSON.stringify({ rules: CACHE_RULES }),
  });

  console.log(`Applied ${result.rules?.length ?? 0} cache rule(s) to zone ${zoneId}:`);
  for (const rule of result.rules ?? []) console.log(`  - ${rule.description}`);
}

// Only run when invoked directly; importing this file just wants CACHE_RULES.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
