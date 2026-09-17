import "server-only";
import { draftMode } from "next/headers";
import { createClient, type QueryParams } from "next-sanity";
import { defineLive } from "next-sanity/live";
import {
  isSanityConfigured,
  resolvedSanityProjectId,
  sanityApiVersion,
  sanityDataset,
} from "@/sanity/env";
import { localizeUploads } from "@/sanity/lib/uploads";

export const client = createClient({
  projectId: resolvedSanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

// Keep the read token server-only and normalize accidental whitespace copied
// from Sanity Manage. The public client above must stay token-free because it
// is also used by Live Content internals.
const sanityReadToken = process.env.SANITY_API_READ_TOKEN?.trim() || false;
const publishedClient = sanityReadToken
  ? client.withConfig({ token: sanityReadToken, useCdn: false })
  : client;

// next-sanity 13 moved two things that used to live here. `stega` is now a
// per-call option on sanityFetch, and outside strict mode it resolves itself
// from draftMode() — which is the behaviour the old `stega: true` was after,
// so it is simply omitted rather than re-specified. `fetchOptions` is gone
// too: Live Content now derives its cache tags from Content Lake's own
// `syncTags`, so the published path below carries the timed fallback that
// keeps a missed webhook from freezing content indefinitely.
const live = defineLive({
  client,
  serverToken: sanityReadToken,
  browserToken: false,
});

export const SanityLive = live.SanityLive;

export type SanityFetchOptions = {
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
};

async function fetchPublished<TResult>(
  query: string,
  options: SanityFetchOptions,
): Promise<TResult> {
  const result = await publishedClient.fetch<TResult>(
    query,
    options.params ?? {},
    {
      next: {
        tags: options.tags ?? ["sanity"],
        revalidate: options.revalidate ?? 60,
      },
    },
  );
  return localizeUploads(result);
}

/**
 * Null is intentional: every caller keeps its existing `src/data` content
 * until Sanity is configured and the matching document has been published.
 */
/**
 * Whether this request is previewing drafts. Outside a request — during
 * `generateStaticParams`, or at build time — `draftMode()` throws, and the
 * answer there is no.
 */
async function isPreviewing(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

export async function sanityFetch<TResult>(
  query: string,
  options: SanityFetchOptions = {},
): Promise<TResult | null> {
  if (!isSanityConfigured) return null;

  /**
   * **Published rendering does not go through Live Content, and that is the
   * fix for "the client published and the site did not change".**
   *
   * Live's `sanityFetch` tags its entries correctly — the build's own
   * `x-next-cache-tags` for a page lists `sanity`, `sanity:page` and
   * `sanity:page:/its-path`, exactly what the publish webhook drops — but it
   * sets no `revalidate`, so every route prerendered with it carries
   * `initialRevalidateSeconds: false`. Measured against production: Sanity
   * held the new value on both `api` and `apicdn`, the webhook fired and
   * purged (the edge's `age` reset), the endpoint called by hand answered 200
   * with a successful warm and purge — and the origin went on rendering the
   * previous copy for as long as it was watched. A deploy was the only thing
   * that ever changed it, which is the "one-build lag" this project has
   * written down twice without recognising it as this.
   *
   * `fetchPublished` sets both: the same tags *and* `revalidate`, so a page is
   * ISR rather than frozen. On-demand invalidation stays the fast path and the
   * timer is the floor under it — which is what the note in this file has
   * claimed all along, while nothing actually set it for a healthy render.
   *
   * Live stays for what it is for: previewing drafts in the Studio.
   */
  if (!(await isPreviewing())) {
    try {
      return await fetchPublished<TResult>(query, options);
    } catch (error) {
      console.error("Sanity published fetch failed.", error);
      return null;
    }
  }

  try {
    const result = await live.sanityFetch({
      query,
      params: options.params ?? {},
      tags: options.tags ?? ["sanity"],
    });
    // At build time, or in the seconds right after a dev server restart
    // before Live Content's subscription has finished its first sync, it
    // can resolve successfully with no data yet rather than throwing — for
    // an array query that comes back as `[]`, not `null`. Confirm through
    // the published API (a plain, un-subscribed fetch with no warm-up
    // window) before the caller concludes the data doesn't exist. Safe for
    // a genuinely-empty result too: fetchPublished would return the same
    // empty array, just via a reliable path instead of a racy one.
    const isEmpty =
      result.data === null ||
      result.data === undefined ||
      (Array.isArray(result.data) && result.data.length === 0);
    if (isEmpty) {
      return await fetchPublished<TResult>(query, options);
    }
    // Every document this app reads passes through here or through
    // fetchPublished above, which is what makes one rewrite enough — see the
    // note in ./uploads.ts.
    return localizeUploads(result.data as TResult);
  } catch (error) {
    // Live Content can be unavailable outside request scope (for example in
    // generateStaticParams), or fail independently from Sanity's published
    // Content Lake. In both cases, retry against the authenticated published
    // client so a healthy CMS document does not become a false 500.
    try {
      return await fetchPublished<TResult>(query, options);
    } catch (publishedError) {
      console.error("Sanity Live and published fetch both failed.", {
        liveError: error,
        publishedError,
      });
      return null;
    }
  }
}
