import { NextResponse, type NextRequest } from "next/server";

import { CANONICAL_HOST, SITE_ORIGIN } from "@/data/origin";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * One job: send every request on a non-canonical hostname to the real
 * domain, so the site is only ever crawlable at one address.
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ── THE HOLE THIS CLOSES ───────────────────────────────────────────────
 * A Vercel **production** deployment answers on its own `*.vercel.app`
 * alias as well as on `nyuhbalivillas.com`, and that alias serves all 74
 * pages. Two things that look like they cover this do not:
 *
 *  - **Vercel's automatic `X-Robots-Tag: noindex`** is sent on *preview*
 *    deployments only. A production alias reports `VERCEL_ENV` as
 *    "production" and is served without it.
 *  - **Cloudflare's cache rules** cannot help at all. They belong to the
 *    zone for `nyuhbalivillas.com`; `*.vercel.app` is not in that zone and
 *    never passes through the proxy. Everything protecting the alias has
 *    to live in this build.
 *
 * The canonical tags in `layout.tsx` are correct and absolute, which is
 * most of the defence — but a canonical is a hint, not a directive, so the
 * duplicate can still be crawled and occasionally indexed. A 308 removes
 * the question: a crawler that follows it only ever sees one address, and
 * the ranking signals land there.
 *
 * `robots.ts` is the other half, and it covers the case this cannot: a
 * preview deployment, where a redirect to production would make the
 * preview impossible to look at.
 *
 * ── WHAT IT LEAVES ALONE, AND WHY EACH ─────────────────────────────────
 * **Anything that is not a Vercel production deployment.** Local
 * development runs on localhost and previews are the entire point of
 * previews; redirecting either to the live site would make both unusable.
 * `VERCEL_ENV` is the only thing that separates the three.
 *
 * **`/api/`.** These are endpoints, not pages, so nothing about them is an
 * indexing problem — `robots.txt` disallows them already. What they are is
 * integration surface, and one of them is pointed at the alias *on
 * purpose*: README-CLOUDFLARE.md §7 recommends aiming the Sanity publish
 * webhook at the `*.vercel.app` origin when Cloudflare's bot protection
 * starts eating it. A 308 only survives a client that follows redirects
 * and preserves the method; a webhook that quietly stops firing is a far
 * worse failure than a duplicate URL.
 *
 * **Anything arriving through Cloudflare.** This is the guard that makes
 * the rule safe rather than merely correct. The real domain is proxied by
 * Cloudflare, and if that proxy were ever pointed at the alias by name — a
 * Host Header Override, or an origin set to the `*.vercel.app` hostname —
 * then "host is not canonical" would be true for EVERY request on the live
 * site. Each would redirect to the canonical domain, which resolves back
 * through the same proxy, which redirects again. That is not a
 * duplicate-content problem, it is the site down in a loop.
 *
 * `cf-ray` is present on every request Cloudflare proxies and on nothing
 * else, so it separates the two populations exactly: real traffic reaches
 * the site through Cloudflare and is never touched here, while a crawler
 * hitting the Vercel alias directly does not go through Cloudflare at all
 * and is redirected. The alias is reachable only from outside the proxy,
 * which is precisely the traffic this is for.
 */
function canonicalHostRedirect(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") return null;

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) return null;

  // Came through Cloudflare, so it is on the real domain whatever the Host
  // header says by the time it gets here. Never redirect it.
  if (request.headers.get("cf-ray")) return null;

  // `x-forwarded-host` is the one that survives Vercel's own proxy; `host`
  // is the fallback for anywhere it is absent.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host || host === CANONICAL_HOST) return null;

  return NextResponse.redirect(`${SITE_ORIGIN}${pathname}${search}`, 308);
}

export function middleware(request: NextRequest) {
  return canonicalHostRedirect(request) ?? NextResponse.next();
}

export const config = {
  /**
   * Every page request, and nothing else: Next's own asset routes and any
   * path carrying a file extension are excluded.
   *
   * Static assets are excluded rather than redirected because they are
   * fetched by a page that has already redirected — the browser is on the
   * canonical host by the time it asks for them. The extension exclusion
   * also covers `/robots.txt` and `/sitemap.xml`, which is deliberate:
   * those two are the only files a crawler is *supposed* to read on any
   * host it finds, and the pages they point at redirect anyway.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.[^/]+$).*)"],
};
