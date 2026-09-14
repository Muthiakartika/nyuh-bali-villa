/**
 * Cache CLI — `npm run cache:check` and `npm run cache:purge`.
 *
 * Companion to the purge that runs inside the site (`src/server/cloudflare.ts`),
 * and for the same reason the Sanity Studio is the worst place to find out a
 * token is wrong: a failed purge there is one line in a server log nobody is
 * reading, behind a Publish button that reported success.
 *
 *   cache:check  Verifies the token is live and reports what the edge is
 *                currently holding. Changes NOTHING — safe against a
 *                production zone at any time.
 *   cache:purge  Actually empties the zone (or the paths given). Prints the
 *                edge state before and after, because this one cannot be
 *                undone by waiting.
 *
 * ## Why check does not purge
 *
 * There is no dry run for a purge, so the two things worth knowing before
 * running one are split out: is the token valid (`/user/tokens/verify`, which
 * needs no zone permission at all), and is the zone id even the right shape.
 * That catches the two failures that actually happen — a token created with
 * the wrong permission, and an Account ID pasted where a Zone ID belongs —
 * without touching anything.
 */

import { pathToFileURL } from "node:url";

import { cloudflare, purgeToken, requireEnv, siteUrl, zoneId } from "./env.mjs";

/** Cloudflare's documented ceiling for `files` in one purge call. */
const MAX_URLS_PER_CALL = 30;

const TOKEN_HINT =
  "Zone ID:  dash.cloudflare.com → the domain → Overview → right sidebar\n" +
  "  Token:    My Profile → API Tokens → Create Custom Token, permission\n" +
  "            Zone → Cache Purge → Purge, limited to this one zone\n\n" +
  "  Full walkthrough: README-CLOUDFLARE.md";

function origin() {
  if (!siteUrl) return null;
  try {
    return new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).origin;
  } catch {
    return null;
  }
}

/** Cloudflare names its own failures precisely; explain the two that bite. */
function explain(json, status) {
  const codes = json?.errors ?? [];
  if (status === 401 || codes.some((e) => e.code === 1000 || e.code === 10000)) {
    return (
      "    The token is wrong, expired, or lacks the Cache Purge permission.\n" +
      "    Create a new one: My Profile → API Tokens → Create Custom Token,\n" +
      "    permission Zone → Cache Purge → Purge."
    );
  }
  if (codes.some((e) => e.code === 7003 || e.code === 7000)) {
    return (
      "    The zone id is not recognised. The most common cause is pasting\n" +
      "    the ACCOUNT ID instead — both are 32 hex characters and they sit\n" +
      "    next to each other on the Overview page. The Zone ID is the one\n" +
      "    listed under the domain name."
    );
  }
  return null;
}

