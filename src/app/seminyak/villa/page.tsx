// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/villa/         (WP page ID 14, "Seminyak - Villas")
//
// Current Next.js Route:
// src/app/seminyak/villa/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/villa/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("Villas")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Our Villas"),
//   src/components/property/PropertyFooter.tsx (menu "villas")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman detail kamar (2) kini sudah dibuat dan ditaut dari tombol "Details":
// dirender oleh catch-all src/app/seminyak/villa/[...room]/page.tsx dengan
// konten dari src/data/rooms.ts. Ubah `slug` di data itu, bukan href di sini.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingWidget } from "@/components/property/BookingWidget";
import { RoomList } from "@/components/property/RoomList";
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  HERO_IMAGES,
  villas,
  VILLAS_INTRO,
} from "@/data/pages/seminyak-villa";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/villa");
}

/**
 * Seminyak — Villas. Section order follows the live page: the villa listing
 * with its intro, then Featured Amenities. Shares `RoomList` and `AmenityGrid`
 * with the Ubud Stay page; only the content differs.
 */
export default async function SeminyakVillaPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/villa" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak/villa" fallbackProperty="seminyak">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Private pool villas at Nyuh Bali Villas Seminyak"
            eyebrow="Seminyak"
            title="Seminyak Luxury Villas"
          />
          <BookingWidget site={site} />

          <RoomList
            eyebrow="Villas"
            heading="Seminyak Luxury Villas"
            intro={VILLAS_INTRO}
            rooms={villas(site.bookingHref)}
            tone="sand"
          />

          <AmenityGrid
            tone="sand-deep"
            amenities={[
              { icon: "wifi", title: "Complimentary", subtitle: "WIFI" },
              { icon: "spa", title: "SPA" },
              { icon: "dining", title: "16-Hour", subtitle: "In Room Dining" },
              { icon: "romance", title: "Romantic Villa" },
              { icon: "service", title: "Personalised", subtitle: "Service" },
            ]}
          />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
