/**
 * What the Cloudflare scripts read from the environment, and from
 * `.env.local` when running locally.
 *
 * Next loads `.env.local` for the app; a plain `node` script gets nothing, and
 * `--env-file` would have to be remembered at every call site. This is the
 * same handful of lines, kept in one place.
 *
 * **Two tokens, deliberately.** `CLOUDFLARE_PURGE_TOKEN` is the one the site
 * itself uses and the only one that belongs in a deployment's environment: its
 * single permission is Zone → Cache Purge → Purge, so it is worthless to
 * anyone who steals it. `CLOUDFLARE_RULES_TOKEN` is the wider one that can edit
 * the zone's cache rules — a one-off admin job, kept on a developer's machine.
 * A token that can repoint a domain should not be sitting in a build.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnvLocal() {
  for (const file of [".env.local", ".env"]) {
    let contents;
    try {
      contents = readFileSync(resolve(process.cwd(), file), "utf8");
    } catch {
      continue; // Not an error: CI sets real environment variables instead.
    }

    for (const line of contents.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue; // A real env var wins.
      process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadDotEnvLocal();

export const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();
/** Purge only. This is the one the running site holds. */
export const purgeToken = process.env.CLOUDFLARE_PURGE_TOKEN?.trim();
/** Wider — edits cache rules. Local admin use only, never in a deployment. */
export const rulesToken = process.env.CLOUDFLARE_RULES_TOKEN?.trim();
export const siteUrl = process.env.SITE_URL?.trim();

/**
 * `requireEnv({ CLOUDFLARE_ZONE_ID: zoneId, … })` — exits naming what is
 * missing, and naming the right place to put it, because the two places are
 * different.
 *
 * On a developer's machine the answer is `.env.local`. **In CI there is no
 * such file and never will be**, so a message pointing at one sends whoever
 * reads the log looking for something that does not exist — which is exactly
 * what happened when the purge workflow ran 23 times without its repository
 * secrets and reported `Missing in .env.local` on a runner.
 *
 * `CI` is set by GitHub Actions and by every other CI worth the name. The
 * `::error::` annotation puts the reason on the run's summary page rather
 * than only inside the step's log, which is the difference between a red
 * tick someone reads and one they scroll past.
 */
export function requireEnv(values, hint = "See README-CLOUDFLARE.md.") {
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length === 0) return;

  const names = missing.join(", ");

  if (process.env.CI) {
    console.error(
      `::error::Missing environment variables: ${names}. Add them under ` +
        "Settings -> Secrets and variables -> Actions.",
    );
    console.error(
      `\n  Missing environment variables: ${names}\n\n` +
        "  This is CI, so there is no .env.local to fix — these come from\n" +
        "  the repository's own secrets:\n" +
        "  Settings -> Secrets and variables -> Actions.\n\n" +
        `  ${hint}\n`,
    );
  } else {
    console.error(`\n  Missing in .env.local: ${names}\n\n  ${hint}\n`);
  }

  process.exit(1);
}

/**
 * One fetch against Cloudflare's v4 API, with its two failure shapes folded
 * into one: a rejected call answers 200 with `success: false` as readily as it
 * answers 4xx.
 */
export async function cloudflare(token, path, init = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  let payload = null;
  const text = await response.text().catch(() => "");
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    /* Not JSON — the raw text is more useful than a parse error. */
  }

  return { ok: response.ok, status: response.status, text, json: payload };
}

/** The same call, but throwing on failure — what the rules script wants. */
export async function cloudflareOrThrow(token, path, init = {}) {
  const result = await cloudflare(token, path, init);
  if (!result.ok || result.json?.success === false) {
    const detail =
      result.json?.errors?.map((error) => `${error.code ?? "?"}: ${error.message ?? ""}`).join("; ") ||
      `HTTP ${result.status}`;
    throw new Error(detail);
  }
  return result.json?.result;
}
