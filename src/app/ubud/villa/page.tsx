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
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import { RoomList, type Room } from "@/components/property/RoomList";
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud/villa");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// The live page opens straight onto the booking widget with no hero image at
// all. This build gives every property page the same opening as the About
// pages (see the brief: keep the existing hero layout), using the room
// photography that already belongs to this page rather than introducing a new
// image. Heading and eyebrow are strings the page already carries.
const HERO_IMAGES = [
  `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-5.webp`,
  `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-6.webp`,
  `${UPLOADS}/2023/03/Suite-6.webp`,
];

// The live page splits its inventory into two categories, each with its own
// intro paragraph — Suites (2) and Villas (6). Both keep their own 3-photo
// slider per room, which is why `RoomList` renders through `ImageGallery`.
const SUITES: Room[] = [
  {
    name: "Suite",
    images: [
      `${UPLOADS}/2023/03/Suite-6.webp`,
      `${UPLOADS}/2023/03/Suite-4.webp`,
      `${UPLOADS}/2023/03/Suite-2.webp`,
    ],
    bed: "1 King Size (1,8m x 2m) or 2 Hollywood twins (1,2m x 2m each)",
    size: "65 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/suite",
    detailsInScope: true,
  },
  {
    name: "Honeymoon Suite",
    images: [
      `${UPLOADS}/2023/03/Honeymoon-Suite-4.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Suite-6.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Suite-1.webp`,
    ],
    bed: "1 King Size (1,8m x 2m)",
    size: "65 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/honeymoon/pool",
    detailsInScope: true,
  },
];

const VILLAS: Room[] = [
  {
    name: "One Bedroom Deluxe Pool Villa",
    images: [
      `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-6.webp`,
      `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-5.webp`,
      `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-2-1.webp`,
    ],
    bed: "King Size (1,8m x 2m)",
    size: "240 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/1-bedroom-pool-deluxe",
    detailsInScope: true,
  },
  {
    name: "One Bedroom Royal Pool Villa",
    images: [
      `${UPLOADS}/2023/03/One-Bedroom-Royal-Pool-Villa-4.webp`,
      `${UPLOADS}/2023/03/One-Bedroom-Royal-Pool-Villa-5.webp`,
      `${UPLOADS}/2023/03/One-Bedroom-Royal-Pool-Villa-6.webp`,
    ],
    bed: "1 King Size (1,8m x 2m) or 2 Hollywood twins (1,2m x 2m each)",
    size: "250 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/1-bedroom-pool-royal",
    detailsInScope: true,
  },
  {
    name: "Honeymoon Pool Villa",
    images: [
      `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-5.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-3.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-4.webp`,
    ],
    bed: "King Size (1,8m x 2m)",
    size: "250 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/honeymoon",
    detailsInScope: true,
  },
  {
    name: "Two Bedroom Pool Villa",
    images: [
      `${UPLOADS}/2023/03/Two-Bedroom-Pool-Villa-2.webp`,
      `${UPLOADS}/2023/03/Two-Bedroom-Pool-Villa-5.webp`,
      `${UPLOADS}/2023/03/Two-Bedroom-Pool-Villa-4.webp`,
    ],
    bed: "Two King Size (1,8m x 2m) OR 1 King Size + 2 Holywood twins",
    size: "300 sqm",
    occupancy: "4 adults and two children (below five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/2-bedroom-pool",
    detailsInScope: true,
  },
  {
    name: "Three Bedroom Pool Villa",
    images: [
      `${UPLOADS}/2023/03/Three-Bedroom-Pool-Villa-4.webp`,
      `${UPLOADS}/2023/03/Two-Bedroom-Pool-Villa-6.webp`,
      `${UPLOADS}/2023/03/Three-Bedroom-Pool-Villa-5.webp`,
    ],
    bed: "2 King Size (1,8m x 2m) + 2 Holywood Twins",
    size: "540 sqm",
    occupancy: "6 adults and two children (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/3-bedroom-pool",
    detailsInScope: true,
  },
  {
    name: "Four-Bedroom Pool Villa",
    images: [
      `${UPLOADS}/2023/03/Four-Bedroom-Pool-Villa-4.webp`,
      `${UPLOADS}/2023/03/Four-Bedroom-Pool-Villa-3.webp`,
      `${UPLOADS}/2023/03/Four-Bedroom-Pool-Villa-5.webp`,
    ],
    bed: "3 King Size (1,8m x 2m) + 2 Holywood twins",
    size: "450 sqm",
    occupancy: "8 adults and two children (under five years old)",
    ratesHref: site.bookingHref,
    detailsHref: "/ubud/villa/4-bedroom-pool",
    detailsInScope: true,
  },
];

/**
 * Ubud — Stay. Section order follows the live page exactly: page intro,
 * Suites, Villas, Featured Amenities. Bands alternate sand / sand-deep so
 * three consecutive listings don't read as one texture, the same device the
 * About page uses for its three card grids.
 */
export default function UbudVillaPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/villa" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Luxury suites and villas at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Luxury Suite & Villa in Ubud"
        />
        <BookingSearchBar bookingHref={site.bookingHref} />

        {/* The page's own opening paragraph carries the first RoomList's
            intro slot, so the copy keeps its position above the Suites without
            needing a separate text-only band. */}
        <RoomList
          eyebrow="Stay"
          heading="Suites"
          intro="Feel the spirit of Bali, personalized service, and the authentic Balinese culture in the villas and suites at our Ubud Resort. As part of our effort to respect the Earth, our Ubud resort is designed to harmonize with nature, built by following the land contour and keeping the existing trees as many as possible. Wake up in Ubud while eyes open to a profusion of color from our tropical garden, inhale the fresh morning breeze, and hear the groups of birds singing. Presenting our newest collection category, our suites, which just opened in April 2023. Step inside our suite in Ubud, and you’ll find rooms that have been created unlike any of the usual hotel rooms. Expect a large glass window to catch the tropical sunshine and a shaded balcony to enjoy Bali’s breeze. Each suite is built across 60 sqm featuring a natural concept and Balinese artisanal design from the contemporary teak furniture, a large stone bathtub, and luxurious local touches to retreat from your busy routine."
          rooms={SUITES}
          tone="sand"
        />

        <RoomList
          heading="Villas"
          intro="Escape to our Luxury Villa in Ubud to revitalize yourself. A private swimming pool adds the luxury ambiance of our villas in Ubud, while a large natural stone bathtub creates a memorable bathing experience for one to pamper. Set around a peaceful tropical garden, our breathtaking Balinese pool villa also features an outdoor rainshower and a separate semi-open dining area. Harmoniously blending traditional Balinese touches with modern amenities, our villas in Ubud are mindfully created for both comfort and beauty."
          rooms={VILLAS}
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
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
