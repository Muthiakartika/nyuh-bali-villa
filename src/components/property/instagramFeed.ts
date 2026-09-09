/**
 * Behold JSON feed → the handful of fields `InstagramTeaser` actually renders.
 *
 * Instagram can't be read from a Next build directly: its public endpoints
 * require an authenticated session, and Meta's own Graph API needs the account
 * converted to Professional, linked to a Facebook Page, plus a long-lived
 * token that expires every 60 days. Behold sits in between — the account is
 * connected once on their side and the result is published as a plain public
 * JSON document. That's why the feed URL is configuration in
 * `data/properties.ts` next to the profile link, and not a secret in an env
 * file: it is the same URL Behold's own browser embeds fetch.
 *
 * We consume that JSON and render the grid ourselves rather than dropping in
 * Behold's widget script. Three reasons, each already a house rule elsewhere
 * here: the photographs end up in the server HTML (same rule as
 * `TestimonialCarousel`'s quotes — if it's page content, it ships in the
 * markup), the tiles keep this site's own hover treatment instead of a
 * vendor's, and no third-party script runs in the visitor's browser.
 */

/** One entry of Behold's `sizes` object. Behold re-encodes every photograph to
 * WebP on its own CDN, so these are the URLs to render — not Instagram's. */
type BeholdSize = {
  mediaUrl: string;
  width: number;
  height: number;
};

/** Only the fields we read. Behold sends considerably more per post
 * (`hashtags`, `mentions`, `likeCount`, `colorPalette`, carousel `children`);
 * they're left off deliberately so this type documents what the grid depends
 * on rather than mirroring their whole schema. */
type BeholdPost = {
  id: string;
  permalink: string;
  mediaType?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: Partial<Record<"small" | "medium" | "large" | "full", BeholdSize>>;
  altText?: string | null;
  prunedCaption?: string | null;
};

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
const REVALIDATE_SECONDS = 86_400;

/** Long captions are the norm on this account; an alt attribute reading like a
 * paragraph helps nobody, least of all a screen-reader user tabbing a grid. */
const MAX_ALT_LENGTH = 120;

/**
 * Returns `[]` for every failure — an unset URL, a non-200, malformed JSON, a
 * network error. `InstagramTeaser` renders its heading and Follow button with
 * no grid in that case, which is exactly what the section looked like before
 * a feed existed. Nothing here may throw: these pages are prerendered, so an
 * exception would fail the production build over a third party being briefly
 * unreachable.
 */
export async function fetchInstagramPosts(
  feedUrl: string | undefined,
  limit: number,
): Promise<InstagramPost[]> {
  if (!feedUrl) return [];

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.warn(
        `[instagram] Behold feed returned ${response.status}; rendering the teaser without its grid.`,
      );
      return [];
    }

    const feed = (await response.json()) as { posts?: BeholdPost[] };
    return (feed.posts ?? []).flatMap(toInstagramPost).slice(0, limit);
  } catch (error) {
    console.warn(
      "[instagram] Behold feed unreachable; rendering the teaser without its grid.",
      error,
    );
    return [];
  }
}

function toInstagramPost(post: BeholdPost): InstagramPost[] {
  const imageUrl = stillImageUrl(post);
  if (!imageUrl || !post.permalink) return [];

  return [
    {
      id: post.id,
      permalink: post.permalink,
      imageUrl,
      alt: altTextFor(post),
    },
  ];
}

/**
 * `sizes` first, always. It is the one field guaranteed to hold an image:
 * Behold fills it for videos and reels too, from the thumbnail or the first
 * frame. `mediaUrl` is only a safe `<img>` source on a plain `IMAGE` post — on
 * a `VIDEO` it is the video file itself, which would render as a broken tile.
 *
 * `medium` is the size the grid wants: six tiles across a 1240px container is
 * roughly 200px each, so `medium` still has headroom on a 2× screen while
 * `large`/`full` would be wasted bytes.
 */
function stillImageUrl(post: BeholdPost): string | undefined {
  const sized =
    post.sizes?.medium ??
    post.sizes?.large ??
    post.sizes?.small ??
    post.sizes?.full;

  if (sized?.mediaUrl) return sized.mediaUrl;
  if (post.thumbnailUrl) return post.thumbnailUrl;
  return post.mediaType === "IMAGE" ? post.mediaUrl : undefined;
}

function altTextFor(post: BeholdPost): string {
  // `prunedCaption` is Behold's caption with the hashtag block stripped, which
  // is the readable half; the raw `caption` is mostly tags on this account.
  const source = post.altText?.trim() || post.prunedCaption?.trim() || "";
  if (source.length <= MAX_ALT_LENGTH) return source;
  return `${source.slice(0, MAX_ALT_LENGTH).trimEnd()}…`;
}

// ── Live feed endpoints ────────────────────────────────────────────────

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
 * Server-side only — the browser calls `/api/instagram/<feed>` instead.
 * One endpoint per account: they are three different Instagram accounts, so a
 * shared endpoint would publish one account's posts under another's name.
 * Empty means no live grid and the band keeps its stills.
 */
export function instagramFeedEndpoint(feed: InstagramFeedKey): string | undefined {
  return FEED_ENV[feed]?.trim() || undefined;
}
