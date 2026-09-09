import type { Metadata } from "next";
import { seo } from "@/data/seo";
import { getSanityPage } from "@/sanity/lib/content";
import { sanityImageUrl } from "@/sanity/lib/image";
import type { SanitySeo } from "@/sanity/types";

function applySeo(fallback: Metadata, document: SanitySeo | undefined, path: string): Metadata {
  if (!document) return fallback;

  const title = document.title;
  const description = document.description || fallback.description;
  const image = sanityImageUrl(document.image);

  return {
    ...fallback,
    title: title ? { absolute: title } : fallback.title,
    description,
    alternates: { canonical: path },
    robots: document.noIndex ? { index: false, follow: false } : fallback.robots,
    openGraph: {
      ...fallback.openGraph,
      title: title || fallback.openGraph?.title,
      description: typeof description === "string" ? description : undefined,
      images: image
        ? [{ url: image, alt: document.image?.alt || title || "Nyuh Bali Villas" }]
        : fallback.openGraph?.images,
    },
  };
}

/**
 * Uses Sanity SEO only when a published page exists; otherwise preserves the
 * route's own metadata from src/data/seo.ts. Every route can adopt this
 * without changing what it currently emits.
 */
export async function resolvePageMetadata(
  path: string,
  fallback: Metadata = seo(path),
): Promise<Metadata> {
  const page = await getSanityPage(path);
  if (!page) return fallback;
  return applySeo(fallback, page.seo, page.path);
}

/**
 * For routes backed by their own document type (post, room, experience,
 * legal page) rather than by a `page`. The document's own SEO wins, then the
 * route's existing metadata fills the rest.
 */
export function resolveDocumentMetadata(
  path: string,
  document: { seo?: SanitySeo } | null,
  fallback: Metadata = seo(path),
): Metadata {
  return applySeo(fallback, document?.seo, path);
}
