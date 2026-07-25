// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/villa/honeymoon/packages/   (WP page ID 21, "Seminyak - Offers")
//
// Current Next.js Route:
// src/app/seminyak/villa/honeymoon/packages/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/villa/honeymoon/packages/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("Offers")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid
//   "Plan your Romantic Gateaway" — keempat kartunya menaut ke halaman ini),
//   src/components/property/PropertyFooter.tsx (menu "offers")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import {
  PackageList,
  type PackageItem,
} from "@/components/property/PackageList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import type { Testimonial } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Romantic Package in Seminyak - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/seminyak-slider.webp`,
  `${UPLOADS}/2023/03/sweet-celebration.webp`,
];

// The complimentary inclusions that close every Seminyak package verbatim.
// Kept local to this page — Seminyak's list differs from Ubud's (no yoga,
// no rice-field walk, no home gym), so the two can't share one constant.
const ALWAYS_INCLUDED = [
  "Daily a la carte breakfast",
  "One-time upgrade to floating breakfast",
  "Daily afternoon tea",
  "Welcome drink upon arrival",
  "Shuttle service to Seminyak area",
  "24 hours butler service and security",
  "WIFI access",
  "Daily housekeeping and turndown service",
];

const ROMANTIC_PACKAGES: PackageItem[] = [
  {
    name: "Dreamy Honeymoon Package",
    images: [`${UPLOADS}/2023/03/seminyak-slider.webp`],
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
    ctas: [{ label: "Book Now", href: site.bookingHref, external: true }],
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
    ctas: [{ label: "Book Now", href: site.bookingHref, external: true }],
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
    ctas: [{ label: "Book Now", href: site.bookingHref, external: true }],
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
    ctas: [{ label: "Book Now", href: site.bookingHref, external: true }],
  },
];

// This page's own quote set, different from the Seminyak About page's — hence
// declared here rather than in data/testimonials.ts.
const GUEST_QUOTES: Testimonial[] = [
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

/**
 * Seminyak — Offers. Four romantic packages then the guest quotes, matching
 * the live page's order. Uses the same `PackageList` as the Ubud offers pages.
 */
export default function SeminyakHoneymoonPackagesPage() {
  return (
    <>
      <PropertyHeader
        site={site}
        activeHref="/seminyak/villa/honeymoon/packages"
      />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Romantic packages at Nyuh Bali Villas Seminyak"
          eyebrow="Offers"
          title="Romantic Package in Seminyak"
        />
        <BookingSearchBar bookingHref={site.bookingHref} />

        <PackageList
          eyebrow="Offers"
          heading="Romantic Package in Seminyak"
          packages={ROMANTIC_PACKAGES}
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
