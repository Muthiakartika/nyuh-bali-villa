// ======================================================
// Route Information
// Original WordPress URL:
// /complimentary-services/   (WP page ID 120111, "Complimentary Services")
//
// Current Next.js Route:
// src/app/complimentary-services/page.tsx
//
// Catatan slug: URL ini TIDAK berada di bawah /ubud meskipun isinya khusus
// Ubud — sama seperti /terms-conditions dan /privacy-policy, halaman ini
// top-level di WordPress. Chrome (header/footer) memakai PROPERTY_SITES.ubud
// karena hanya menu Ubud yang menautkannya.
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/complimentary-services/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Services")
// - internal links: belum ada halaman lain yang menaut ke sini
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
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
  SERVICES,
  SERVICES_INTRO,
} from "@/data/pages/complimentary-services";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/complimentary-services");
}

/** Complimentary Services — the Ubud menu's "Services" entry. Ten
 * complimentary experiences rendered through the shared `PackageList`. */
export default async function ComplimentaryServicesPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/complimentary-services" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/complimentary-services" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Complimentary services at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Complimentary Services"
          />

          <PackageList
            eyebrow="Services"
            heading="Complimentary Services"
            intro={SERVICES_INTRO}
            packages={SERVICES}
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
