/**
 * The origin every absolute URL this site publishes is built from — the
 * canonical link, `og:url`, the sitemap's `<loc>` and robots.txt's `Sitemap:`.
 *
 * `SITE_URL` already exists for the Cloudflare purge (see .env.example), and
 * it means the same thing here: the public domain, not `VERCEL_URL`.
 *
 * **The fallback is the production domain on purpose.** A preview deployment
 * with nothing set therefore points its canonicals at the live site rather
 * than at itself, which is the safe direction to be wrong in — a preview that
 * nominates itself as canonical can outrank the page it is previewing. Vercel
 * sends `X-Robots-Tag: noindex` on preview deployments anyway, so this is the
 * second of two guards rather than the only one.
 *
 * ## Why this is its own file rather than a line in `seo.ts`
 *
 * `src/middleware.ts` needs it, and middleware is bundled for the edge
 * runtime and runs on every request. Importing it from `seo.ts` would pull
 * `ROUTE_SEO` — 74 routes of titles and descriptions — into that bundle for
 * the sake of one string. `seo.ts` re-exports `SITE_ORIGIN`, so every
 * existing import of it keeps working unchanged.
 */
export const SITE_ORIGIN = ((): string => {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return "https://nyuhbalivillas.com";
  try {
    return new URL(raw.startsWith("http") ? raw : `https://${raw}`).origin;
  } catch {
    return "https://nyuhbalivillas.com";
  }
})();

/** `nyuhbalivillas.com` — the one hostname this site is published at. */
export const CANONICAL_HOST = new URL(SITE_ORIGIN).host;
