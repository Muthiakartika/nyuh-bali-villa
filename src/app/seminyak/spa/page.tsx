// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/spa/           (WP page ID 142, "Seminyak - SPA")
//
// Current Next.js Route:
// src/app/seminyak/spa/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/spa/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("SPA")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Discover" ->
//   kartu "SPA")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: setiap "Book Now" menaut ke /spa-reservation-seminyak/ (WP page ID
// 144) yang BELUM dibuat di project ini, sehingga masih menunjuk ke situs live.
// Jika halaman reservasi spa dibuat, ganti SPA_RESERVATION_HREF di bawah.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  TreatmentList,
  
} from "@/components/property/TreatmentList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import type { } from "@/data/testimonials";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  SPA_RESERVATION_HREF,
  HERO_IMAGES,
  TREATMENTS,
  GUEST_QUOTES,
  SPA_INTRO,
} from "@/data/pages/seminyak-spa";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/spa");
}

/**
 * Seminyak — SPA. Hero, the treatment menu grouped as on the live page, then
 * the guest quotes. No booking widget: the live page's action is a spa
 * reservation, not a room-night search.
 */
export default async function SeminyakSpaPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/spa" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak/spa" fallbackProperty="seminyak">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Spa at Nyuh Bali Villas Seminyak"
            eyebrow="Seminyak"
            title="Romantic Spa Experience"
          />

          <TreatmentList
            eyebrow="SPA"
            heading="Romantic Spa Experience in Seminyak"
            intro={SPA_INTRO}
            notes={[
              "Opening Hours: 09.00 - 17.00",
              "Enjoy 20% Discount for early booking before arrival",
            ]}
            categories={TREATMENTS}
            cta={{ label: "Reserve Now", href: SPA_RESERVATION_HREF }}
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
