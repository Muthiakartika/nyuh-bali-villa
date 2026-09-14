/**
 * Which published URLs a Sanity document affects.
 *
 * Pure on purpose — no env, no network, no `server-only` — for the same reason
 * `inquiryEmail.ts` is: the thing it must not get wrong (purging too few URLs
 * and leaving a visitor on yesterday's page) is invisible in a browser. It can
 * be exercised on its own with `node --experimental-strip-types`.
 *
 * The webhook gives four fields — `_type`, `path`, `slug`, `property` — which
 * is the same projection the cache tags are built from in
 * `src/app/api/revalidate/sanity/route.ts`. Everything below is derived from
 * those, and anything that cannot be resolved falls back to a full purge
 * rather than to a guess: over-purging costs a cache miss on 74 static pages,
 * under-purging costs a wrong page served for as long as the edge TTL runs.
 */

export type PurgeTarget =
  | { everything: true }
  | { everything: false; paths: string[] };

export type PublishedDocument = {
  _type?: string;
  path?: string;
  slug?: string;
  property?: string;
};

/**
 * Document types whose content is not confined to one route.
 *
 * `property` carries the header, footer, nav and contact details of all 74
 * pages; `siteSettings` the site-wide defaults; a `testimonial` renders in any
 * page that carries a testimonial section, which a CMS editor can add
 * anywhere. None of the three can be mapped to a URL list, so they purge the
 * zone.
 */
const SITE_WIDE = new Set(["property", "siteSettings", "testimonial"]);

/** Both blog indexes list every post, whatever prefix the post publishes at. */
const BLOG_INDEXES = ["/seminyak/discover", "/ubud/discover"];

/**
 * The sitemap is built from the `page` and `post` documents, so publishing
 * either can change which URLs it lists.
 *
 * Only `CLOUDFLARE_PURGE_MODE=urls` ever reads this — the default purge takes
 * the whole zone and covers it anyway — and Next's own copy is already dropped
 * by the `sanity` tag the webhook always revalidates. This is the third cache,
 * and the one that would otherwise hold a sitemap missing a brand-new page for
 * as long as the edge TTL runs.
 */
const SITEMAP = "/sitemap.xml";

/** A package set renders on all three package routes at once. */
const PACKAGE_ROUTES = [
  "/ubud/packages",
  "/ubud/villa/honeymoon/packages",
  "/seminyak/villa/honeymoon/packages",
];

/** Same normalisation `src/sanity/lib/content.ts` applies to a stored path. */
function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

/**
 * `/ubud/retreat/luxury/anti-aging` → `/ubud/retreat/luxury`, `/ubud/retreat`.
 *
 * This is what covers the listing page without needing a per-family map: a
 * detail page's listing is always one of its own ancestors. `stopAt` keeps the
 * walk from climbing past the property root — `/` and `/ubud` do not change
 * when one retreat programme is edited.
 */
function ancestorsOf(path: string, stopAt: string): string[] {
  const ancestors: string[] = [];
  let current = path;
  while (current.lastIndexOf("/") > 0) {
    current = current.slice(0, current.lastIndexOf("/"));
    if (current.length < stopAt.length) break;
    ancestors.push(current);
  }
  return ancestors;
}

function paths(...values: (string | null | undefined)[]): PurgeTarget {
  const unique = [...new Set(values.filter((value): value is string => Boolean(value)))];
  return unique.length > 0 ? { everything: false, paths: unique } : { everything: true };
}

export function purgeTargetFor(document: PublishedDocument): PurgeTarget {
  const type = document._type;
  if (!type || SITE_WIDE.has(type)) return { everything: true };

  const path = document.path ? normalizePath(document.path) : null;
  const slug = document.slug?.replace(/^\/+|\/+$/g, "") || null;

  switch (type) {
    // Path-addressed: the document carries the route it publishes.
    // `page` also joins the sitemap, which lists every published page path.
    case "page":
      return paths(path, SITEMAP);

    // A legal page is one of the 74 routes already; its path cannot change the
    // sitemap's membership, so the sitemap is not purged with it.
    case "legalPage":
      return paths(path);

    // A post also changes both index pages, which list every post, and the
    // sitemap, which lists every post path.
    case "post":
      return paths(path, ...BLOG_INDEXES, SITEMAP);

    // Slug-addressed, and the slug is only unique within a property.
    case "room": {
      if (!document.property || !slug) return { everything: true };
      const room = `/${document.property}/villa/${slug}`;
      return paths(room, `/${document.property}/villa`);
    }

    // Experience slugs already carry their own prefix ("wellness/yoga",
    // "retreat/luxury/new-beginning") and all publish under /ubud.
    case "experience": {
      if (!slug) return { everything: true };
      const experience = `/ubud/${slug}`;
      return paths(
        experience,
        ...ancestorsOf(experience, "/ubud"),
        // The wellness classes are listed twice: on /ubud/wellness, which the
        // ancestor walk already found, and on /ubud/fitness, which is not an
        // ancestor of anything.
        slug.startsWith("wellness/") ? "/ubud/fitness" : null,
      );
    }

    case "packageSet":
      return paths(...PACKAGE_ROUTES);

    // A document type added to the schema after this file was written.
    default:
      return { everything: true };
  }
}
