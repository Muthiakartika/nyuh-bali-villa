import { NextResponse } from "next/server";
import { purgeCloudflare } from "@/server/cloudflare";
import { revalidateDocumentTags } from "@/server/publishInvalidation";
import { purgeTargetFor, type PublishedDocument } from "@/server/purgeTargets";
import { warmOrigin } from "@/server/warmOrigin";

/**
 * Immediate, deterministic cache invalidation for published changes.
 *
 * There are two caches to clear, and behind a live domain both matter:
 *
 *  1. **Next's own**, via `revalidateTag`. On a site served straight from
 *     Vercel this is the whole story.
 *  2. **Cloudflare's edge**, via `purgeCloudflare`. With the HTML cache rule
 *     from README-CLOUDFLARE.md in place the edge answers most visitors
 *     without ever reaching the origin, so an origin that has quietly
 *     regenerated changes nothing for them until its copy is dropped.
 *
 * Order matters, and there are three steps rather than two: **revalidate,
 * warm, purge**. `revalidateTag` marks a page stale; it does not rebuild it,
 * and the rebuild happens on the next request. Purging straight afterwards
 * therefore left a window in which the edge had nothing and the origin had
 * not rebuilt — and **Cloudflare caches whatever the origin answers on the
 * first request after a purge**, so the window ended with the pre-publish
 * page pinned at the edge for the full TTL. `warmOrigin` closes it by making
 * that first request itself, before the purge. See the note there for the
 * publish this was found by, and for why a site-wide purge is not warmed.
 *
 * The site also runs a 60-second ISR fallback (see `sanity/lib/client.ts`), so
 * a missed or misconfigured webhook cannot freeze published content
 * indefinitely — it just delays it. The edge TTL is the one thing with no such
 * floor, which is why a failed purge is logged loudly below rather than
 * swallowed.
 */
/** Two warm rounds plus `purgeCloudflare`'s own 8s bound, with room to spare. */
export const maxDuration = 30;

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: PublishedDocument = {};
  try {
    body = (await request.json()) as PublishedDocument;
  } catch {
    // A global invalidation still works for webhooks without a projection.
  }

  // The tag list is shared with `/api/purge/sweep`, which does this same
  // work when a publish never reaches this route. Two copies of it would
  // drift, and a sweep that invalidated *nearly* what a publish does is worse
  // than no sweep: it heals the obvious pages and leaves a quiet one stale.
  revalidateDocumentTags(body);

  const target = purgeTargetFor(body);
  const warm = await warmOrigin(target);
  const cloudflare = await purgeCloudflare(target);

  if (!cloudflare.ok) {
    // Reported, never fatal, and deliberately still a 200: the tags above are
    // already dropped by this point, and answering non-2xx would have Sanity
    // retry a publish whose work is done. `purgeCloudflare` has already logged
    // Cloudflare's own error; this line says what it means for the site.
    console.error(
      "[cloudflare] the origin is up to date but the edge is still serving the " +
        "old page — check CLOUDFLARE_ZONE_ID / CLOUDFLARE_PURGE_TOKEN with " +
        "`npm run cache:check`, or run `npm run cache:purge`.",
    );
  }

  return NextResponse.json({ ok: true, revalidated: body, warm, cloudflare });
}
