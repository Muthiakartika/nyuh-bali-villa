// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/villa/            (WP page ID 118, "Ubud - Stay")
//
// Current Next.js Route:
// src/app/ubud/villa/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/villa/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Stay")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "STAY"),
//   src/components/property/PropertyFooter.tsx (menu "villas")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman detail kamar (8) kini sudah dibuat dan ditaut dari tombol "Details":
// dirender oleh catch-all src/app/ubud/villa/[...room]/page.tsx dengan konten
// dari src/data/rooms.ts. Ubah `slug` di data itu, bukan href di sini.
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
  suites,
  villas,
  SUITES_INTRO,
  VILLAS_INTRO,
} from "@/data/pages/ubud-villa";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/villa");
}

/**
 * Ubud — Stay. Section order follows the live page exactly: page intro,
 * Suites, Villas, Featured Amenities. Bands alternate sand / sand-deep so
 * three consecutive listings don't read as one texture, the same device the
 * About page uses for its three card grids.
 */
export default async function UbudVillaPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/villa" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/villa" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Luxury suites and villas at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Luxury Suite & Villa in Ubud"
          />
          <BookingWidget site={site} />

          {/* The page's own opening paragraph carries the first RoomList's
              intro slot, so the copy keeps its position above the Suites without
              needing a separate text-only band. */}
          <RoomList
            eyebrow="Stay"
            heading="Suites"
            intro={SUITES_INTRO}
            rooms={suites(site.bookingHref)}
            tone="sand"
          />

          <RoomList
            heading="Villas"
            intro={VILLAS_INTRO}
            rooms={villas(site.bookingHref)}
            tone="sand-deep"
          />

          <AmenityGrid
            tone="sand"
            amenities={[
              { icon: "wifi", title: "Complimentary", subtitle: "WIFI" },
              { icon: "spa", title: "SPA" },
              { icon: "dining", title: "16-Hour", subtitle: "In Room Dining" },
              { icon: "romance", title: "Romance" },
              { icon: "service", title: "Personalised", subtitle: "Service" },
              { icon: "yoga", title: "Yoga" },
              { icon: "gym", title: "Gym" },
              { icon: "class", title: "Balinese Class" },
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
