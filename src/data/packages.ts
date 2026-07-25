// Package content that genuinely appears on more than one page, kept here for
// the same reason testimonials.ts and legal.ts exist: it is long, and it is
// needed by specific pages rather than by every page's chrome.
//
// The Ubud romance packages below are published twice on the live site — once
// under the Offers page's "Romance" tab (/ubud/packages) and once as the whole
// of the Romance page (/ubud/villa/honeymoon/packages) — with identical copy.
// Declaring them once means a wording change lands on both routes.
//
// Files that consume this:
//   src/app/ubud/packages/page.tsx
//   src/app/ubud/villa/honeymoon/packages/page.tsx

import type { PackageItem } from "@/components/property/PackageList";
import type { Testimonial } from "@/data/testimonials";
import { PROPERTY_SITES } from "@/data/properties";

const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";
const BOOKING_HREF = PROPERTY_SITES.ubud.bookingHref;

/**
 * The complimentary inclusions that close all three Ubud romance packages
 * verbatim. Spread into each package's own benefits so the three lists can't
 * drift apart.
 */
const UBUD_ALWAYS_INCLUDED = [
  "Daily a la carte breakfast served in your villa or Lumbini restaurant",
  "One-time upgrade to floating breakfast",
  "Daily afternoon tea at Lumbini Restaurant",
  "Daily Authentic Balinese Class",
  "Daily yoga class",
  "Daily morning walk to the rice field",
  "Welcome drink upon arrival",
  "Complimentary use of bicycles",
  "Shuttle service to Ubud center with scheduled time",
  "24 hours butler service and security",
  "WIFI access",
  "Daily housekeeping and turndown service",
  "Complimentary access to our home gym",
];

export const UBUD_ROMANCE_PACKAGES: PackageItem[] = [
  {
    name: "Honeymoon Getaway Package",
    images: [`${UPLOADS}/2023/03/honeymoon-ubud.webp`],
    description:
      "After the exciting yet tiring wedding day, now is the time to arrange the first romantic holiday as husband and wife to deepen the romantic feelings. Indulge your partner in a perfect honeymoon in Ubud Bali and show your everlasting commitment.",
    benefits: [
      "One-way airport transfer*",
      "One-time romantic candlelight dinner",
      "One time 60 minutes relaxing massage for a couple",
      "Honeymoon gift from the resort",
      "Honeymoon set up upon arrival",
      "One-time couple photo session with a professional photographer included one digital photo.",
      ...UBUD_ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: BOOKING_HREF, external: true }],
  },
  {
    name: "Stress-Free Proposal Package",
    images: [
      `${UPLOADS}/2024/11/011A0124-Edit-min-min-min-1.jpg`,
      `${UPLOADS}/2023/03/ubud-dining-2.webp`,
    ],
    description:
      "You have found the girl, so the most challenging part is over. Planning with all details might be complicated, hence we create a stress-free proposal package in Ubud to ensure you have everything you need at the moment once in a lifetime. All you have to do is say those four little words.",
    benefits: [
      "One way airport transfer*",
      "60 mins Balinese Massage for the couple",
      "One-time Luxury candlelight dinner for couple at our Wedding Venue",
      "Flower wording on the venue “Will you Marry Me?”",
      "Proposal arrangement including butler service and speaker with your selected songs",
      "Romantic bed decoration on the proposal night",
      "One-time couple photo session with a professional photographer included one digital photo",
      "Engagement gift from Nyuh Bali",
      ...UBUD_ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: BOOKING_HREF, external: true }],
  },
  {
    name: "Eat, Pray, and Love",
    images: [
      `${UPLOADS}/2024/11/IMG_8918-Edit-min-1.jpg`,
      `${UPLOADS}/2023/03/eat-pray-love.webp`,
    ],
    description:
      "The expert said that happy couples make it a habit to refocus to love deeper with each other. Experience the Balinese healing journey in Ubud inspired by Eat Pray Love movie to discover your inner peace. Unwind from the hustle-bustle of your routine and level up the bonding with your love.",
    benefits: [
      "One-way airport transfer*",
      "Balinese Purification Ceremony with the bathing ritual",
      "One time 60 mins relaxing Balinese massage for two persons",
      "One-time Romantic Candle Light Dinner for two persons",
      "Romantic set up upon arrival",
      "Nightly Inspiration Cards with turndown service",
      ...UBUD_ALWAYS_INCLUDED,
    ],
    ctas: [{ label: "Book Now", href: BOOKING_HREF, external: true }],
  },
];

/**
 * The "What our guests are saying" set shared by the Ubud Offers and Romance
 * pages. Different from the About page's carousel in data/testimonials.ts,
 * which is why it isn't merged into that file.
 */
export const UBUD_OFFER_QUOTES: Testimonial[] = [
  {
    quote:
      "Through many days of correspondence we managed to formulate a plan to surprise my girlfriend with the help of resort staff .The stay was exemplary with top level comfort, extremely attentive staff and delicious food. We were extremely pleased with our stay and the overall experience. My girlfriend was so impressed that she promised to visit during our anniversary every year.",
    author: "Kai, Tripadvisor",
  },
  {
    quote:
      "A Trip to Remember. Thank you Ubud Nyuh for making my wedding proposal memorable. She said, 'Yes!'",
    author: "Young Lifestyle T, Tripadvisor",
  },
  {
    quote:
      "The most wonderful retreat. Honestly cannot rave about this place enough. The spa is amazing, offering great balinese massages. Overall 10/10!!",
    author: "Anisa, Tripadvisor",
  },
  {
    quote:
      "Everything was 5 star. It is a perfect place for the retreat, located in the quite place. The resort is worth every penny. We already have planned to come back again next year",
    author: "jameshpkn99, Tripadvisor",
  },
];
