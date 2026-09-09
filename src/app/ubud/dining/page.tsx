// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/dining/            (WP page ID 260, "Ubud - Dining")
//
// Current Next.js Route:
// src/app/ubud/dining/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/dining/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Dining")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "DISCOVER" -> kartu
//   "Dining"), src/app/ubud/retreat/host-your-own/page.tsx (Healthy Meals)
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: menu berupa PDF di wp-content — perbarui konstanta MENU_* jika
// file dipindahkan saat migrasi.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  PackageList,
  
} from "@/components/property/PackageList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import type { } from "@/data/testimonials";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  
  
  
  
  
  HERO_IMAGES,
  DINING,
  GUEST_QUOTES,
} from "@/data/pages/ubud-dining";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/dining");
}

/** Ubud — Dining. Six venues/experiences then the guest quotes, in the live
 * page's order. Reuses `PackageList`, the same component the Seminyak dining
 * page uses. */
export default async function UbudDiningPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/dining" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/dining" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Lumbini Restaurant at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Dining"
          />

          <PackageList
            eyebrow="Dining"
            heading="Lumbini Restaurant in Ubud"
            packages={DINING}
            tone="sand"
          />

          <TestimonialCarousel testimonials={GUEST_QUOTES} />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
