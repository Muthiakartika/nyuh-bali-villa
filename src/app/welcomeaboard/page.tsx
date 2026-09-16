// ======================================================
// Route Information
// Original WordPress URL:
// /welcomeaboard/   (WP page "Welcome Aboard")
//
// Current Next.js Route:
// src/app/welcomeaboard/page.tsx
//
// Staff onboarding, not a guest page. Chrome is Ubud's, which is what the
// live page wears. Every one of its five actions leaves the site — two PDFs, a
// Google Form quiz, a JotForm signature invite and a Google Form database —
// so there is nothing here to keep in step with the rest of the build.
//
// If the slug changes, update:
// - folder name: src/app/welcomeaboard/
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
import { WELCOME_ABOARD } from "@/data/pages/directories";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays exactly the
  // live site's title from src/data/seo.ts.
  return resolvePageMetadata("/welcomeaboard");
}

export default async function WelcomeAboardPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="" />
      <main>
        <ManagedPage path="/welcomeaboard" fallbackProperty="ubud">
          {/* The page opens on this band and has no hero, so its heading is
              the page title — the same arrangement as the standalone form
              pages. */}
          <PackageList
            headingAs="h1"
            heading={WELCOME_ABOARD.heading}
            intro={WELCOME_ABOARD.intro}
            packages={WELCOME_ABOARD.items}
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
