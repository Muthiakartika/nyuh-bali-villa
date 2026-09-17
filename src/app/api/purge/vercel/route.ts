import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { SITE_ORIGIN } from "@/data/origin";
import { purgeCloudflare } from "@/server/cloudflare";

/**
 * Drop Cloudflare's copy of the site once Vercel has finished a production
 * deployment.
 *
 * Publishing in the Studio already purges on its own — the Sanity webhook
 * calls `/api/revalidate/sanity`, which purges as part of the same request. A
 * deploy publishes nothing in Sanity and still changes every page, so it needs
 * its own trigger.
 *
 * ## Why this is a route and not `.github/workflows/cloudflare-purge.yml`
 *
 * It was that workflow, and the workflow never once succeeded: 25 runs on one
 * repository and 23 on the other, every one of them red for want of two
 * secrets. The values existed the whole time — in Vercel's Environment
 * Variables, which is where the rest of this site's configuration lives and
 * the first place anyone looks. GitHub Actions runs outside Vercel and cannot
 * read them, so the design asked for the same two credentials to be kept in a
 * second place, and the half nobody was watching was the half that broke.
 *
 * Here the credentials are already present, because `purgeCloudflare` is the
 * same function the publish webhook calls. Nothing has to be duplicated, and
 * the purge cannot be configured on one side and not the other.
 *
 * ## Setup
 *
 * Vercel → Team Settings → Webhooks → Create:
 *   URL     https://nyuhbalivillas.com/api/purge/vercel
 *   Events  Deployment succeeded   (Deployment promoted too, if offered)
 *   Project nyuhbali
 *
 * Vercel shows the signing secret once. Put it on the project as
 * `VERCEL_WEBHOOK_SECRET`. Until it is set this route refuses every request:
 * an endpoint that purges on an unverified POST is one an anonymous caller can
 * use to keep the origin under load.
 */

/** Vercel signs the raw body with HMAC-SHA1 and sends it in this header. */
const SIGNATURE_HEADER = "x-vercel-signature";

/**
 * A deploy this site's visitors would notice. Anything else — a preview, a
 * failed build, a deployment created but not finished — is acknowledged and
 * ignored, so an over-broad webhook subscription costs nothing.
 *
 * `deployment.promoted` is listed because a promotion changes what production
 * serves without building anything, which is exactly a case the edge must be
 * told about. If the plan or flow never emits it, nothing here fires.
 */
const PURGING_EVENTS = new Set(["deployment.succeeded", "deployment.promoted"]);

/**
 * How long to wait for the alias to actually serve the new deployment.
 *
 * This is the one piece of real logic in the route. Cloudflare caches whatever
 * the origin answers with on the *first* request after a purge — so purging
 * while the alias still points at the previous deployment re-caches the build
 * being replaced, for the full edge TTL, and the deploy looks like it never
 * happened. Waiting costs a few seconds of a function that runs once per
 * deploy.
 */
const ALIAS_TIMEOUT_MS = 10_000;
const ALIAS_POLL_MS = 1_500;

/** Comfortably above the poll budget plus `purgeCloudflare`'s own 8s bound. */
export const maxDuration = 30;

type VercelWebhook = {
  type?: string;
  payload?: {
    target?: string | null;
    deployment?: { id?: string };
  };
};

/**
 * Constant-time comparison of the signature, and `timingSafeEqual` throws on a
 * length mismatch rather than returning false — which a malformed header
 * produces long before an attacker does.
 */
function signatureMatches(rawBody: string, secret: string, received: string | null): boolean {
  if (!received) return false;
  const expected = createHmac("sha1", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Which deployment the canonical host is serving right now.
 *
 * The query string is what makes this answer about the *origin* rather than
 * about Cloudflare's copy: a URL the edge has never seen is a miss, and the
 * junk entry it leaves behind is dropped by the purge this function exists to
 * time. Next stamps its deployment id onto `<html data-dpl-id>`; a build that
 * ever stops emitting it degrades to the timeout below, which still purges.
 */
async function servingDeploymentId(): Promise<string | null> {
  try {
    const response = await fetch(`${SITE_ORIGIN}/?__purgecheck=${Date.now()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
      headers: { "user-agent": "nyuhbali-purge-check" },
    });
    if (!response.ok) return null;
    return /data-dpl-id="([^"]+)"/.exec(await response.text())?.[1] ?? null;
  } catch {
    return null;
  }
}

async function waitForAlias(deploymentId: string): Promise<"switched" | "timeout"> {
  const deadline = Date.now() + ALIAS_TIMEOUT_MS;
  for (;;) {
    if ((await servingDeploymentId()) === deploymentId) return "switched";
    if (Date.now() + ALIAS_POLL_MS >= deadline) return "timeout";
    await sleep(ALIAS_POLL_MS);
  }
}

export async function POST(request: Request) {
  const secret = process.env.VERCEL_WEBHOOK_SECRET?.trim();

  if (!secret) {
    // Deliberately not a silent 200. Unconfigured is invisible everywhere else
    // in this project, but here it means every deploy from now on leaves the
    // edge stale, and Vercel's own webhook log is the only place that shows.
    console.error(
      "[purge] VERCEL_WEBHOOK_SECRET is not set, so this deploy did not purge " +
        "the edge. Set it on the Vercel project and redeploy.",
    );
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
  }

  const rawBody = await request.text();

  if (!signatureMatches(rawBody, secret, request.headers.get(SIGNATURE_HEADER))) {
    return NextResponse.json({ ok: false, error: "Bad signature" }, { status: 401 });
  }

  let body: VercelWebhook = {};
  try {
    body = JSON.parse(rawBody) as VercelWebhook;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed body" }, { status: 400 });
  }

  const type = body.type ?? "";
  const target = body.payload?.target ?? null;

  if (!PURGING_EVENTS.has(type) || target !== "production") {
    return NextResponse.json({ ok: true, purged: false, reason: "ignored", type, target });
  }

  const deploymentId = body.payload?.deployment?.id;
  const alias = deploymentId ? await waitForAlias(deploymentId) : "unknown";

  if (alias === "timeout") {
    // Purge anyway. A stale edge is the failure this route exists to prevent,
    // and re-caching the previous build costs one more deploy's worth of
    // staleness — where not purging costs the full TTL with nothing to say so.
    console.warn(
      `[purge] the canonical host was still not serving ${deploymentId} after ` +
        `${ALIAS_TIMEOUT_MS}ms; purging regardless.`,
    );
  }

  const cloudflare = await purgeCloudflare({ everything: true });

  if (!cloudflare.ok) {
    console.error(
      "[cloudflare] the deploy is live but the edge is still serving the old " +
        "build — check CLOUDFLARE_ZONE_ID / CLOUDFLARE_PURGE_TOKEN with " +
        "`npm run cache:check`, or run `npm run cache:purge`.",
    );
  } else if (!cloudflare.purged) {
    console.error(
      "[cloudflare] no zone id or token on this deployment, so nothing was " +
        "purged and the edge is serving the previous build.",
    );
  } else {
    console.log(`[cloudflare] purged the zone for ${deploymentId ?? type} (alias: ${alias}).`);
  }

  return NextResponse.json({ ok: true, deployment: deploymentId ?? null, alias, cloudflare });
}
