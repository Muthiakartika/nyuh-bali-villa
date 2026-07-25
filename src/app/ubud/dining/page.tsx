// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/dining/            (WP page ID 260, "Ubud - Dining")
//
// Current Next.js Route:
// src/app/ubud/dining/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/dining/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Dining")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "DISCOVER" -> kartu
//   "Dining"), src/app/ubud/retreat/host-your-own/page.tsx (Healthy Meals)
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: menu berupa PDF di wp-content — perbarui konstanta MENU_* jika
// file dipindahkan saat migrasi.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  PackageList,
  type PackageItem,
} from "@/components/property/PackageList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import type { Testimonial } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Lumbini Restaurant in Ubud - Dining - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const MENU_ALA_CARTE = `${UPLOADS}/2025/06/All-Day-Menu-Villa.pdf`;
const MENU_BREAKFAST = `${UPLOADS}/2023/08/Villas-Breakfast-Ubud.pdf`;
const MENU_BBQ = `${UPLOADS}/2023/06/BBQ-Ubud-020623.pdf`;
const MENU_ROMANTIC = `${UPLOADS}/2023/05/CLD-Menu-Ubud-010523.pdf`;
const MENU_CULTURAL_NIGHT = `${UPLOADS}/2025/06/Balinese-Cultural-Night.pdf`;

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/ubud-dining-1.webp`,
  `${UPLOADS}/2023/03/ubud-dining-2.webp`,
];

const DINING: PackageItem[] = [
  {
    name: "Lumbini Restaurant in Ubud",
    images: [
      `${UPLOADS}/2023/03/ubud-dining-1.webp`,
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
    images: [`${UPLOADS}/2023/03/ubud-dining-4.webp`],
    description:
      "Savour the fresh, flavourful BBQ meats with a selection of traditional Balinese or Western Delight cooked by your chef. We invite you to take pleasure in an exclusive dining experience in the privacy of your private villa.",
    ctas: [{ label: "BBQ Menu", href: MENU_BBQ, external: true }],
  },
  {
    name: "Romantic Dinner",
    images: [`${UPLOADS}/2023/03/ubud-dining-2.webp`],
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
    images: [`${UPLOADS}/2023/03/ezgif.com-gif-maker-9.webp`],
    description:
      "Greet every morning with the positive thought to welcome the beautiful sunshine. Experience the real balinese vibes by having floating breakfast in our iconic main pool or your own private pool.",
  },
];

const GUEST_QUOTES: Testimonial[] = [
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

/** Ubud — Dining. Six venues/experiences then the guest quotes, in the live
 * page's order. Reuses `PackageList`, the same component the Seminyak dining
 * page uses. */
export default function UbudDiningPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/dining" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Lumbini Restaurant at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Dining"
        />

        <PackageList
          eyebrow="Dining"
          heading="Lumbini Restaurant in Ubud"
          packages={DINING}
          tone="sand"
        />

        <TestimonialCarousel testimonials={GUEST_QUOTES} />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
