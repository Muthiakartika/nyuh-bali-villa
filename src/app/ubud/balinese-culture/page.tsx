// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/balinese-culture/    (WP page ID 287, "Ubud - Experience")
//
// Current Next.js Route:
// src/app/ubud/balinese-culture/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/balinese-culture/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Culture")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "DISCOVER" -> kartu
//   "Experience")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman detail aktivitas (belum dibuat, tombol DETAILS karenanya inert):
// /ubud/balinese-culture/melukat-purification-ceremony,
// /ubud/balinese-culture/rice-field-walk, /ubud/balinese-culture/balinese-class
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
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud/balinese-culture");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";
const CULTURE_BASE = "/ubud/balinese-culture";

const HERO_IMAGES = [`${UPLOADS}/2024/11/DJI_0119-Edit-min-1.jpg`];

const ACTIVITIES: PackageItem[] = [
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

/** Ubud — Culture (titled "Experience" in WordPress). Five cultural
 * activities rendered through the shared `PackageList`. */
export default function UbudCulturePage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/balinese-culture" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Authentic Balinese activities at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Authentic Balinese Activity"
        />

        <PackageList
          eyebrow="Culture"
          heading="Authentic Balinese Activity"
          packages={ACTIVITIES}
          tone="sand"
        />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
