import { SITE_ORIGIN } from "@/data/origin";
import type { PurgeTarget } from "./purgeTargets";

/**
 * Make the origin regenerate the pages a publish changed, *before* the edge
 * copy is dropped.
 *
 * ## The failure this exists for
 *
 * `revalidateTag` does not rebuild anything. It marks a page stale, and the
 * rebuild happens on the next request for it. So the old sequence —
 * revalidate, purge — left a window where Cloudflare had nothing cached and
 * the origin had not rebuilt yet, and **Cloudflare caches whatever the origin
 * answers on the first request after a purge**. A visitor arriving in that
 * window got the pre-publish page, and so did the edge, for the full one-day
 * TTL, with nothing anywhere saying so.
 *
 * It is not theoretical. An editor uploaded a menu PDF to `/suite-directory`,
 * published, and the edge went on serving the old button for minutes: `HIT`
 * at age 104s with no `cdn.sanity.io` link in it, while the same page fetched
 * straight from the origin already had one. One manual purge fixed it, which
 * is exactly the evidence that the origin was fine and only the timing was
 * wrong.
 *
 * ## Why two rounds
 *
 * Which round matters depends on behaviour this code deliberately does not
 * try to determine. If Next blocks and rebuilds, round one does the work and
 * round two is a cheap confirmation. If it serves the stale copy and rebuilds
 * behind it, round one takes the stale copy and triggers the rebuild, and
 * round two lands after it. Two rounds with a gap are correct either way,
 * which is better than being right about the current implementation.
 *
 * ## Why the query string
 *
 * A request to the clean URL would be answered by Cloudflare and never reach
 * the origin, which is the one thing this has to do. A URL the edge has never
 * seen is a miss. Next serves a statically generated route the same for any
 * query it does not read, and the rebuild is keyed on the pathname, so the
 * warm and the real page are the same cache entry. The two rounds must use
 * *different* query strings or the second is answered by the edge copy of the
 * first. The junk entries they leave behind are dropped by the purge this
 * runs in front of — worth knowing if `CLOUDFLARE_PURGE_MODE=urls` is ever
 * set, because a URL-mode purge names the real paths and would leave them.
 */

/** Bounds the work: a publish's target is normally one to five paths. */
const MAX_PATHS = 8;
const ROUND_GAP_MS = 750;
/**
 * Generous on purpose. A cold render of a blog post measured 3127ms against a
 * production build, so the first 3000ms value aborted three warms of four and
 * reported a failure on work that was fine. Round one is only a trigger and
 * round two normally answers from the rebuilt copy in tens of milliseconds,
 * so the typical cost of this ceiling is nothing and the worst case is bounded
 * well inside `maxDuration`.
 */
const REQUEST_TIMEOUT_MS = 5000;

export type WarmOutcome =
  /** A site-wide purge — see the note on `everything` below. */
  | { warmed: false; reason: "site-wide" | "nothing-to-warm" }
  /**
   * `ready` counts the *second* round only, which is the one that says
   * anything: round one may legitimately time out on a cold render while
   * still starting the rebuild it exists to start. Reporting its failures
   * would call a working warm broken.
   */
  | { warmed: true; paths: number; ready: number; truncated: boolean };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function warmOnce(path: string, round: number, stamp: number): Promise<boolean> {
  try {
    const response = await fetch(`${SITE_ORIGIN}${path}?__warm=${round}-${stamp}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { "user-agent": "nyuhbali-publish-warm" },
    });
    // Drain the body: an undrained response can be cancelled before the origin
    // has finished rendering, which is the work this is here to cause.
    await response.arrayBuffer();
    return response.ok;
  } catch {
    return false;
  }
}

export async function warmOrigin(target: PurgeTarget): Promise<WarmOutcome> {
  // **A site-wide publish is deliberately not warmed.** `property`,
  // `siteSettings` and `testimonial` change all 77 pages, and warming 77
  // pages inside the request an editor is waiting on is not a trade worth
  // making — it would put the Studio's Publish button behind a minute of our
  // own traffic. Those publishes still purge; they keep the old window, and
  // they are also the rarest kind.
  if (target.everything) return { warmed: false, reason: "site-wide" };
  if (target.paths.length === 0) return { warmed: false, reason: "nothing-to-warm" };

  const paths = target.paths.slice(0, MAX_PATHS);
  const stamp = Date.now();

  await Promise.all(paths.map((path) => warmOnce(path, 1, stamp)));
  await sleep(ROUND_GAP_MS);
  const second = await Promise.all(paths.map((path) => warmOnce(path, 2, stamp)));

  const ready = second.filter(Boolean).length;

  if (ready < paths.length) {
    // Not fatal, and deliberately not a reason to skip the purge: a stale edge
    // is the worse outcome. It is worth a line because it means the window
    // this closes was left open for those paths.
    console.warn(
      `[warm] ${paths.length - ready} of ${paths.length} paths did not answer before the purge; ` +
        "the edge may cache a pre-publish copy of them until the next publish or purge.",
    );
  }

  return {
    warmed: true,
    paths: paths.length,
    ready,
    truncated: target.paths.length > paths.length,
  };
}
