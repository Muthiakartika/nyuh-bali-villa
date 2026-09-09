// Content for src/app/ubud/retreat/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04.
// Not the Personalised Luxury Retreat photograph the live header shares with
// the first programme below — no picture may appear twice on a page.
export const HERO_IMAGES = [`${UPLOADS}/2023/04/image-7.png`];

// The live page is three programmes, each a photograph, a pitch and an
// EXPLORE MORE link. All three destinations are now built here, and they are
// the same three entries the header's Retreat dropdown carries.
export const RETREAT_PROGRAMS: PackageItem[] = [
  {
    name: "Personalised Luxury Retreat",
    images: [`${UPLOADS}/2023/04/Photo-15-01-23-14.18.24-1-min.jpg`],
    description:
      "We are dedicated to creating a luxury retreat in Ubud for everyone, whether you want to heal your soul, let go, or simply just to relax. It doesn't matter what you have been; what matter is the person you are becoming. Come as you are, feel the embrace of a safe space to grow, awaken your hidden potential, and be reborn after for a new beginning. Welcome to a luxury retreat in Ubud, unlike any other.",
    ctas: [
      { label: "Explore More", href: "/ubud/retreat/luxury", inScope: true },
    ],
  },
  {
    name: "Host your Retreat",
    images: [`${UPLOADS}/2023/05/TD004090-min-Copy.jpg`],
    description:
      "Inspired by the philosophy of the coconut tree, or Nyuh in the Balinese language, which has many functions to shore up people’s lives, we aim to provide a one-stop service to create the luxury retreat ambiance you are looking for. Presenting you with two spacious yoga shala, five-star accommodations, two swimming pools, healthy foods, and spa service, we ensure that you and your students will feel the power of positive transformation. With an experienced and caring team member, you could focus on delivering your retreat program, and we would be pleased to take care of the rest.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/retreat/host-your-own",
        inScope: true,
      },
    ],
  },
  {
    name: "Wellness Facilities",
    images: [`${UPLOADS}/2026/08/Nyuh-Bali-Ubud-24-1.jpg`],
    description:
      "Whether you wish to heal your trauma, rejuvenate, or just relax, Ubud has something for everyone. Discover our Ubud luxury wellness and retreat facilities to provide a wide range of opportunities for you to find your inner peace",
    ctas: [{ label: "Explore More", href: "/ubud/wellness", inScope: true }],
  },
];
