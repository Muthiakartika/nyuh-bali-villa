// Content for src/app/ubud/retreat/host-your-own/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04.
export const HERO_IMAGES = [`${UPLOADS}/2023/05/AW_06570-min-2.jpg`];

export const RETREAT_EMAIL = "retreat@ubudnyuhbali.com";

export const INTRO: PackageItem[] = [
  {
    name: "Why Host your Retreat with us?",
    // Two retreat-group photographs of their own. The live page opens this row
    // on the pictures the Healthy Meals and Retreat Specialist rows carry
    // further down, and no picture may appear twice on a page.
    images: [
      `${UPLOADS}/2023/10/how-to-host-retreat-4.jpg`,
      `${UPLOADS}/2023/10/how-to-host-retreat-5.jpg`,
    ],
    description:
      "Inspired by the philosophy of the coconut tree, or Nyuh in the Balinese language, which has many functions to shore up people’s lives, we aim to provide a one-stop service to create the luxury retreat ambiance you are looking for. Presenting you with two spacious yoga shala, five-star accommodations, two swimming pools, healthy foods, and spa service, we ensure that you and your students will feel the power of positive transformation. With an experienced and caring team member, you could focus on delivering your retreat program, and we would be pleased to take care of the rest.",
    notes: [
      `For consultation & price, please email us through ${RETREAT_EMAIL}`,
    ],
    ctas: [
      {
        label: "Personalize your Retreat",
        href: "/ubud-personalize-your-retreat",
        inScope: true,
      },
    ],
  },
];

export const MEALS: PackageItem[] = [
  {
    name: "Healthy Meals",
    images: [`${UPLOADS}/2023/04/bg-retreat.webp`],
    description:
      "Just like you, we agree that luxury retreats should provide both healthy and tasty food. Here at Nyuh Bali, we believe that good food should come from fresh ingredients with respect to nature. All meals are healthy and delicious and are served in our healthy dining restaurant, The Retreat. We provide a variety of cuisine options, including Balinese, western, vegan, vegetarian, gluten-free, and Mediterranean.",
  },
  {
    name: "Retreat Specialist",
    images: [`${UPLOADS}/2023/05/AW_06640-min.webp`],
    description:
      "We are dedicated to supporting your retreat in many ways for a memorable experience for you and your students. Just tell us anything in your mind, and we will explore all possibilities.",
    benefitsHeading: "Some options that could be added to your program",
    // Two of these are a label and a sentence on one line each on the live
    // site, split by a `<br>`. They had been condensed into a single reworded
    // line; restored verbatim, with the break kept.
    benefits: [
      "Healthy Balinese Cooking Class (vegan's also possible)",
      "Movie Night & Special Events",
      "Island Excursions\nWe can arrange from cultural tours to adventurous activities like mount trekking, rafting, and ATV riding",
      "Printing Service\nWe can help to print retreat materials and amenities like books, t-shirts, and goodie bag",
      "Photography Service",
    ],
  },
];
