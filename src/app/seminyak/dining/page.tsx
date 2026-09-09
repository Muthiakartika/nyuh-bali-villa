// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/dining/        (WP page ID 134, "Seminyak - Dining")
//
// Current Next.js Route:
// src/app/seminyak/dining/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/dining/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("Dining")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Discover" ->
//   kartu "Dining")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: tautan menu di halaman ini menunjuk ke file PDF di wp-content.
// Jika PDF dipindahkan saat migrasi, perbarui konstanta MENU_* di bawah.
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
} from "@/data/pages/seminyak-dining";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/dining");
}

/**
 * Seminyak — Dining. The live page has no booking widget, so this one doesn't
 * carry `BookingSearchBar` either: its actions are the menu downloads.
 */
export default async function SeminyakDiningPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/dining" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak/dining" fallbackProperty="seminyak">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Dining at Nyuh Bali Villas Seminyak"
            eyebrow="Seminyak"
            title="Dining Experience"
          />

          <PackageList
            eyebrow="Dining"
            heading="Dining Experience"
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
