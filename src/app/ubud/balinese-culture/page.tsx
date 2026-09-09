// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/balinese-culture/    (WP page ID 287, "Ubud - Experience")
//
// Current Next.js Route:
// src/app/ubud/balinese-culture/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/balinese-culture/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Culture")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "DISCOVER" -> kartu
//   "Experience")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman detail aktivitas (belum dibuat, tombol DETAILS karenanya inert):
// /ubud/balinese-culture/melukat-purification-ceremony,
// /ubud/balinese-culture/rice-field-walk, /ubud/balinese-culture/balinese-class
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  PackageList,
  
} from "@/components/property/PackageList";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  
  HERO_IMAGES,
  ACTIVITIES,
} from "@/data/pages/ubud-culture";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/balinese-culture");
}

/** Ubud — Culture (titled "Experience" in WordPress). Five cultural
 * activities rendered through the shared `PackageList`. */
export default async function UbudCulturePage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/balinese-culture" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/balinese-culture" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Authentic Balinese activities at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Authentic Balinese Activity"
          />

          <PackageList
            eyebrow="Culture"
            heading="Authentic Balinese Activity"
            packages={ACTIVITIES}
            tone="sand"
          />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
