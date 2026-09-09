// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/retreat/           (WP page ID 118401, "Ubud - Retreat")
//
// Current Next.js Route:
// src/app/ubud/retreat/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/retreat/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Retreat")
// - internal links: belum ada halaman lain yang menaut ke sini secara internal
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman anak (belum dibuat, CTA "Explore More" karenanya inert):
// /ubud/retreat/luxury, /ubud/retreat/host-your-own, /ubud/wellness
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingWidget } from "@/components/property/BookingWidget";
import {
  PackageList,
  
} from "@/components/property/PackageList";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  HERO_IMAGES,
  RETREAT_PROGRAMS,
} from "@/data/pages/ubud-retreat";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/retreat");
}

/**
 * Ubud — Retreat. A short page: hero, the three programmes, awards base. It
 * reuses `PackageList` rather than introducing a separate "retreat" component
 * — a programme here is the same shape as a package (photographs, a pitch, one
 * action), it simply has no benefits list.
 */
export default async function UbudRetreatPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/retreat" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Luxury wellness retreat at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Retreat"
          />
          <BookingWidget site={site} />

          <PackageList
            eyebrow="Retreat"
            heading="Personalised Luxury Retreat"
            packages={RETREAT_PROGRAMS}
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
