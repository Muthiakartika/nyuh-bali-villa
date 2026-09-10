/**
 * What the Instagram band needs, and nothing more.
 *
 * The band itself is the feed app's own embed — `<seoboost-feed widget="w_…">`
 * loaded from `ig-library.vercel.app` (see `InstagramEmbed`). The app fetches
 * its own data, in the visitor's browser, straight from its own endpoint:
 * nothing in this repo reads, proxies, caches or reshapes it, which is
 * deliberate. A change made in the app has to reach the site without anything
 * here standing in the way.
 *
 * What used to live in this file — a server-side fetch of a Behold JSON feed,
 * its post/carousel types and the mapper that flattened them — is gone with
 * the hand-built grid it fed. All that is left is the workspace id the embed
 * takes, and the small `InstagramPost` shape a page uses for the hand-picked
 * stills it falls back to when no workspace is configured. Those stills are
 * local photographs, not a feed.
 */

export type InstagramPost = {
  id: string;
  /** The post's own Instagram URL, so a tile links to the post it shows
   * rather than every tile pointing at the same profile.
   *
   * Optional because of the hand-picked stills standing in for the feed until
   * Behold is connected: those are photographs from the property, not posts we
   * can identify. Inventing permalinks for them would ship six links that 404,
   * so they carry none and `InstagramTeaser` sends them to the profile
   * instead. A post arriving from Behold without one is malformed and is
   * dropped by `toInstagramPost`. */
  permalink?: string;
  imageUrl: string;
  alt: string;
};

/**
 * Once a day, matching Behold's free tier — which refreshes the feed daily, so
 * fetching more often would only re-read the same payload.
 *
 * It also keeps the plan's quota irrelevant. Behold meters *requests to the
 * feed*, and the free tier allows 1,200 a month; because this runs on the
 * server behind Next's cache rather than in each visitor's browser, the page
 * costs ~30 requests a month however many people open it. A client-side embed
 * would have spent one per pageview and gone dark partway through the month.
 */
/**
 * The three accounts the site shows a grid for. Not two: Mahamaya Spa
 * (`/ubud/spa`) posts as @mahamayaspa.ubud, separately from either resort.
 * `spa` is not a property — it is an Ubud page — but it is a feed, which is
 * what this key names.
 */
export type InstagramFeedKey = "seminyak" | "ubud" | "spa";

const FEED_ENV: Record<InstagramFeedKey, string | undefined> = {
  // Read as a static property access, never `process.env[key]`: Next inlines
  // these at build time by matching the literal expression, and a computed
  // lookup would leave all three undefined in a production bundle.
  seminyak: process.env.INSTAGRAM_FEED_SEMINYAK,
  ubud: process.env.INSTAGRAM_FEED_UBUD,
  spa: process.env.INSTAGRAM_FEED_SPA,
};

/**
 * The workspace id the feed app's own embed takes: `<seoboost-feed
 * widget="w_…">`.
 *
 * Deliberately read out of the value that is already configured rather than
 * added as a second field to keep in step. A workspace is identified the same
 * way in both forms — the JSON endpoint is `…/api/v1/w/<widget id>/feed` — so
 * one setting can serve both, and a workspace swapped in the Studio swaps the
 * embed with it. A bare id is accepted too, so pasting the value straight out
 * of the app's embed snippet works.
 *
 * Returns undefined rather than guessing when the value is neither: an empty
 * `widget` attribute renders the app's own "not found" state, which is worse
 * than the band falling back to its stills.
 */
export function instagramWidgetId(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^w_[A-Za-z0-9]+$/.test(trimmed)) return trimmed;
  return /\/w\/(w_[A-Za-z0-9]+)(?:\/|$)/.exec(trimmed)?.[1];
}

/** The env fallback's widget id, for when nothing is published in the Studio. */
export function instagramFeedWidget(feed: InstagramFeedKey): string | undefined {
  return instagramWidgetId(FEED_ENV[feed]);
}
