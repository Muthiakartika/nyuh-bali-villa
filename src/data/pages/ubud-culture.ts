// Content for src/app/ubud/balinese-culture/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

export const CULTURE_BASE = "/ubud/balinese-culture";

// Photographs verified against this route on the live site, 2026-09-04.
// Not the aerial below — that one belongs to the Complimentary Morning Walk
// row, and no picture may appear twice on a page.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/02/Daily-authentic-bali-class.jpg`,
];

export const ACTIVITIES: PackageItem[] = [
  {
    name: "Balinese Cultural Night",
    images: [`${UPLOADS}/2024/10/Balinese-Dance.jpg`],
    meta: [
      { label: "When", value: "Every Saturday from 19.30-20.30" },
      { label: "Price", value: "at IDR 490.000++/person" },
    ],
    description:
      "Experience the charm of Balinese culture at our Cultural Night. Enjoy a delectable four-course dinner of mouthwatering Balinese cuisine. Be captivated by traditional dance performances, and join in the fun with a lively Joget. Immerse yourself in an unforgettable evening where every bite and every dance celebrates the spirit of Bali.",
  },
  {
    name: "Balinese Rindik Performance",
    images: [`${UPLOADS}/2025/07/Rindik-2-1.jpg`],
    meta: [
      { label: "When", value: "Every Tuesday from 19.00-21.00" },
      {
        label: "Price",
        value: "Complimentary for guests dining at Lumbini Restaurant",
      },
    ],
    description:
      "Immerse yourself in the calming sounds of Balinese Rindik and bamboo flute, performed live every Tuesday at Ubud Nyuh Bali Resort. Rindik, a traditional Balinese bamboo xylophone, blends beautifully with the soft notes of the flute to create a soothing atmosphere that reflects the island’s harmony and grace. This experience is complimentary for guests dining at Lumbini Restaurant.",
  },
  {
    name: "Melukat - Balinese Purification Ceremony",
    images: [`${UPLOADS}/2023/03/melukat-1.webp`],
    description:
      "Derived from lukat, which means purify, Melukat aims to refine mind inside human body from the bad elements. This ceremony is mostly held after bad things happened to someone, like they got sick, had been in an accident, or merely feel restless.",
    ctas: [
      {
        label: "Details",
        href: `${CULTURE_BASE}/melukat-purification-ceremony`,
        inScope: true,
      },
    ],
  },
  {
    name: "Complimentary Morning Walk",
    images: [`${UPLOADS}/2024/11/DJI_0119-Edit-min-1.jpg`],
    description:
      "Every day from 07.00 AM. “An early morning walk is a blessing for the whole day? -Henry David Thoreau. Start your awesome day by morning walking to the silungan village; it will be a good exercise and worth experience.",
    ctas: [
      {
        label: "Details",
        href: `${CULTURE_BASE}/rice-field-walk`,
        inScope: true,
      },
    ],
  },
  {
    name: "Daily Authentic Balinese Class",
    images: [`${UPLOADS}/2023/05/IS_06654-min.webp`],
    description:
      "Every day from 03.00 PM Instead of just giving information in the picture, nyuh bali presents a wealth of activities that reflect the heritage traditions of a Balinese village. We invite you to experience how becoming a Balinese.",
    ctas: [
      {
        label: "Details",
        href: `${CULTURE_BASE}/balinese-class`,
        inScope: true,
      },
    ],
  },
];
