// Content for src/app/seminyak/villa/honeymoon/packages/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";
import type { Testimonial } from "@/data/testimonials";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/03/seminyak-slider.webp`,
];

// The complimentary inclusions that close every Seminyak package verbatim.
// Kept local to this page — Seminyak's list differs from Ubud's (no yoga,
// no rice-field walk, no home gym), so the two can't share one constant.
export const ALWAYS_INCLUDED = [
  "Daily a la carte breakfast",
  "One-time upgrade to floating breakfast",
  "Daily afternoon tea",
  "Welcome drink upon arrival",
  "Shuttle service to Seminyak area",
  "24 hours butler service and security",
  "WIFI access",
  "Daily housekeeping and turndown service",
];

export const romanticPackages = (bookingHref: string): PackageItem[] => [
  {
    name: "Dreamy Honeymoon Package",
    // The package's own photograph. The live page reuses the header image here;
    // no picture may appear twice on a page, and the header keeps the live one.
    images: [`${UPLOADS}/2022/12/Dreamy-Honeymoon-Package.jpeg`],
    description:
      "After the exciting yet tiring wedding day, now is the time to arrange the first romantic holiday as husband and wife to deepen the romantic feelings. Indulge your partner in a perfect honeymoon in Seminyak Bali and show your everlasting commitment.",
    benefits: [
      "Airport pick up by private car",
      "One time 60 mins Balinese Massage for couple",
      "Romantic candlelight dinner",
      "Honeymoon set up upon arrival",
      "One-time use of floaties",
      "Nyuh Bali's signature honeymoon gift",
      "One-time photo session with professional photographer included one digital photo",
      "Our always complimentary inclusions",
      ...ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: bookingHref, external: true }],
  },
  {
    name: "Sweet Celebration Package",
    images: [`${UPLOADS}/2023/03/sweet-celebration.webp`],
    description:
      "Surprise your love once in a while because action speaks louder than your words. Reignite the joy of love and let your partner know how they are meant to you. This package is definitely perfect to celebrate birthday or anniversary in Bali for everlasting memories.",
    benefits: [
      "Airport pick up by private car",
      "One time romantic birthday dinner",
      "60 Mins Balinese Massage for two",
      "Romantic surprise on the bed including balloons",
      "One-time photo session with a professional photographer included one digital photo",
      "Nyuh Bali's signature birthday gift",
      ...ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: bookingHref, external: true }],
  },
  {
    name: "Stress-Free Proposal Package",
    images: [`${UPLOADS}/2023/01/stress-free-proposal-package.webp`],
    description:
      "You have found the girl, so the most challenging part is over. Planning with all details might be complicated, hence we create a stress-free proposal package in Seminyak to ensure you have everything you need at the moment once in a lifetime. All you have to do is say those four little words.",
    benefits: [
      "Airport pick up by private car",
      "One-time candlelight dinner",
      "Flower pool with the wording “Will You Marry Me?”",
      "Active speaker (song can be customized)",
      "Proposal scenario arrangement",
      "Romantic set up on the bed (on the proposal night)",
      "Hand bouquet flower",
      "Nyuh Bali Signature Engagement Gift",
      "One-time photo session with a professional photographer included one digital photo",
      ...ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: bookingHref, external: true }],
  },
  {
    name: "Balinese Culture Hideaway",
    images: [`${UPLOADS}/2023/03/seminyak-bbq.webp`],
    description:
      "“Culture is the widening of the mind and of the spirit” -Jawaharlal Nehru. Be inspired more in your Bali vacation by experiencing the local culture and appreciating the island's beauty.",
    benefits: [
      "Airport pick up by private car",
      "Balinese BBQ dinner for two with Balinese decoration",
      "Balinese attire for couple during dinner",
      "Handcrafted Balinese flower bath",
      "Half-day travelling ( 5 hours)",
      "One-time photo session with a professional photographer included one digital photo",
      ...ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: bookingHref, external: true }],
  },
];

// This page's own quote set, different from the Seminyak About page's — hence
// declared here rather than in data/testimonials.ts.
export const GUEST_QUOTES: Testimonial[] = [
  {
    quote:
      "I cannot thank the staff at Nyuh Bali for making our honeymoon so amazing. I can cannot explain how amazing the staff were. Customer service was unreal from every member of staff and nothing was too much effort for them. They are a credit to the villa and made our stay that extra bit special.",
    author: "Chris Morgan, Tripadvisor",
  },
  {
    quote:
      "A great Honeymoon experience!. Me and my partner cannot thank the staff at Nyuh Bali Villas enough. Such gratitude, warmth and kindness from all of them. This has been our best holiday ever",
    author: "Didar U, Tripadvisor",
  },
  {
    quote:
      "My wife and I had the most amazing stay at the Nyuh Bali villas for our honeymoon. The staff were just the most lovely, friendly, and helpful, that we've experienced anywhere.. Thank you all at the Nyuh Bali for making our stay such a pleasant experience, and formaking our holiday one that we'll never forget!",
    author: "Christopher Hill, Tripadvisor",
  },
];