/** What the edge is serving right now, so a purge can be seen to work. */
async function edgeState(url) {
  if (!url) return { skipped: true };
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    return {
      status: response.status,
      cache: response.headers.get("cf-cache-status") || "(none)",
      age: response.headers.get("age") || "0",
      control: response.headers.get("cache-control") || "(none)",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function printEdge(label, edge, url) {
  if (edge.skipped) {
    console.log(`  ${label} not checked — set SITE_URL to probe the live edge.`);
    return;
  }
  if (edge.error) {
    console.log(`  ${label} could not reach ${url} — ${edge.error}`);
    return;
  }
  const seconds = Number(edge.age);
  const age =
    seconds > 86400 ? `${edge.age}s  (${Math.round((seconds / 86400) * 10) / 10} days)` : `${edge.age}s`;
  console.log(`  ${label}`);
  console.log(`    url              ${url}`);
  console.log(`    cf-cache-status  ${edge.cache}`);
  console.log(`    age              ${age}`);
  console.log(`    cache-control    ${edge.control}`);
}

/* ── check ───────────────────────────────────────────────────────────── */

async function check() {
  requireEnv({ CLOUDFLARE_ZONE_ID: zoneId, CLOUDFLARE_PURGE_TOKEN: purgeToken }, TOKEN_HINT);

  console.log("\n  Cloudflare cache purge configuration\n");
  console.log(`  zone id   ${zoneId}`);
  console.log(`  token     ${purgeToken.slice(0, 6)}…${purgeToken.slice(-4)}\n`);

  if (!/^[0-9a-f]{32}$/i.test(zoneId)) {
    console.log("  ✗ zone id is not 32 hex characters — that is not a Zone ID\n");
    process.exit(1);
  }
  console.log("  ✓ zone id has the right shape");

  const verify = await cloudflare(purgeToken, "/user/tokens/verify");
  if (!verify.ok || verify.json?.success !== true) {
    console.error("  ✗ token rejected\n");
    const hint = explain(verify.json, verify.status);
    console.error(hint ? `${hint}\n` : `    ${verify.text}\n`);
    process.exit(1);
  }
  console.log(`  ✓ token is live (status: ${verify.json?.result?.status ?? "active"})`);

  console.log(
    "\n  Nothing was purged. This only read the token — run\n" +
      "  `npm run cache:purge` to actually empty the zone.\n",
  );

  const url = origin() ? `${origin()}/` : null;
  printEdge("What the edge is serving right now:", await edgeState(url), url);
  console.log("");
}

/* ── purge ───────────────────────────────────────────────────────────── */

function toAbsolute(value) {
  if (/^https?:\/\//i.test(value)) return value;
  const base = origin();
  if (!base) {
    console.error(`\n  Cannot turn "${value}" into a URL without SITE_URL.\n`);
    process.exit(1);
  }
  return new URL(value, base).toString();
}

async function purge() {
  requireEnv({ CLOUDFLARE_ZONE_ID: zoneId, CLOUDFLARE_PURGE_TOKEN: purgeToken }, TOKEN_HINT);

  const args = process.argv.slice(3).filter((value) => !value.startsWith("--"));
  const files = args.length > 0 ? [...new Set(args.map(toAbsolute))] : null;

  const probe = files ? files[0] : origin() ? `${origin()}/` : null;
  console.log("");
  printEdge("Before:", await edgeState(probe), probe);

  // Cloudflare takes at most 30 URLs per call, so a wide list is several.
  const bodies = files
    ? Array.from({ length: Math.ceil(files.length / MAX_URLS_PER_CALL) }, (_, index) => ({
        files: files.slice(index * MAX_URLS_PER_CALL, (index + 1) * MAX_URLS_PER_CALL),
      }))
    : [{ purge_everything: true }];

  for (const body of bodies) {
    const result = await cloudflare(purgeToken, `/zones/${zoneId}/purge_cache`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!result.ok || result.json?.success !== true) {
      console.error(`\n  ✗ purge refused (HTTP ${result.status})\n`);
      const hint = explain(result.json, result.status);
      console.error(hint ? `${hint}\n` : `    ${result.text}\n`);
      process.exit(1);
    }
  }

  if (files) {
    console.log(`\n  ✓ purged ${files.length} URL(s)\n`);
    for (const file of files) console.log(`    ${file}`);
    console.log("");
  } else {
    console.log("\n  ✓ zone purged\n");
  }

  const after = await edgeState(probe);
  printEdge("After:", after, probe);

  if (!after.skipped && !after.error) {
    if (after.cache !== "HIT") {
      console.log("\n  The edge no longer has a cached copy — that is the proof.\n");
    } else {
      console.log(
        "\n  Still a HIT. Cloudflare has many edge locations and this request\n" +
          "  may have reached a different one; try again in a few seconds.\n",
      );
    }
  }
}

/* ── entry ───────────────────────────────────────────────────────────── */

const run = { check, purge }[process.argv[2]];

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  if (!run) {
    console.error("\n  usage: npm run cache:check | npm run cache:purge [-- /path …]\n");
    process.exit(1);
  }
  run().catch((error) => {
    console.error(`\n  ✗ ${error?.message ?? error}\n`);
    process.exit(1);
  });
}
