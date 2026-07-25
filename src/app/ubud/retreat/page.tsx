// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/retreat/           (WP page ID 118401, "Ubud - Retreat")
//
// Current Next.js Route:
// src/app/ubud/retreat/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/retreat/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Retreat")
// - internal links: belum ada halaman lain yang menaut ke sini secara internal
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman anak (belum dibuat, CTA "Explore More" karenanya inert):
// /ubud/retreat/luxury, /ubud/retreat/host-your-own, /ubud/wellness
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
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";

export const metadata: Metadata = {
  title: "Luxury Retreat in Ubud - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2023/04/Photo-15-01-23-14.18.24-1-min.jpg`];

// The live page is three programmes, each a photograph, a pitch and an
// EXPLORE MORE link. All three destinations are now built here, and they are
// the same three entries the header's Retreat dropdown carries.
const RETREAT_PROGRAMS: PackageItem[] = [
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
    images: [`${UPLOADS}/2023/05/AW_06640-min-Copy.jpg`],
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
    images: [`${UPLOADS}/2023/05/TD004090-min-Copy.jpg`],
    description:
      "Whether you wish to heal your trauma, rejuvenate, or just relax, Ubud has something for everyone. Discover our Ubud luxury wellness and retreat facilities to provide a wide range of opportunities for you to find your inner peace",
    ctas: [{ label: "Explore More", href: "/ubud/wellness", inScope: true }],
  },
];

/**
 * Ubud — Retreat. A short page: hero, the three programmes, awards base. It
 * reuses `PackageList` rather than introducing a separate "retreat" component
 * — a programme here is the same shape as a package (photographs, a pitch, one
 * action), it simply has no benefits list.
 */
export default function UbudRetreatPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Luxury wellness retreat at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Retreat"
        />
        <BookingSearchBar bookingHref={site.bookingHref} />

        <PackageList
          eyebrow="Retreat"
          heading="Personalised Luxury Retreat"
          packages={RETREAT_PROGRAMS}
          tone="sand"
        />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
