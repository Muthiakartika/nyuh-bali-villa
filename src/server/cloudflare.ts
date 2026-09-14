import "server-only";

/**
 * Cloudflare cache purge, over Cloudflare's v4 REST API.
 *
 * **No SDK dependency**, for the reason `sendgrid.ts` gives at length: this is
 * one POST against a documented, stable endpoint, and this repo has already
 * lost a Vercel deployment to a dependency that installed fine locally.
 *
 * ## Why this exists at all
 *
 * Publishing in the Studio invalidates Next's own cache through
 * `revalidateTag` — that is what `/api/revalidate/sanity` has always done, and
 * on a site served straight from Vercel it is the whole story. Behind
 * Cloudflare it is only half of one: with the HTML cache rule in place (see
 * README-CLOUDFLARE.md) the edge holds its own copy of every page, and an
 * origin that has quietly regenerated changes nothing for a visitor whose
 * request never reaches it. The edge copy has to be dropped explicitly, and
 * that is this file.
 *
 * ## Ordering
 *
 * The route revalidates first and purges second. `revalidateTag(tag,
 * { expire: 0 })` says nothing carrying the tag may be served at any age, so
 * the first request after it regenerates rather than serving stale — which
 * matters here, because Cloudflare's first request after a purge is what it
 * then caches. Purging before revalidating would risk re-caching the page we
 * are trying to replace.
 *
 * ## Configuration
 *
 *   CLOUDFLARE_ZONE_ID      the zone's id, on the domain's Overview page
 *   CLOUDFLARE_PURGE_TOKEN  an API token whose ONLY permission is
 *                           Zone → Cache Purge → Purge
 *
 * Until both are set this is a no-op, so the webhook keeps working exactly as
 * it did before and the integration can be switched on after the domain is cut
 * over rather than in the same change. `npm run cache:check` verifies both
 * without purging anything.
 *
 * Credentials are read per request rather than at module load, so rotating the
 * token in Cloudflare's dashboard takes effect on the next publish instead of
 * the next deploy.
 */

import { type PurgeTarget } from "@/server/purgeTargets";

const API_BASE = "https://api.cloudflare.com/client/v4";

/** Cloudflare's documented ceiling for `files` in one purge call. */
const MAX_URLS_PER_CALL = 30;

/**
 * Bounded, because this sits between an editor pressing Publish and Sanity
 * being told the webhook succeeded. Cloudflare being slow must not become the
 * Studio being slow — and an unbounded `fetch` here would hold the request
 * open until the platform's own timeout.
 *
 * It is still `await`ed rather than fired and forgotten: on a serverless
 * runtime an unawaited fetch is cancelled the moment the response is sent, so
 * the purge would work locally and silently never happen in production.
 */
const PURGE_TIMEOUT_MS = 8000;

export type PurgeOutcome =
  | { ok: true; purged: true; scope: "everything" | "urls"; urls: number }
  /** No zone id or token configured — nothing was purged, and the caller
   * decides what that means. Kept distinct from a failure so a preview
   * deployment with no Cloudflare in front of it is not reported as broken. */
  | { ok: true; purged: false; reason: "not-configured" }
  | { ok: false; reason: "rejected" | "unreachable"; detail: string };

type CloudflareResponse = {
  success?: boolean;
  errors?: { code?: number; message?: string }[];
};

/**
 * The origin Cloudflare knows this site by.
 *
 * Purge-by-URL matches the absolute URL the edge stored, so this has to be the
 * proxied public domain — not `VERCEL_URL`, which is the unproxied
 * `*.vercel.app` host and holds nothing Cloudflare cached. Unset, the purge
 * silently widens to the whole zone rather than posting URLs that match
 * nothing; see `resolveTarget`.
 */
function siteOrigin(): string | null {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw.startsWith("http") ? raw : `https://${raw}`).origin;
  } catch {
    return null;
  }
}

/**
 * Purge-everything is the default, and deliberately so.
 *
 * A URL purge only drops the exact URLs it is given, and a page arrived at
 * with `?utm_source=…` is a different cache entry from the same page without
 * it — so precisely the traffic a campaign sends would keep the old copy.
 * Against that, this site is 74 static pages that Vercel regenerates in
 * milliseconds and publishes are occasional, so a full purge costs close to
 * nothing. Set `CLOUDFLARE_PURGE_MODE=urls` to trade that for precision on a
 * busier zone, and read the caveat in README-CLOUDFLARE.md first.
 */
function resolveTarget(target: PurgeTarget): { files: string[] } | null {
  if (target.everything) return null;
  if (process.env.CLOUDFLARE_PURGE_MODE?.trim() !== "urls") return null;

  const origin = siteOrigin();
  if (!origin) return null;

  const files = [...new Set(target.paths.map((path) => new URL(path, origin).toString()))];
  return files.length > 0 ? { files } : null;
}

/** Cloudflare takes at most 30 URLs per call, so a wide purge is several. */
function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

/**
 * Never throws. A failed purge means content is stale for a while, which is
 * bad; a failed purge that also failed the publish it was called from would be
 * worse, so every path out of here is a returned outcome.
 */
export async function purgeCloudflare(target: PurgeTarget): Promise<PurgeOutcome> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();
  const purgeToken = process.env.CLOUDFLARE_PURGE_TOKEN?.trim();

  if (!zoneId || !purgeToken) {
    return { ok: true, purged: false, reason: "not-configured" };
  }

  const resolved = resolveTarget(target);
  const bodies = resolved
    ? chunk(resolved.files, MAX_URLS_PER_CALL).map((files) => ({ files }))
    : [{ purge_everything: true }];

  for (const body of bodies) {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/zones/${zoneId}/purge_cache`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${purgeToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(PURGE_TIMEOUT_MS),
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error("[cloudflare] purge failed:", detail);
      return { ok: false, reason: "unreachable", detail };
    }

    // Cloudflare answers 200 with `success: false` for a rejected purge as
    // readily as it answers 4xx, so both have to be checked.
    let payload: CloudflareResponse = {};
    try {
      payload = (await response.json()) as CloudflareResponse;
    } catch {
      // A non-JSON body is only useful as the status code below.
    }

    if (!response.ok || payload.success === false) {
      // Cloudflare names its own failures precisely, so pass them through
      // rather than summarising: 10000 is the token, 7003 the zone id.
      const detail =
        payload.errors?.map((error) => `${error.code ?? "?"}: ${error.message ?? ""}`).join("; ") ||
        `HTTP ${response.status}`;
      console.error("[cloudflare] purge failed:", detail);
      return { ok: false, reason: "rejected", detail };
    }
  }

  return resolved
    ? { ok: true, purged: true, scope: "urls", urls: resolved.files.length }
    : { ok: true, purged: true, scope: "everything", urls: 0 };
}
