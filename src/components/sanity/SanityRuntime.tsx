import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Mounted once for the public site. Without Sanity environment values this
 * emits no client code at all, which is what keeps the site's current
 * behaviour byte-identical until a project id exists.
 *
 * VisualEditing renders only in draft mode. It used to mount for every
 * visitor, where it was inert (only draft responses carry the source-map
 * metadata its overlays need) but not free: it lazy-loads nine chunks after
 * hydration, ~700 KB of JavaScript that doubled what the landing page
 * downloads and was everything PageSpeed flagged as unused there. The
 * Presentation tool opens pages through /api/draft-mode/enable, so editors
 * still get the overlays exactly where they need them.
 */
export default async function SanityRuntime() {
  if (!isSanityConfigured) return null;
  const { isEnabled } = await draftMode();
  return (
    <>
      <SanityLive />
      {isEnabled && <VisualEditing />}
    </>
  );
}
