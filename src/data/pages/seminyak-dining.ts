// Content for src/app/seminyak/dining/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";
import type { Testimonial } from "@/data/testimonials";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04 — with
// the header as the deliberate exception. Two dining scenes the venues below
// don't use. The live page's header slides
// are the Dining Experience and Candle Light Dinner photographs, which appear
// again further down the page — no picture is used twice on a page here.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/02/Floating-breakfast.jpg`,
  `${UPLOADS}/2022/12/Dining-experience.jpeg`,
];

// Menu PDFs, hosted on the WordPress uploads folder like the images.
export const MENU_ALA_CARTE = `${UPLOADS}/2023/03/Nyuh-Bali-Villas-Ala-Carte-Menu.pdf`;

export const MENU_BREAKFAST = `${UPLOADS}/2023/03/Breakfast-Menu-Seminyak.pdf`;

export const MENU_CLD_BBQ = `${UPLOADS}/2023/03/CLD-BBQ-Menu-Seminyak.pdf`;

// Three dining venues/experiences. The first carries two menu links, which is
// why PackageList takes a `ctas` array rather than a single CTA.
export const DINING: PackageItem[] = [
  {
    name: "Dining Experience",
    images: [
      `${UPLOADS}/2023/01/BBQ-seminyak-min-min-slider-1-_1__1.webp`,
      `${UPLOADS}/2023/03/ezgif.com-gif-maker-1.webp`,
    ],
    description:
      "For a taste of fantastic food and convenient meal atmosphere, our Nyuh Restaurant is ready to pamper your appetite. With the menu selections prepared by our experienced cook, choose ones to satisfy your craving from breakfast to dinner. You can also reserve a poolside barbeque or romantic dinner within the ultimate privacy of your villa.",
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
    name: "Candle Light Dinner",
    images: [`${UPLOADS}/2023/03/ezgif.com-gif-maker.webp`],
    description:
      "Treat yourself to a romantic dining experience under the stars served in your villa by the pool. It is the perfect opportunity for a couple seeking private time just for two. Your gourmet meal is served by a personal butler on a table specially decorated with tropical floral arrangements and candle lights.",
    ctas: [
      {
        label: "Candle Light Dinner Menu",
        href: MENU_CLD_BBQ,
        external: true,
      },
    ],
  },
  {
    name: "BBQ",
    images: [`${UPLOADS}/2023/03/seminyak-bbq.webp`],
    description:
      "Savour the fresh and flavourful BBQ meats with a selection of traditional Balinese or Western Delight cooked by your chef in your own villa",
    ctas: [{ label: "BBQ Menu", href: MENU_CLD_BBQ, external: true }],
  },
];

export const GUEST_QUOTES: Testimonial[] = [
  {
    quote:
      "The food was great. We had breakfast lunch and dinner at the villa and I highly recommend the kitchen and the chefs.",
    author: "George Parevski , Tripadvisor",
  },
  {
    quote:
      "Enjoyed the floating breakfast and not only was it beautiful but the food was delicious.",
    author: "Esther, Google",
  },
  {
    quote:
      "We would highly recommend the seafood BBQ, cooked for you in the villa.",
    author: "Mrericrogers, Tripadvisor",
  },
];
