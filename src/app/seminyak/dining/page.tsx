// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/dining/        (WP page ID 134, "Seminyak - Dining")
//
// Current Next.js Route:
// src/app/seminyak/dining/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/dining/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("Dining")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Discover" ->
//   kartu "Dining")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: tautan menu di halaman ini menunjuk ke file PDF di wp-content.
// Jika PDF dipindahkan saat migrasi, perbarui konstanta MENU_* di bawah.
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
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/seminyak/dining");

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/01/BBQ-seminyak-min-min-slider-1-_1__1.webp`,
  `${UPLOADS}/2023/03/seminyak-bbq.webp`,
];

// Menu PDFs, hosted on the WordPress uploads folder like the images.
const MENU_ALA_CARTE = `${UPLOADS}/2023/03/Nyuh-Bali-Villas-Ala-Carte-Menu.pdf`;
const MENU_BREAKFAST = `${UPLOADS}/2023/03/Breakfast-Menu-Seminyak.pdf`;
const MENU_CLD_BBQ = `${UPLOADS}/2023/03/CLD-BBQ-Menu-Seminyak.pdf`;

// Three dining venues/experiences. The first carries two menu links, which is
// why PackageList takes a `ctas` array rather than a single CTA.
const DINING: PackageItem[] = [
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

const GUEST_QUOTES: Testimonial[] = [
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

/**
 * Seminyak — Dining. The live page has no booking widget, so this one doesn't
 * carry `BookingSearchBar` either: its actions are the menu downloads.
 */
export default function SeminyakDiningPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/dining" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Dining at Nyuh Bali Villas Seminyak"
          eyebrow="Seminyak"
          title="Dining Experience"
        />

        <PackageList
          eyebrow="Dining"
          heading="Dining Experience"
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
