import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Mounted once for the public site. Without Sanity environment values this
 * emits no client code at all, which is what keeps the site's current
 * behaviour byte-identical until a project id exists. VisualEditing is inert
 * on normal pages because only draft responses carry the source-map metadata
 * its overlays need.
 */
export default function SanityRuntime() {
  if (!isSanityConfigured) return null;
  return (
    <>
      <SanityLive />
      <VisualEditing />
    </>
  );
}
