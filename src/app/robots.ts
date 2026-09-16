// ======================================================
// Route Information
// WordPress slug:        /robots.txt
// Current Next.js Route: /robots.txt  (Next's own file convention)
// ======================================================

import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/data/seo";

/**
 * The live site's robots.txt, carried over rule by rule — minus the lines that
 * can no longer match anything, plus the two paths this stack adds.
 *
 * **Dropped, because the software they name is gone.** `/wp-admin/`,
 * `/wp-includes/`, `/wp-content/plugins/`, `/wp-content/themes/`,
 * `/wp-content/cache/`, `/wp-login.php`, `/wp-register.php`, `/xmlrpc.php`,
 * `/trackback/`, `/cgi-bin/`, `/feed/`, `/comments/feed/`, `/*?replytocom` and
 * `/*?attachment_id=` are WordPress's own URLs; nothing in a Next build serves
 * them. Keeping them would not be faithful, only misleading — a rule that
 * cannot match is a rule the next person has to work out the truth of. The
 * paired `Allow: /wp-content/uploads/` goes with them: it exists on the live
 * site only to carve the uploads folder back out of the two `Disallow` lines
 * above it, and with those gone it allows something nothing forbade.
 *
 * **Kept, because they still describe this site.** The three `utm` rules keep
 * campaign copies of a page out of the crawl — the same duplicate that
 * Cloudflare caches separately (see README-CLOUDFLARE.md). `/*?s=` is kept too:
 * it costs nothing and it is the one WordPress-era rule that would come back
 * the moment a search route is added.
 *
 * **Added.** `/studio` is the embedded Sanity Studio, and `/api/` is four
 * endpoints — the contact handler, the Sanity revalidation webhook, and the
 * two draft-mode toggles. Neither is a page, and neither belongs in an index.
 *
 * `Disallow: /studio` is a prefix match, so it covers `/studio` itself and
 * every tool route beneath it. It is the whole of the protection worth relying
 * on here, because nothing on the site links to the Studio, so a crawler has
 * no way to reach it in the first place. The `noindex` in the Studio route's
 * own metadata and the `X-Robots-Tag` header in next.config.ts cover the other
 * case — a URL someone pastes somewhere public, which a crawler may then fetch
 * regardless — and being a header, that one applies to the Studio's assets and
 * not only to its HTML.
 *
 * `SITE_ORIGIN` is what makes the `Sitemap:` line absolute, which the format
 * requires. On a preview deployment with no `SITE_URL` set it names the
 * production site rather than the preview's own host; that is deliberate, and
 * the same reason `metadataBase` defaults there — a preview should never
 * nominate itself as the canonical copy.
 *
 * ## Preview deployments refuse everything
 *
 * Every Vercel preview build serves all 74 pages on its own hostname. Left
 * alone that is the whole site duplicated at an address nobody intends to
 * publish, competing with the real one. Vercel does send its own
 * `X-Robots-Tag: noindex` on preview deployments, so this is the second of
 * two guards rather than the only one — but it is the cheaper of the two,
 * because a disallowed path is never fetched at all, and a header is only
 * read after it has been.
 *
 * `VERCEL_ENV` is read at build time, which is correct here: each deployment
 * is built with its own value, so a preview build bakes in the refusal and a
 * production build bakes in the rules below. **Production and local
 * development are identical to each other**, so what `localhost:3001/robots.txt`
 * prints is exactly what ships.
 *
 * Production's `*.vercel.app` alias is *not* covered by this — it reports
 * `VERCEL_ENV` as "production" and so is served the permissive file. That is
 * `src/proxy.ts`'s job: it 308s every page request on a non-canonical
 * host to the real domain.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio",
        "/api/",
        "/*?s=",
        "/*?utm_source",
        "/*?utm_medium",
        "/*?utm_campaign",
      ],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
