// ======================================================
// Route Information
// Original WordPress URL:
// /suite-directory/   (WP page "Suite Directory")
//
// Current Next.js Route:
// src/app/suite-directory/page.tsx
//
// Chrome is Ubud's — the suites are part of the Ubud resort, so this wears
// the same header and footer as /ubud-directory rather than anything of its
// own.
//
// If the slug changes, update:
// - folder name: src/app/suite-directory/
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
import { SUITE_DIRECTORY } from "@/data/pages/directories";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays exactly the
  // live site's title from src/data/seo.ts.
  return resolvePageMetadata("/suite-directory");
}

export default async function SuiteDirectoryPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="" />
      <main>
        <ManagedPage path="/suite-directory" fallbackProperty="ubud">
          {/* The page opens on this band and has no hero, so its heading is
              the page title — the same arrangement as the standalone form
              pages. */}
          <PackageList
            headingAs="h1"
            heading={SUITE_DIRECTORY.heading}
            intro={SUITE_DIRECTORY.intro}
            packages={SUITE_DIRECTORY.items}
          />
        </ManagedPage>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
