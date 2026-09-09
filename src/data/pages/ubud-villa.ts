// Content for src/app/ubud/villa/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { Room } from "@/components/property/RoomList";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04.
// The live header's three slides are the lead photographs of three rooms in
// the listing below; no picture may appear twice on a page, so the header
// takes an aerial of the resort and a pool villa the listing doesn't show.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/03/ubud-slider-1.webp`,
  `${UPLOADS}/2023/02/One-Bedroom-Deluxe-Pool-Villa-1.jpg`,
];

// The live page splits its inventory into two categories, each with its own
// intro paragraph — Suites (2) and Villas (6). Both keep their own 3-photo
// slider per room, which is why `RoomList` renders through `ImageGallery`.
export const suites = (bookingHref: string): Room[] => [
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
    ratesHref: bookingHref,
    detailsHref: "/ubud/villa/suite",
    detailsInScope: true,
  },
  {
    name: "Honeymoon Suite",
    // Re-synced with the live listing (Aug 2026), which now leads with the
    // new `2026/08` shoot for this room. Six slides, not three — the live
    // slider grew when the new photographs were added.
    images: [
      `${UPLOADS}/2023/03/Honeymoon-Suite-4.webp`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-6-1.jpg`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-32-1.jpg`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-5-1.jpg`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-3-1.jpg`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-4-1.jpg`,
    ],
    bed: "1 King Size (1,8m x 2m)",
    size: "65 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: bookingHref,
    detailsHref: "/ubud/villa/honeymoon/pool",
    detailsInScope: true,
  },
];

export const villas = (bookingHref: string): Room[] => [
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
    ratesHref: bookingHref,
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
    ratesHref: bookingHref,
    detailsHref: "/ubud/villa/1-bedroom-pool-royal",
    detailsInScope: true,
  },
  {
    name: "Honeymoon Pool Villa",
    // Re-synced with the live listing (Aug 2026) — same story as the
    // Honeymoon Suite above.
    images: [
      `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-5.webp`,
      `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-3.webp`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-8-1.jpg`,
      `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-4.webp`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-14-1.jpg`,
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-12-1.jpg`,
    ],
    bed: "King Size (1,8m x 2m)",
    size: "250 sqm",
    occupancy: "2 adults and one child (under five years old)",
    ratesHref: bookingHref,
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
    ratesHref: bookingHref,
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
    ratesHref: bookingHref,
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
    ratesHref: bookingHref,
    detailsHref: "/ubud/villa/4-bedroom-pool",
    detailsInScope: true,
  },
];

export const SUITES_INTRO =
  "Feel the spirit of Bali, personalized service, and the authentic Balinese culture in the villas and suites at our Ubud Resort. As part of our effort to respect the Earth, our Ubud resort is designed to harmonize with nature, built by following the land contour and keeping the existing trees as many as possible. Wake up in Ubud while eyes open to a profusion of color from our tropical garden, inhale the fresh morning breeze, and hear the groups of birds singing. Presenting our newest collection category, our suites, which just opened in April 2023. Step inside our suite in Ubud, and you’ll find rooms that have been created unlike any of the usual hotel rooms. Expect a large glass window to catch the tropical sunshine and a shaded balcony to enjoy Bali’s breeze. Each suite is built across 60 sqm featuring a natural concept and Balinese artisanal design from the contemporary teak furniture, a large stone bathtub, and luxurious local touches to retreat from your busy routine.";

export const VILLAS_INTRO =
  "Escape to our Luxury Villa in Ubud to revitalize yourself. A private swimming pool adds the luxury ambiance of our villas in Ubud, while a large natural stone bathtub creates a memorable bathing experience for one to pamper. Set around a peaceful tropical garden, our breathtaking Balinese pool villa also features an outdoor rainshower and a separate semi-open dining area. Harmoniously blending traditional Balinese touches with modern amenities, our villas in Ubud are mindfully created for both comfort and beauty.";
