/**
 * Rewrites WordPress upload URLs held in Sanity onto the copies this site now
 * serves itself.
 *
 * **Why this exists.** Every photograph and every menu PDF used to be
 * hotlinked from `nyuhbalivillas.com/wp-content/uploads/`. They are now
 * downloaded into `public/uploads/`, keeping WordPress's own `/YYYY/MM/name`
 * layout so a reference only had to change its prefix. That fixed the code —
 * but not the CMS: the migration seeded every `page`, `post`, `room` and
 * `experience` document with the absolute URLs that were current when it ran,
 * and a published document is what actually renders. Left alone, the day
 * WordPress is switched off the fallback content would be fine and every
 * CMS-rendered page would lose its photographs.
 *
 * **Why one deep rewrite rather than a fix at each call site.** These URLs sit
 * in a dozen unrelated shapes — an image's `externalUrl`, a post body's image
 * block, a CTA's `href`, a portable-text link mark, a menu button in a section
 * an editor added last week. Patching the four or five resolvers known today
 * would work until the sixth shape appears, and the failure is silent: a
 * missing photograph on one page nobody happens to open. Rewriting the fetched
 * document once catches every field by construction, and costs a walk over a
 * payload that is already cached.
 *
 * It is deliberately *not* a migration of the documents themselves. Editors
 * keep whatever is stored, the Studio keeps showing them the URL it was seeded
 * with, and nothing has to be written back to Content Lake to make the site
 * correct — which also means this is safe to deploy before, during or after
 * any such migration, and harmless once every document has been updated.
 *
 * Three hosts, because all three appear in the source: the canonical one, the
 * `www.` form, and `preview.nyuhbalivillas.com`, which the live site's own
 * markup still emits for a few assets (its WhatsApp icon, among others).
 */
const LEGACY_UPLOADS =
  /https?:\/\/(?:www\.|preview\.)?nyuhbalivillas\.com\/wp-content\/uploads\//g;

/** Where those files live now. Matches the `UPLOADS` constant every data file declares. */
export const LOCAL_UPLOADS = "/uploads/";

/** One string. Exported for the same reason the deep version exists — so a
 * call site that has only a URL in hand can use the same rule. */
export function localizeUploadUrl(value: string): string {
  return value.replace(LEGACY_UPLOADS, LOCAL_UPLOADS);
}

/**
 * The same rule applied to every string inside a fetched document.
 *
 * Returns the input unchanged when there is nothing to rewrite, so a payload
 * with no legacy URL — which is every payload, once the CMS is re-seeded —
 * is not needlessly copied.
 */
export function localizeUploads<T>(value: T): T {
  if (typeof value === "string") {
    return (
      LEGACY_UPLOADS.test(value)
        ? // `LEGACY_UPLOADS` is a global regex, so `test` advances `lastIndex`.
          // `replace` resets it, but only because it is also global — reset
          // explicitly rather than relying on that pairing holding.
          ((LEGACY_UPLOADS.lastIndex = 0), localizeUploadUrl(value))
        : value
    ) as T;
  }

  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const localized = localizeUploads(item);
      if (localized !== item) changed = true;
      return localized;
    });
    return (changed ? next : value) as T;
  }

  if (value && typeof value === "object") {
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      const localized = localizeUploads(item);
      if (localized !== item) changed = true;
      next[key] = localized;
    }
    return (changed ? next : value) as T;
  }

  return value;
}
