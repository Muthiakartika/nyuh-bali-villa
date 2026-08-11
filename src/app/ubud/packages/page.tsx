// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/packages/          (WP page ID 44, "Ubud - Offers")
//
// Current Next.js Route:
// src/app/ubud/packages/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/packages/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Offers")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "OUR PACKAGES"),
//   src/components/property/PropertyFooter.tsx (menu "offers")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Dependency antar halaman: kartu "Intimate Wedding in Ubud" di bawah menaut ke
// /ubud/wedding (src/app/ubud/wedding/page.tsx). Jika slug wedding berubah,
// href pada WEDDING_HIGHLIGHT juga harus diperbarui.
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
import { UBUD_OFFER_QUOTES, UBUD_ROMANCE_PACKAGES } from "@/data/packages";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud/packages");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2023/03/honeymoon-ubud.webp`];

// The live page's "Retreat" filter tab. These have no benefits list — each is
// a pitch with an EXPLORE MORE link to a retreat detail page this project
// doesn't build, so the CTA renders inert (the `inScope` convention).
const RETREAT_PACKAGES: PackageItem[] = [
  {
    name: "Authentic Balinese Healing",
    images: [`${UPLOADS}/2023/04/Authentic-Balinese-Healing-1-min.jpg`],
    description:
      "Balinese people believe the principle of Sekala-Niskala that we live equally in two worlds, the seen called Sekala, and the unseen called Niskala. At Nyuh Bali, we embrace the goodness of authentic Balinese healing to cleanse the negative energy in the unseen world. Combined with these traditional therapies are holistic healing modalities like nutritious foods, yoga, and massage for life invigoration",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/retreat/luxury/balinese-healing",
        inScope: true,
      },
    ],
  },
  {
    name: "Holistic Balancing Retreat",
    images: [`${UPLOADS}/2023/03/ubudspa.webp`],
    description:
      "When was the last time you felt truly balanced? Do you always live in the fast-paced? This holistic retreat is designed to rebalance your body & mind from the stress of a modern lifestyle. During the retreat, you will experience a combination of reiki healing, private sound healing, shirodara treatment, and yoga in private sessions to address your personalized concerns. Start your balancing retreat at Ubud Nyuh Bali Resort that will allow our body to release the emotional blockage to live more mindfully",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/retreat/luxury/holistic-balancing",
        inScope: true,
      },
    ],
  },
  {
    name: "New Beginning",
    images: [`${UPLOADS}/2023/04/New-Beginning-1-min-1.jpg`],
    description:
      "When life seems doesn't favor you, most people can't stop blaming themselves and end up feeling worthless. We carefully design the comprehensive retreat to reset through encouragement and support to love yourself again. You will be guided by a certified psychologist in the intimate session to detach from what does not serve you anymore. Embrace the life change by transforming into healthy lifestyle through Balinese healthy cooking class. Experience a private yoga class to release the tension from your body, and celebrate the new beginning with a spa treatment and flower bath",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/retreat/luxury/new-beginning",
        inScope: true,
      },
    ],
  },
  {
    name: "Couple's Retreat",
    images: [`${UPLOADS}/2023/03/ubud-yoga-4.webp`],
    description:
      "Rediscover love and connection with the Couples Retreat at Ubud Nyuh Bali Resort. Indulge in romantic candlelight dinners, soothing couple massages, and picturesque floating breakfasts in your private villa pool. Immerse yourselves in the beauty of Bali with yoga, Balinese cultural experiences, and serene walks through lush rice fields. Every moment is designed to deepen your bond and create memories to treasure forever.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/retreat/couples",
        inScope: true,
      },
    ],
  },
];

// The live page's "Wedding" filter tab — a single entry whose EXPLORE MORE
// points at /ubud/wedding, which this project DOES build, so it is a real
// internal link.
const WEDDING_HIGHLIGHT: PackageItem[] = [
  {
    name: "Intimate Wedding in Ubud",
    images: [
      `${UPLOADS}/2024/11/AW_00192-min.jpg`,
      `${UPLOADS}/2023/02/Ubud-intimate-wedding-4.jpg`,
    ],
    description:
      "Exchange the vows in Ubud Bali, the unforgettable moment you will be cherished for many years to come. Whether you dream of balinese wedding or classic international wedding, our experienced team are available to handcraft your big day and to prepare every single detail. From the blessing ceremony to find the right decoration and arranging musical performance on your big day, your wedding day will be effortlessly planned to fulfill your dream. Because at Ubud Nyuh Bali Resort, we believe every couple deserves the very best wedding moment, stress and worry free. Let us help you to prepare your once in a life moment.",
    ctas: [{ label: "Explore More", href: "/ubud/wedding", inScope: true }],
  },
];

/**
 * Ubud — Offers. The live page filters one long list with All / Romance /
 * Retreat / Wedding tabs. Those tabs are reproduced here as three headed
 * sections in the same order instead of as a JavaScript filter: the content
 * is identical either way, every package stays reachable without interaction,
 * and it keeps the whole page a Server Component.
 */
export default function UbudPackagesPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/packages" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Romance and retreat packages at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Offers"
        />
        <BookingSearchBar bookingHref={site.bookingHref} />

        <PackageList
          eyebrow="Offers"
          heading="Romance"
          intro="Luxury Suite & Villa in Ubud"
          packages={UBUD_ROMANCE_PACKAGES}
          tone="sand"
        />

        <PackageList
          heading="Retreat"
          packages={RETREAT_PACKAGES}
          tone="sand-deep"
        />

        <PackageList
          heading="Wedding"
          packages={WEDDING_HIGHLIGHT}
          tone="sand"
        />

        <TestimonialCarousel testimonials={UBUD_OFFER_QUOTES} />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
