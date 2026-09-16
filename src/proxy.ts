import { NextResponse, type NextRequest } from "next/server";

import { CANONICAL_HOST, SITE_ORIGIN } from "@/data/origin";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * One job: make sure the site is only ever *indexable* at one address.
 *
 * By default that means a 308 from any non-canonical hostname to the real
 * domain. `ALLOW_ALIAS_REVIEW=1` swaps the redirect for an
 * `X-Robots-Tag: noindex, nofollow` on those same requests, so the Vercel
 * alias can be read by a person without becoming a second copy of the site
 * — see THE REVIEW ESCAPE HATCH below.
 *
 * This was `src/middleware.ts` exporting `middleware`. Next 16 deprecated
 * that convention in favour of `proxy.ts` exporting `proxy` and warns on
 * every build; the mechanism is identical and the rename is the whole of
 * the change.
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
function isOffCanonicalHost(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") return false;
  if (request.nextUrl.pathname.startsWith("/api/")) return false;

  // Came through Cloudflare, so it is on the real domain whatever the Host
  // header says by the time it gets here. Never touch it.
  if (request.headers.get("cf-ray")) return false;

  // `x-forwarded-host` is the one that survives Vercel's own proxy; `host`
  // is the fallback for anywhere it is absent.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return Boolean(host) && host !== CANONICAL_HOST;
}

/**
 * ── THE REVIEW ESCAPE HATCH ────────────────────────────────────────────
 * `ALLOW_ALIAS_REVIEW=1` keeps the `*.vercel.app` alias **readable** while
 * still keeping it out of the index.
 *
 * It exists for the window this project is actually in: the build is
 * finished but `nyuhbalivillas.com` still resolves to WordPress, so the
 * production alias is the only address at which the finished site can be
 * looked at — and the 308 above sends a reviewer straight to the WordPress
 * site they are trying to replace. A preview deployment is not a
 * substitute, because the thing under review is the production build.
 *
 * **It answers `X-Robots-Tag: noindex, nofollow` rather than switching the
 * protection off.** That matters more than the convenience: `noindex` is a
 * directive, not the hint a canonical tag is, so the alias is no more
 * indexable in this mode than it is behind the redirect. It is the same
 * mechanism Vercel applies to previews and `next.config.ts` applies to
 * `/studio`. What it loses against a 308 is the consolidation of ranking
 * signals — links pointing at the alias stop passing to the canonical —
 * and essentially nothing links to a `*.vercel.app` address.
 *
 * **So forgetting to unset it at cutover is not a duplicate-content
 * incident**, only a slightly weaker guard than intended. That is the
 * whole reason it is written this way rather than as an early `return`:
 * an escape hatch nobody remembers to close should fail in the safe
 * direction. Unset it once the domain points here and the 308 comes back.
 *
 * **Do not let robots.txt near this.** Adding `Disallow: /` for the alias
 * would be the classic own goal: a disallowed page is never fetched, so
 * the `noindex` on it is never read, and a URL that is already indexed
 * stays indexed with no way to tell Google otherwise. Crawlable plus
 * `noindex` is the combination that actually removes a page; blocked plus
 * `noindex` is the combination that cannot.
 */
function aliasReviewAllowed() {
  const flag = process.env.ALLOW_ALIAS_REVIEW?.trim().toLowerCase();
  return flag === "1" || flag === "true";
}

export function proxy(request: NextRequest) {
  if (!isOffCanonicalHost(request)) return NextResponse.next();

  if (aliasReviewAllowed()) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(`${SITE_ORIGIN}${pathname}${search}`, 308);
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
   *
   * ── THE DOUBLE BACKSLASH IS LOAD-BEARING ─────────────────────────────
   * `\\.` here, not `\.`. This is a **string**, and `"\."` is not a valid
   * JavaScript escape, so it silently collapses to `"."` — which in the
   * regex Next compiles is *any character*, not a literal dot. The
   * exclusion then reads "anything, any character, then one or more
   * non-slash characters at the end", which every path of two characters
   * or more satisfies. The result is a matcher that excludes the whole
   * site: this ran on nothing at all, on every page, and said nothing
   * about it — a build with a broken matcher looks exactly like a build
   * with a working one.
   *
   * There is no type error and no warning to catch this, so the check is
   * behavioural. The quickest one: temporarily return a redirect for a
   * sentinel path at the top of `proxy`, build, request it, and see a 307
   * rather than a 404. Header-based probes are not reliable here —
   * headers set on `NextResponse.next()` do not survive a prerendered
   * cache hit, so their absence proves nothing.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
};
