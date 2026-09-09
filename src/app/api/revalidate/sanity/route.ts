import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type WebhookBody = {
  _type?: string;
  slug?: string;
  path?: string;
  property?: string;
};

/**
 * Immediate, deterministic cache invalidation for published changes.
 *
 * The site also runs a 60-second ISR fallback (see fetchOptions in
 * sanity/lib/client.ts), so a missed or misconfigured webhook cannot freeze
 * published content indefinitely — it just delays it.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: WebhookBody = {};
  try {
    body = (await request.json()) as WebhookBody;
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

  return NextResponse.json({ ok: true, revalidated: body });
}
