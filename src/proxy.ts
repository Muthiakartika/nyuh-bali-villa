import { NextResponse, type NextRequest } from "next/server";

import { CANONICAL_HOST, SITE_ORIGIN } from "@/data/origin";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * One job: make sure the site is only ever *indexable* at one address.
 *
 * Two ways to do that, and this file can do either. **The default is
 * `X-Robots-Tag: noindex, nofollow`** on any non-canonical hostname, which
 * keeps the Vercel alias readable by a person while keeping it out of the
 * index. `ENFORCE_CANONICAL_HOST=1` swaps that for a 308 to the real domain
 * — see THE DEFAULT, AND WHICH WAY ROUND below for why it starts on the
 * first and should end on the second.
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
 * duplicate can still be crawled and occasionally indexed. Both modes below
 * remove the question: `noindex` is a directive a crawler must obey, and a
 * 308 means it only ever sees one address in the first place.
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
 * ── THE DEFAULT, AND WHICH WAY ROUND ───────────────────────────────────
 * **Unset, the alias is served with `X-Robots-Tag: noindex, nofollow`.
 * `ENFORCE_CANONICAL_HOST=1` turns it into a 308 instead.** That is the
 * opposite way round from how this started, and the reason is the window
 * this project is actually in rather than a view about which is better.
 *
 * `nyuhbalivillas.com` still resolves to WordPress. The production alias
 * is therefore the *only* address at which the finished build can be
 * looked at, and a 308 sends a reviewer straight to the site they are
 * trying to replace — so the redirect-by-default made the deployment
 * unusable for the one job it currently has. A preview deployment is not a
 * substitute, because the thing under review is the production build.
 *
 * **Both modes keep the alias out of the index; they differ in what else
 * they do.** `noindex` is a directive rather than the hint a canonical tag
 * is, so a crawler must obey it — it is the same mechanism Vercel applies
 * to previews and `next.config.ts` applies to `/studio`. What this mode
 * gives up against a 308 is the consolidation of ranking signals: a link
 * pointing at the alias stops passing anything to the canonical. Nothing
 * links to a `*.vercel.app` address, so today that costs nothing.
 *
 * **Set `ENFORCE_CANONICAL_HOST=1` at cutover**, once DNS points here. Then
 * the alias is a genuine duplicate of a live site and the 308 is worth
 * having.
 *
 * **Forgetting to is not a duplicate-content incident**, only a weaker
 * guard than intended, and that asymmetry is the whole reason the default
 * is this way round: whichever value gets left behind, the alias stays
 * unindexable. It is also why the switch does not sit on the live site's
 * path at all — real traffic arrives at the canonical host, so
 * `isOffCanonicalHost` is already false and neither branch below runs.
 * Nothing about this flag can reach a visitor on nyuhbalivillas.com.
 *
 * **Do not let robots.txt near this.** Adding `Disallow: /` for the alias
 * would be the classic own goal: a disallowed page is never fetched, so
 * the `noindex` on it is never read, and a URL that is already indexed
 * stays indexed with no way to tell Google otherwise. Crawlable plus
 * `noindex` is the combination that actually removes a page; blocked plus
 * `noindex` is the combination that cannot.
 */
function canonicalRedirectEnforced() {
  const flag = process.env.ENFORCE_CANONICAL_HOST?.trim().toLowerCase();
  return flag === "1" || flag === "true";
}

export function proxy(request: NextRequest) {
  if (!isOffCanonicalHost(request)) return NextResponse.next();

  if (canonicalRedirectEnforced()) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`${SITE_ORIGIN}${pathname}${search}`, 308);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
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
