// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/retreat/luxury/    (WP page ID 118372, "Ubud - Personalised Luxury Retreat")
//
// Current Next.js Route:
// src/app/ubud/retreat/luxury/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/retreat/luxury/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   (submenu "Retreat" -> "Luxury Retreat")
// - internal links: src/app/ubud/retreat/page.tsx (kartu "Personalised Luxury
//   Retreat")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Program detail (belum dibuat, CTA "Explore More" karenanya inert):
// /ubud/retreat/luxury/anti-aging, /ubud/retreat/slimming,
// /ubud/retreat/luxury/balinese-healing, /ubud/retreat/luxury/holistic-balancing,
// /ubud/retreat/luxury/new-beginning, /ubud/retreat/couples
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
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud/retreat/luxury");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";
const RETREAT_BASE = "/ubud/retreat";

const HERO_IMAGES = [
  `${UPLOADS}/2023/05/IS_06578-min.webp`,
  `${UPLOADS}/2023/05/AW_06640-min.webp`,
  `${UPLOADS}/2023/05/AW_06570-min.jpg`,
];

const PROGRAMS: PackageItem[] = [
  {
    name: "Anti Aging Retreat",
    images: [`${UPLOADS}/2023/11/Untitled-design-5.jpg`],
    description:
      "The program focuses not only on the psychological effects of the goodness of Balinese healing but also on the biological effects of aging with a scientific approach. The years will just fade away as you discover the lush green gardens and tropical forest, and that’s all before the treatments have even started!",
    ctas: [
      {
        label: "Explore More",
        href: `${RETREAT_BASE}/luxury/anti-aging`,
        inScope: true,
      },
    ],
  },
  {
    name: "Holistic Scientifically Slimming Retreat",
    images: [
      `${UPLOADS}/2023/08/The-First-and-Only-Holistic-Scientifically-Based-Retreat-in-Bali-1-min-1.jpg`,
    ],
    description:
      "The First and Only Retreat Resort in Bali that combines Scientific Based Medicine and the Goodness of Balinese Healing to provide the best slimming retreat you deserve. Build the foundation for sustainable weight loss through a healthy approach to nourishing your body rather than extreme restrictions. Our retreat encompasses integrative aspects: Nutrition, Personal Training, Muscle Stimulation & Skin Tightening.",
    ctas: [
      {
        label: "Explore More",
        href: `${RETREAT_BASE}/slimming`,
        inScope: true,
      },
    ],
  },
  {
    name: "Authentic Balinese Healing",
    images: [`${UPLOADS}/2023/05/TD004090-min.webp`],
    description:
      "Balinese people believe the principle of Sekala-Niskala that we live equally in two worlds, the seen called Sekala, and the unseen called Niskala. At Nyuh Bali, we embrace the goodness of authentic Balinese healing to cleanse the negative energy in the unseen world. Combined with these traditional therapies are holistic healing modalities like nutritious foods, yoga, and massage for life invigoration",
    ctas: [
      {
        label: "Explore More",
        href: `${RETREAT_BASE}/luxury/balinese-healing`,
        inScope: true,
      },
    ],
  },
  {
    name: "Holistic Balancing Retreat",
    images: [`${UPLOADS}/2023/03/ubudspa.webp`],
    description:
      "When was the last time you felt truly balanced? Do you always live in a fast-paced? This holistic retreat is designed to rebalance your body & mind from the stress of a modern lifestyle. During the retreat, you will experience reiki healing, private sound healing, shirodara treatment, and private yoga. Start your balancing retreat to allow our body to release the emotional blockage to live more mindfully",
    ctas: [
      {
        label: "Explore More",
        href: `${RETREAT_BASE}/luxury/holistic-balancing`,
        inScope: true,
      },
    ],
  },
  {
    name: "New Beginning",
    images: [`${UPLOADS}/2023/04/New-Beginning-1-min-1.jpg`],
    description:
      "When life seems doesn't favor you, most people can't stop blaming themselves and end up feeling worthless. We design the comprehensive retreat to reset through encouragement to love yourself again. You will be guided by a certified psychologist in the intimate session to detach from what does not serve you anymore. Embrace the life change by transforming into healthy lifestyle through healthy cooking class, private yoga class, spa treatment and flower bath",
    ctas: [
      {
        label: "Explore More",
        href: `${RETREAT_BASE}/luxury/new-beginning`,
        inScope: true,
      },
    ],
  },
  {
    name: "Couple’s Retreat",
    images: [`${UPLOADS}/2023/03/ubud-yoga-4.webp`],
    description:
      "Rediscover love and connection with the Couples Retreat at Ubud Nyuh Bali Resort. Indulge in romantic candlelight dinners, soothing couple massages, and picturesque floating breakfasts in your private villa pool. Immerse yourselves in the beauty of Bali with yoga, Balinese cultural experiences, and serene walks through lush rice fields. Every moment is designed to deepen your bond and create memories to treasure forever.",
    ctas: [
      { label: "Explore More", href: `${RETREAT_BASE}/couples`, inScope: true },
    ],
  },
];

/**
 * Ubud — Luxury Retreat (the Retreat dropdown's first entry).
 *
 * The live page's three selling points (Private / Personalized / Start
 * anytime) are icon-and-label pairs, which is exactly what `AmenityGrid`
 * renders — so they reuse it rather than getting a bespoke row.
 */
export default function UbudLuxuryRetreatPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat/luxury" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Personalised luxury retreat at Ubud Nyuh Bali Resort"
          eyebrow="Retreat"
          title="Personalised Luxury Retreat in Ubud"
        />

        <PackageList
          eyebrow="Luxury Retreat"
          heading="Personalised Luxury Retreat in Ubud"
          intro="We are dedicated to creating a luxury retreat in Ubud for everyone, whether you want to heal your soul, let go, or simply just to relax. It doesn't matter what you have been; what matter is the person you are becoming. Come as you are, feel the embrace of a safe space to grow, awaken your hidden potential, and be reborn after for a new beginning. Welcome to a luxury retreat in Ubud, unlike any other."
          packages={PROGRAMS}
          tone="sand"
        />

        <AmenityGrid
          heading="Why our retreat is different"
          tone="sand-deep"
          amenities={[
            { icon: "spa", title: "Private" },
            { icon: "service", title: "Personalized" },
            { icon: "class", title: "Start anytime", subtitle: "as you wish" },
          ]}
        />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
