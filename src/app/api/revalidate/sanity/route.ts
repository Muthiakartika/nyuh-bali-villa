import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { purgeCloudflare } from "@/server/cloudflare";
import { purgeTargetFor, type PublishedDocument } from "@/server/purgeTargets";

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
 * Order matters: revalidate first, purge second. `{ expire: 0 }` makes the
 * next origin request regenerate rather than serve stale, and Cloudflare's
 * first request after a purge is exactly what it then caches.
 *
 * The site also runs a 60-second ISR fallback (see `sanity/lib/client.ts`), so
 * a missed or misconfigured webhook cannot freeze published content
 * indefinitely — it just delays it. The edge TTL is the one thing with no such
 * floor, which is why a failed purge is logged loudly below rather than
 * swallowed.
 */
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

  // Next 16 requires a cache profile alongside the tag. `expire: 0` says
  // nothing carrying this tag may be served at any age — a full purge, which
  // is what a publish webhook means. A named profile such as "max" would
  // instead leave long-lived entries in place.
  const purge = (tag: string) => revalidateTag(tag, { expire: 0 });

  purge("sanity");

  if (body._type) {
    purge(`sanity:${body._type}`);

    // Path-addressed documents (page, post, legalPage) carry the route they
    // publish; slug-addressed ones (room, experience) carry a slug that is
    // only unique within a property, which is why the property joins the tag.
    if (body.path) purge(`sanity:${body._type}:${body.path}`);
    if (body.slug) {
      const key = body.property ? `${body.property}/${body.slug}` : body.slug;
      purge(`sanity:${body._type}:${key}`);
    }
  }

  const cloudflare = await purgeCloudflare(purgeTargetFor(body));

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

  return NextResponse.json({ ok: true, revalidated: body, cloudflare });
}
