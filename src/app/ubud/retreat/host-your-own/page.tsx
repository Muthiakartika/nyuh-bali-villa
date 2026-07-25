// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/retreat/host-your-own/   (WP page ID 118348, "Ubud - Host Your Own Retreat")
//
// Current Next.js Route:
// src/app/ubud/retreat/host-your-own/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/retreat/host-your-own/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   (submenu "Retreat" -> "Host Your Retreat")
// - internal links: src/app/ubud/retreat/page.tsx (kartu "Host your Retreat")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: CTA "Personalize your Retreat" menaut ke
// /ubud-personalize-your-retreat (form panjang 7 bagian), yang kini sudah
// dibuat di src/app/ubud-personalize-your-retreat/page.tsx.
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
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";

export const metadata: Metadata = {
  title: "Host your Retreat in Ubud - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2023/05/AW_06570-min-2.jpg`];

const RETREAT_EMAIL = "retreat@ubudnyuhbali.com";

const INTRO: PackageItem[] = [
  {
    name: "Why Host your Retreat with us?",
    images: [
      `${UPLOADS}/2023/05/AW_06640-min.webp`,
      `${UPLOADS}/2023/04/bg-retreat.webp`,
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

const MEALS: PackageItem[] = [
  {
    name: "Healthy Meals",
    images: [`${UPLOADS}/2023/03/ubud-dining-1.webp`],
    description:
      "Just like you, we agree that luxury retreats should provide both healthy and tasty food. Here at Nyuh Bali, we believe that good food should come from fresh ingredients with respect to nature. All meals are healthy and delicious and are served in our healthy dining restaurant, The Retreat. We provide a variety of cuisine options, including Balinese, western, vegan, vegetarian, gluten-free, and Mediterranean.",
  },
  {
    name: "Retreat Specialist",
    images: [`${UPLOADS}/2023/05/AW_06570-min.jpg`],
    description:
      "We are dedicated to supporting your retreat in many ways for a memorable experience for you and your students. Just tell us anything in your mind, and we will explore all possibilities.",
    benefitsHeading: "Some options that could be added to your program",
    benefits: [
      "Healthy Balinese Cooking Class (vegan's also possible)",
      "Movie Night & Special Events",
      "Island Excursions — from cultural tours to adventurous activities like mount trekking, rafting, and ATV riding",
      "Printing Service — retreat materials and amenities like books, t-shirts, and goodie bag",
      "Photography Service",
    ],
  },
];

/**
 * Ubud — Host Your Retreat (the Retreat dropdown's second entry).
 *
 * Three existing components carry the whole page: the six selling points are
 * icon+label pairs (`AmenityGrid`), the accommodation and facility line-ups
 * are photo tiles (`LinkCardGrid`, whose cards are already inert by default
 * since the detail pages aren't built), and the prose blocks are
 * `PackageList` items.
 */
export default function UbudHostYourRetreatPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat/host-your-own" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Host your own retreat at Ubud Nyuh Bali Resort"
          eyebrow="Retreat"
          title="Host your Retreat in Ubud"
        />

        <PackageList
          eyebrow="Host Your Retreat"
          heading="Why Host your Retreat with us?"
          packages={INTRO}
          tone="sand"
        />

        <AmenityGrid
          heading="What we provide"
          tone="sand-deep"
          amenities={[
            {
              icon: "spa",
              title: "Facilities",
              subtitle:
                "Two spacious yoga shala, two swimming pools, spa, home gym & meditation garden",
            },
            {
              icon: "yoga",
              title: "Equipment",
              subtitle:
                "Yoga mats, towels, straps, blocks, meditation cushion, projector, screen, speaker, whiteboard, and microphone",
            },
            {
              icon: "class",
              title: "Exclusivity",
              subtitle:
                "Dedicated space for dining, Exclusive use of Indoor Yoga Shala (11.00 - 22.00), Roof Top Yoga Shala (06.00 - 16.00)",
            },
            {
              icon: "romance",
              title: "SPA Perks",
              subtitle:
                "Highly trained therapists deliver high-quality treatments. Get discounted treatments for all students.",
            },
            {
              icon: "service",
              title: "Support for Retreat Leader",
              subtitle:
                "Discounted accommodation & meals for the retreat leader. Free listing of your event on our website & social media",
            },
            {
              icon: "gym",
              title: "Free Daily Activities",
              subtitle:
                "Daily morning walks, yoga class, Balinese activities, and wellness activities like sound healing & breathwork",
            },
          ]}
        />

        <LinkCardGrid
          heading="Luxurious Accomodation to choose from"
          columns={3}
          tone="sand"
          items={[
            {
              label: "Suite",
              href: "/ubud/villa/suite",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/03/Suite-6.webp`,
            },
            {
              label: "Luxury Suite",
              href: "/ubud/villa/honeymoon/pool",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/03/Honeymoon-Suite-3.webp`,
            },
            {
              label: "One Bedroom Deluxe Pool Villa",
              href: "/ubud/villa",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa.webp`,
            },
          ]}
        />

        <LinkCardGrid
          heading="Wellness Facilities"
          columns={3}
          tone="sand-deep"
          items={[
            {
              label: "Mahamaya Spa",
              href: "/ubud/spa",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/03/ubudspa.webp`,
            },
            {
              label: "Home Gym",
              href: "/ubud/fitness",
              inScope: true,
              imgSrc: `${UPLOADS}/2024/12/DW_03571-min-min.jpg`,
            },
            {
              label: "Indoor Yoga Shala",
              href: "/ubud/villa/1-bedroom-pool-deluxe",
              inScope: true,
              imgSrc: `${UPLOADS}/2024/11/IMG_9148-Edit-min-1.jpg`,
            },
            {
              label: "Rooftop Yoga Shala",
              href: "/ubud/villa/1-bedroom-pool-royal",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/05/AW_06640-min.webp`,
            },
            {
              label: "Meditation Garden",
              href: "/ubud/villa/honeymoon/pool",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/05/IS_06578-min.webp`,
            },
            {
              label: "Wellness Library",
              href: "/ubud/villa/2-bedroom-pool",
              inScope: true,
              imgSrc: `${UPLOADS}/2023/05/IS_06972-min.webp`,
            },
          ]}
        />

        <PackageList heading="Healthy Meals" packages={MEALS} tone="sand" />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
