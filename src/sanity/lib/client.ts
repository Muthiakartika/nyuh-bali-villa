import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { defineLive } from "next-sanity/live";
import {
  isSanityConfigured,
  resolvedSanityProjectId,
  sanityApiVersion,
  sanityDataset,
} from "@/sanity/env";

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

function fetchPublished<TResult>(
  query: string,
  options: SanityFetchOptions,
): Promise<TResult> {
  return publishedClient.fetch<TResult>(query, options.params ?? {}, {
    next: {
      tags: options.tags ?? ["sanity"],
      revalidate: options.revalidate ?? 60,
    },
  });
}

/**
 * Null is intentional: every caller keeps its existing `src/data` content
 * until Sanity is configured and the matching document has been published.
 */
export async function sanityFetch<TResult>(
  query: string,
  options: SanityFetchOptions = {},
): Promise<TResult | null> {
  if (!isSanityConfigured) return null;

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
    return result.data as TResult;
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
