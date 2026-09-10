import Script from "next/script";

/**
 * The feed app's own embed, dropped in as the app publishes it:
 *
 *   <script src="https://ig-library.vercel.app/embed.js" async></script>
 *   <seoboost-feed widget="w_…"></seoboost-feed>
 *
 * This replaces `InstagramFeedGrid`, which reimplemented the app's grid and
 * viewer against the JSON its proxy returned. That was a faithful copy but a
 * copy: every appearance setting and every interaction had to be re-derived
 * here and re-checked against the app whenever it changed, and it drifted (the
 * arrows, the reels and the caption clamp were each wrong once). The client's
 * instruction is to run the app's own script instead, so the app is the single
 * definition of how this band looks and behaves.
 *
 * What that changes, all of it deliberate:
 *
 * - **The tiles no longer ship in the server HTML.** They never could — the
 *   feed hands back Instagram's signed CDN links and these routes are
 *   statically generated, so the grid was always fetched in the browser. The
 *   band's heading and its "Follow on Instagram" button are still ours and
 *   still prerendered, which is the part a crawler reads.
 * - **The markup lives in a shadow root**, so the app's stylesheet is scoped
 *   to it and cannot reach the rest of the page — and equally, this site's
 *   design tokens cannot reach in. Appearance is the workspace's settings now:
 *   layout, columns per breakpoint, radius, gap, captions and stats are all
 *   changed in the app, never here.
 * - **`/api/instagram/<feed>` is no longer on the page's path.** The proxy
 *   existed because the feed's JSON endpoint sends no `Access-Control-Allow-
 *   Origin`; the embed's own requests are allowed cross-origin, verified from
 *   this site's origin before switching.
 *
 * `next/script` rather than a raw tag so the loader is requested once per
 * page no matter how many bands are on it — three pages carry one each today,
 * but nothing stops a CMS page from carrying two.
 */

const EMBED_SRC = "https://ig-library.vercel.app/embed.js";

/**
 * A custom element, not a React component: React renders any lowercase
 * hyphenated tag as-is, and `embed.js` upgrades it once it loads. The cast is
 * only to give TypeScript the one attribute it takes — declaring it globally
 * in the JSX namespace would put a vendor tag on every file's autocomplete.
 */
const SeoboostFeed = "seoboost-feed" as unknown as React.FC<{ widget: string }>;

export function InstagramEmbed({
  widget,
  fallback,
}: {
  /** The workspace id from the app's embed snippet. */
  widget?: string;
  /** Shown when no workspace is configured — the band keeps whatever stills
   *  the page passes, exactly as it did before any feed existed. */
  fallback?: React.ReactNode;
}) {
  if (!widget) return <>{fallback}</>;

  return (
    // The same top margin the grid used, so the gap under the heading matches
    // every other band's `mt-8 md:mt-10` rather than becoming the vendor's.
    <div className="mt-8 md:mt-10">
      <Script src={EMBED_SRC} strategy="afterInteractive" />
      <SeoboostFeed widget={widget} />
    </div>
  );
}
