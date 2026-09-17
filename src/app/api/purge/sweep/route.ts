import { NextResponse } from "next/server";
import { purgeCloudflare } from "@/server/cloudflare";
import { combineTargets, revalidateDocumentTags } from "@/server/publishInvalidation";
import type { PublishedDocument } from "@/server/purgeTargets";
import { warmOrigin } from "@/server/warmOrigin";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";

/**
 * The scheduled catch-up: whatever the publish webhook did not deliver.
 *
 * ## Why this exists
 *
 * The webhook is the fast path and it is correct — called by hand it
 * revalidates, warms and purges in one request. It had also stopped arriving,
 * for an unknown length of time, **with no sign anywhere**: an editor
 * published, Sanity held the change, the origin never rebuilt because
 * Cloudflare answered every request from its own copy, and the site went on
 * serving the previous page for up to the full edge day. The only symptom was
 * a client saying a menu had not changed.
 *
 * That is the third time in this project a link in a chain has failed
 * silently — the Actions purge that was red 48 times, `siteSettings` read by
 * nothing, and now this — so the answer is not a better webhook. It is a
 * second path that does not depend on the first, and that finds its own work
 * rather than waiting to be told.
 *
 * ## What it does
 *
 * Every five minutes it asks Content Lake one question: has any published
 * document changed in the last few minutes? Nothing changed is the normal
 * answer and costs one GROQ query and no purge at all — the edge is never
 * disturbed for the sake of checking. When something did change it does
 * exactly what the webhook would have done for those documents, through the
 * same three functions, so the two paths cannot drift.
 *
 * It is a net, not a replacement. A publish that the webhook delivers is live
 * in a second; one it misses is live within the sweep's window instead of
 * within a day.
 */

/**
 * Wider than the five-minute schedule on purpose: a skipped or slow run must
 * not open a gap, and re-sweeping a change already handled costs one extra
 * purge of 77 static pages. Widening this is cheap; narrowing it is how a
 * change falls between two runs and is never seen again.
 */
const WINDOW_MS = 8 * 60 * 1000;

/** Content types a change to which affects a published URL. */
const TYPES = [
  "page",
  "post",
  "room",
  "experience",
  "packageSet",
  "testimonial",
  "legalPage",
  "property",
  "siteSettings",
  "category",
];

/**
 * Drafts are excluded deliberately. A draft changes on every keystroke in the
 * Studio and publishes nothing; sweeping on one would purge the zone while an
 * editor is still typing.
 */
const CHANGED_QUERY = `*[
  !(_id in path("drafts.**")) &&
  _type in $types &&
  _updatedAt > $since
]{ _type, path, property, "slug": slug.current, _updatedAt }[0...50]`;

/** Two warm rounds plus `purgeCloudflare`'s 8s bound, with room to spare. */
export const maxDuration = 30;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorized = secret
    ? request.headers.get("authorization") === `Bearer ${secret}`
    : // Vercel sets this header on its own cron invocations. Accepting it when
      // no secret is configured is deliberate: the alternative is a sweep that
      // answers 401 to the scheduler and heals nothing, which is the silent
      // failure this whole route exists to end. The worst a spoofed call can
      // do is make the site purge and rebuild pages it already serves.
      request.headers.get("x-vercel-cron") !== null;

  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!secret) {
    console.warn(
      "[sweep] running without CRON_SECRET — set it on the Vercel project so " +
        "only the scheduler can trigger this.",
    );
  }

  if (!isSanityConfigured) {
    return NextResponse.json({ ok: true, swept: false, reason: "sanity-not-configured" });
  }

  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  let documents: PublishedDocument[] = [];
  try {
    documents = await client
      // Never the CDN here: this asks whether something changed seconds ago,
      // which is the one question a cached answer cannot answer.
      .withConfig({ useCdn: false, token: process.env.SANITY_API_READ_TOKEN?.trim() || undefined })
      .fetch<PublishedDocument[]>(CHANGED_QUERY, { types: TYPES, since }, { cache: "no-store" });
  } catch (error) {
    // Loud, and a 500 so a failing sweep shows in Vercel's cron log rather
    // than reporting success while healing nothing.
    console.error("[sweep] could not ask Sanity what changed:", error);
    return NextResponse.json({ ok: false, error: "query-failed" }, { status: 500 });
  }

  if (documents.length === 0) {
    return NextResponse.json({ ok: true, swept: false, reason: "nothing-changed", since });
  }

  for (const document of documents) revalidateDocumentTags(document);

  const target = combineTargets(documents);
  const warm = await warmOrigin(target);
  const cloudflare = await purgeCloudflare(target);

  // One line per sweep that found work, naming the paths, because this is the
  // path nobody watches by construction — it runs when the webhook did not.
  console.log(
    `[sweep] ${documents.length} document(s) changed since ${since}: ` +
      documents.map((d) => d.path || d.slug || d._type).join(", ") +
      ` — purged: ${cloudflare.ok && cloudflare.purged ? "yes" : JSON.stringify(cloudflare)}`,
  );

  return NextResponse.json({ ok: true, swept: true, documents: documents.length, warm, cloudflare });
}
