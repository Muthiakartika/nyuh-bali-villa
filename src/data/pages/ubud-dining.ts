// Content for src/app/ubud/dining/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";
import type { Testimonial } from "@/data/testimonials";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

export const MENU_ALA_CARTE = `${UPLOADS}/2025/06/All-Day-Menu-Villa.pdf`;

export const MENU_BREAKFAST = `${UPLOADS}/2023/08/Villas-Breakfast-Ubud.pdf`;

export const MENU_BBQ = `${UPLOADS}/2023/06/BBQ-Ubud-020623.pdf`;

export const MENU_ROMANTIC = `${UPLOADS}/2023/05/CLD-Menu-Ubud-010523.pdf`;

export const MENU_CULTURAL_NIGHT = `${UPLOADS}/2025/06/Balinese-Cultural-Night.pdf`;

// Photographs verified against this route on the live site, 2026-09-04.
// Slides 2 and 3 are not the live site's: those two are Lumbini Restaurant's
// own gallery photographs, which the venue row below carries. No picture may
// appear twice on a page, so the header takes the restaurant room and the
// cooking class instead.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/03/ezgif.com-gif-maker-10.webp`,
  `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-18-1.jpg`,
  `${UPLOADS}/2023/03/ubud-dining-3.webp`,
  `${UPLOADS}/2023/03/ezgif.com-gif-maker-9.webp`,
];

export const DINING: PackageItem[] = [
  {
    name: "Lumbini Restaurant in Ubud",
    // The restaurant itself. `ubud-dining-1` used to lead here, but it is a
    // photograph of the poolside BBQ — which is where the live page puts it.
    images: [
      `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-17-1.jpg`,
      `${UPLOADS}/2023/03/ezgif.com-gif-maker-11.webp`,
    ],
    description:
      "Just like you, we agree that luxury retreat should provide both healthy and tasty food. Here at Nyuh Bali, we believe that good food should come from fresh ingredients with respect to nature. Nothing beats the flavor of harvested vegetables grown with sustainable practices. Thanks to Bali’s nature that provides a diversity of herbs to enrich the seasoning of every plate that we create. We are committed to cooking from our hearts without additional MSG, chemical colorant, or artificial sweetener. We also tailor our food to individual dietary, such as vegetarian, vegan foods, gluten-free, or any allergy requirement.",
    ctas: [
      { label: "Ala Carte Menu", href: MENU_ALA_CARTE, external: true },
      {
        label: "Breakfast Menu",
        href: MENU_BREAKFAST,
        external: true,
        variant: "outline",
      },
    ],
  },
  {
    name: "BBQ",
    images: [`${UPLOADS}/2023/03/ubud-dining-1.webp`],
    description:
      "Savour the fresh, flavourful BBQ meats with a selection of traditional Balinese or Western Delight cooked by your chef. We invite you to take pleasure in an exclusive dining experience in the privacy of your private villa.",
    ctas: [{ label: "BBQ Menu", href: MENU_BBQ, external: true }],
  },
  {
    name: "Romantic Dinner",
    images: [`${UPLOADS}/2024/11/011A0333-Edit-min-min-min-1.jpg`],
    description:
      "Treat yourself to a romantic dining experience under the stars served in your villa by the pool or in our special dining venue. It is the perfect opportunity for a couple seeking private time just for two. Your gourmet meal is served by a personal butler on a table specially decorated with tropical floral arrangements and candle lights.",
    ctas: [
      { label: "Romantic Dinner Menu", href: MENU_ROMANTIC, external: true },
    ],
  },
  {
    name: "Balinese Cultural Night",
    images: [`${UPLOADS}/2024/10/Balinese-Dance.jpg`],
    meta: [{ label: "When", value: "Every Saturday at IDR 490.000++/person" }],
    description:
      "Experience the charm of Balinese culture at our Cultural Night. Enjoy a delectable four-course dinner of mouthwatering Balinese cuisine. Be captivated by traditional dance performances, and join in the fun with a lively Joget.",
    ctas: [
      { label: "View Dinner Menu", href: MENU_CULTURAL_NIGHT, external: true },
    ],
  },
  {
    name: "Market Tour and Private Balinese Cooking Lesson",
    images: [`${UPLOADS}/2023/05/IS_06904-Copy-min-1.jpg`],
    description:
      "Although it seems that Balinese cooking is complicated, in fact, it is not true, if you know the types of herbs you are going to use in the cooking and how to use them.",
    // Detail page (/ubud/balinese-culture/cooking-class/) is outside scope.
    ctas: [
      {
        label: "Discover more",
        href: "/ubud/balinese-culture/cooking-class",
        inScope: true,
      },
    ],
  },
  {
    name: "Floating Breakfast",
    // Was a plated seafood dish — the wrong picture entirely. This is the
    // live page's own floating-breakfast photograph.
    images: [`${UPLOADS}/2023/03/ubud-dining-4.webp`],
    description:
      "Greet every morning with the positive thought to welcome the beautiful sunshine. Experience the real balinese vibes by having floating breakfast in our iconic main pool or your own private pool.",
  },
];

export const GUEST_QUOTES: Testimonial[] = [
  {
    quote:
      "We enjoyed the private bbq dinner in villa (so much food!) and a highlight of our entire trip to Bali was definitely the Balinese cooking class! Seeing the market and learning to cook such flavourful dishes was romantic and fun and educational!",
    author: "Heather Ramshaw, Google",
  },
  {
    quote:
      "All the food served at the resort was amazing. Each dish was not only delicious, but also extremely fresh and left us satisfied without feeling overly weighed down. In fact, after going into town and trying some of the nearby restaurants, we regretted not having stayed to eat at the resort.",
    author: "Ms. Unoma and Mr. Timothy, Google",
  },
  {
    quote:
      "The food from the hotel restaurant went beyond my expectations and offered many many options to fit all tastes",
    author: "Mr Will WSSIV, Google",
  },
  {
    quote:
      "The staff decorated it for our arrival and for our candlelight dinner and it was very romantic. We had breakfast here every day, one afternoon tea, and two dinners and all of the food was very delicious.",
    author: "Nicole, Tripadvisor",
  },
];
