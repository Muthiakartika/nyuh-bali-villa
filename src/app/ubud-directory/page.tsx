// ======================================================
// Route Information
// Original WordPress URL:
// /ubud-directory/   (WP page "Ubud - Directory")
//
// Current Next.js Route:
// src/app/ubud-directory/page.tsx
//
// Chrome is Ubud's. Villa guests; the suites get /suite-directory, which is
// the same page with its own photographs, dining room and extension.
//
// If the slug changes, update:
// - folder name: src/app/ubud-directory/
// - the redirect map in next.config.ts, if an old URL needs to keep resolving
// - src/data/seo.ts and src/data/sitemap.ts, both keyed by published path
// - src/app/sitemap.ts (DIRECTORY_PATHS), which excludes this path by name
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PackageList } from "@/components/property/PackageList";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { UBUD_DIRECTORY } from "@/data/pages/directories";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays exactly the
  // live site's title from src/data/seo.ts.
  return resolvePageMetadata("/ubud-directory");
}

export default async function UbudDirectoryPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="" />
      <main>
        <ManagedPage path="/ubud-directory" fallbackProperty="ubud">
          {/* The page opens on this band and has no hero, so its heading is
              the page title — the same arrangement as the standalone form
              pages. */}
          <PackageList
            headingAs="h1"
            heading={UBUD_DIRECTORY.heading}
            intro={UBUD_DIRECTORY.intro}
            packages={UBUD_DIRECTORY.items}
          />
          {/* Inside `ManagedPage`, like every other band on the site. It used
              to sit outside, which made it the one strip on these four pages a
              client could not hide from the Studio — and meant the seeded
              document had to leave its `awardsSection` out to avoid drawing a
              second one. */}
          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
