import { revalidateTag } from "next/cache";
import { purgeTargetFor, type PublishedDocument, type PurgeTarget } from "./purgeTargets";

/**
 * What a published change invalidates, shared by the two things that can
 * notice one: the Sanity webhook (`/api/revalidate/sanity`) and the scheduled
 * sweep that exists for when the webhook does not arrive
 * (`/api/purge/sweep`).
 *
 * It is one module because the two must not drift. A sweep that invalidated
 * *nearly* what a publish does would be worse than no sweep at all: it would
 * heal the obvious pages, leave a quieter one stale, and take the symptom
 * away that tells anyone to look.
 */

/**
 * Next 16 requires a cache profile alongside the tag. `expire: 0` says nothing
 * carrying this tag may be served at any age — a full purge, which is what a
 * publish means. A named profile such as "max" would instead leave long-lived
 * entries in place.
 */
const drop = (tag: string) => revalidateTag(tag, { expire: 0 });

export function revalidateDocumentTags(document: PublishedDocument): void {
  drop("sanity");

  if (!document._type) return;
  drop(`sanity:${document._type}`);

  // Path-addressed documents (page, post, legalPage) carry the route they
  // publish; slug-addressed ones (room, experience) carry a slug that is only
  // unique within a property, which is why the property joins the tag.
  if (document.path) drop(`sanity:${document._type}:${document.path}`);
  if (document.slug) {
    const key = document.property ? `${document.property}/${document.slug}` : document.slug;
    drop(`sanity:${document._type}:${key}`);
  }
}

/**
 * One target covering several documents, for the sweep — a publish is one
 * document, a sweep is however many changed since it last ran.
 *
 * Any single document that cannot be mapped to a URL list takes the whole
 * result to `everything`, which is the same direction `purgeTargetFor`
 * already errs in: over-purging costs a cache miss on 77 static pages,
 * under-purging costs a wrong page served for as long as the edge TTL runs.
 */
export function combineTargets(documents: PublishedDocument[]): PurgeTarget {
  const paths = new Set<string>();

  for (const document of documents) {
    const target = purgeTargetFor(document);
    if (target.everything) return { everything: true };
    for (const path of target.paths) paths.add(path);
  }

  return paths.size > 0 ? { everything: false, paths: [...paths] } : { everything: true };
}
