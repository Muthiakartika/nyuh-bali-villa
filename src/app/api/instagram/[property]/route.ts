import { NextResponse } from "next/server";
import {
  instagramFeedEndpoint,
  type InstagramFeedKey,
} from "@/components/property/instagramFeed";
import { getInstagramApiUrl } from "@/sanity/lib/content";

/**
 * Same-origin proxy for one account's Instagram feed. The feed service sends
 * no CORS headers, so the browser cannot call it directly; going through here
 * also keeps the endpoint URL server-side.
 *
 * The endpoint itself comes from the property document in Sanity, falling
 * back to the environment. That order matters: a tunnelled feed URL changes
 * every time the tunnel restarts, and an env var would mean a restart or a
 * redeploy each time. Published in the Studio, a new URL is live within a
 * minute with neither.
 *
 * 60s, not longer: short enough that a changed URL takes effect quickly, and
 * still far below the images' own signed expiry, so a cached response never
 * hands back a dead link.
 */
export const revalidate = 60;

/** Three accounts, not two — `spa` is @mahamayaspa.ubud on /ubud/spa. The
 * route segment is still called `property` because renaming a folder renames
 * the published URL; the values it accepts are feed keys. */
const FEEDS = new Set<string>(["seminyak", "ubud", "spa"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ property: string }> },
) {
  const { property } = await params;

  if (!FEEDS.has(property)) {
    return NextResponse.json({ error: "Unknown feed" }, { status: 404 });
  }

  const feed = property as InstagramFeedKey;
  const endpoint = (await getInstagramApiUrl(feed)) ?? instagramFeedEndpoint(feed);
  if (!endpoint) {
    // Not configured is not an error: the band falls back to its stills.
    return NextResponse.json({ posts: [] });
  }

  try {
    const response = await fetch(endpoint, {
      // ngrok's free tier serves an interstitial HTML page to browser-like
      // requests; this header is what opts out of it.
      headers: { "ngrok-skip-browser-warning": "1" },
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as { posts?: unknown[]; config?: unknown };
    // `config` travels with the posts: it is the feed app's own appearance
    // block (columns per breakpoint, gap, corner radius, aspect ratio, whether
    // captions and stats show), and the grid renders from it so the band looks
    // like the workspace's preview rather than like a second design of ours.
    return NextResponse.json({
      posts: Array.isArray(data?.posts) ? data.posts : [],
      config: data?.config ?? null,
    });
  } catch (error) {
    console.error(`Instagram feed failed for ${property}:`, (error as Error).message);
    // An empty list rather than a 500: the page keeps its stills, and a feed
    // outage never surfaces as a broken section.
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
