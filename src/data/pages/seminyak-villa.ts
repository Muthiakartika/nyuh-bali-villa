// Content for src/app/seminyak/villa/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { Room } from "@/components/property/RoomList";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04 — with
// the header as the deliberate exception: the live slides are the two villas'
// own lead photographs, which the listing below already shows, so the header
// takes a villa exterior at dusk that appears nowhere else on the page.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/03/C3Ajk52Q-1.jpeg`,
];

// Seminyak's inventory is two villa types, each a 3-photo slider on the live
// page. Unlike Ubud there is no second category, so one RoomList covers it.
export const villas = (bookingHref: string): Room[] => [
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
    ratesHref: bookingHref,
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
    ratesHref: bookingHref,
    detailsHref: "/seminyak/villa/honeymoon",
    detailsInScope: true,
  },
];

export const VILLAS_INTRO =
  "What's better than living in private villa with your own pool? Each villa is completed with pool and sundeck to be enjoyed anytime at your convenience. After dipping in your pool, dance freely in the outdoor shower while smelling the natural sunlight.";
