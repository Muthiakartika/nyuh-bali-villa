import type { ReactNode } from "react";
import PageBuilder from "@/components/sanity/PageBuilder";
import { getPropertySite, getSanityPage } from "@/sanity/lib/content";
import type { PropertySlug } from "@/data/properties";

/**
 * Lets an existing route hand itself over to the CMS, one route at a time.
 *
 * Wrap the route's own JSX in this and nothing changes until someone
 * publishes a `page` document at that path — at which point the document's
 * sections render instead. It is the same contract as every other resolver
 * here: no document means the route keeps what it already had.
 *
 * ```tsx
 * export default async function UbudSpaPage() {
 *   const site = await getPropertySite("ubud");
 *   return (
 *     <ManagedPage path="/ubud/spa" fallbackProperty="ubud">
 *       … the route's existing JSX …
 *     </ManagedPage>
 *   );
 * }
 * ```
 *
 * The chrome stays the route's own: only the `<main>` content is replaced,
 * because header, footer and the booking widget are resolved per property
 * rather than authored per page.
 */
export default async function ManagedPage({
  path,
  fallbackProperty,
  children,
}: {
  path: string;
  fallbackProperty: PropertySlug;
  children: ReactNode;
}) {
  const page = await getSanityPage(path);
  if (!page?.sections?.length) return <>{children}</>;

  const site = await getPropertySite(page.property ?? fallbackProperty);
  return <PageBuilder sections={page.sections} site={site} />;
}
