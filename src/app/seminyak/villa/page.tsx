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
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import { RoomList, type Room } from "@/components/property/RoomList";
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/seminyak/villa");

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/One-Bedroom-Pool-Villa-2.webp`,
  `${UPLOADS}/2023/03/Honeymoon-Suite-Pool-Villa-1.webp`,
];

// Seminyak's inventory is two villa types, each a 3-photo slider on the live
// page. Unlike Ubud there is no second category, so one RoomList covers it.
const VILLAS: Room[] = [
  {
    name: "One-bedroom Pool Villa",
    images: [
      `${UPLOADS}/2023/03/One-Bedroom-Pool-Villa-2.webp`,
      `${UPLOADS}/2023/03/seminyak-best-price.webp`,
      `${UPLOADS}/2023/03/One-Bedroom-Pool-Villa-5.webp`,
    ],
    bed: "King Size (1,8m x 2m)",
    size: "120 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/seminyak/villa/honeymoon/pool",
    detailsInScope: true,
  },
  {
    name: "Honeymoon Suite Pool Villa",
    images: [
      `${UPLOADS}/2023/03/Honeymoon-Suite-Pool-Villa-1.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Suite-Pool-Villa-2.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Suite-Pool-Villa-5.webp`,
    ],
    bed: "King Size (1,8m x 2m)",
    size: "150 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/seminyak/villa/honeymoon",
    detailsInScope: true,
  },
];

/**
 * Seminyak — Villas. Section order follows the live page: the villa listing
 * with its intro, then Featured Amenities. Shares `RoomList` and `AmenityGrid`
 * with the Ubud Stay page; only the content differs.
 */
export default function SeminyakVillaPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/villa" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Private pool villas at Nyuh Bali Villas Seminyak"
          eyebrow="Seminyak"
          title="Seminyak Luxury Villas"
        />
        <BookingSearchBar bookingHref={site.bookingHref} />

        <RoomList
          eyebrow="Villas"
          heading="Seminyak Luxury Villas"
          intro="What's better than living in private villa with your own pool? Each villa is completed with pool and sundeck to be enjoyed anytime at your convenience. After dipping in your pool, dance freely in the outdoor shower while smelling the natural sunlight."
          rooms={VILLAS}
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
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
