// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak-directory/   (WP page "Seminyak - Directory")
//
// Current Next.js Route:
// src/app/seminyak-directory/page.tsx
//
// Chrome is Seminyak's. `activeHref` is empty because this page is in no
// menu — it is reached only by the QR code on the card in each villa, which
// is also why nothing on the site links to it and why it stays out of the
// sitemap (see src/app/sitemap.ts).
//
// If the slug changes, update:
// - folder name: src/app/seminyak-directory/
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
import { SEMINYAK_DIRECTORY } from "@/data/pages/directories";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays exactly the
  // live site's title from src/data/seo.ts.
  return resolvePageMetadata("/seminyak-directory");
}

export default async function SeminyakDirectoryPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="" />
      <main>
        <ManagedPage path="/seminyak-directory" fallbackProperty="seminyak">
          {/* The page opens on this band and has no hero, so its heading is
              the page title — the same arrangement as the standalone form
              pages. */}
          <PackageList
            headingAs="h1"
            heading={SEMINYAK_DIRECTORY.heading}
            intro={SEMINYAK_DIRECTORY.intro}
            packages={SEMINYAK_DIRECTORY.items}
          />
        </ManagedPage>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
