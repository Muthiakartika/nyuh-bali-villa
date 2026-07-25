// ======================================================
// Route Information
// Original WordPress URL:
// /complimentary-services/   (WP page ID 120111, "Complimentary Services")
//
// Current Next.js Route:
// src/app/complimentary-services/page.tsx
//
// Catatan slug: URL ini TIDAK berada di bawah /ubud meskipun isinya khusus
// Ubud — sama seperti /terms-conditions dan /privacy-policy, halaman ini
// top-level di WordPress. Chrome (header/footer) memakai PROPERTY_SITES.ubud
// karena hanya menu Ubud yang menautkannya.
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/complimentary-services/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Services")
// - internal links: belum ada halaman lain yang menaut ke sini
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
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

export const metadata: Metadata = {
  title: "Complimentary Services - Ubud Nyuh Bali Resort",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2026/01/IMG_2301-1-min.jpg`];

// Every entry is complimentary for in-house guests, so none of them carries a
// booking CTA — the live page links each one through to its detail page, all
// of which are outside this project's scope and therefore inert.
const SERVICES: PackageItem[] = [
  {
    name: "Shuttle Service to and from Ubud Center",
    images: [`${UPLOADS}/2026/01/IMG_2301-1-min.jpg`],
    description:
      "Embrace the serenity of peaceful living in a quieter village in Ubud while having easy access to Ubud Center. The shuttle is provided every two hours for your peace of mind from 09.00-22.00 (last pick up).",
  },
  {
    name: "Daily Morning Yoga Class",
    images: [`${UPLOADS}/2024/11/IMG_9148-Edit-min.jpg.webp`],
    description:
      "Gift yourself a relaxing yoga flow that will re-energize and wake up your entire body. Our yoga class is designed to be suitable for everyone from beginners to intermediate, no matter your fitness level. You will be guided step by step with our certified yoga teacher to do yoga pose in the correct alignment. And not only that, we also will help you to create a deeper connection between the breath and the movement. Available daily as complimentary exclusively for our in-house guests.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/wellness/yoga",
        inScope: true,
      },
    ],
  },
  {
    name: "Sound Healing",
    images: [`${UPLOADS}/2023/05/AW_06640-min-Copy.jpg.webp`],
    description:
      "Learn to let go is the key of happiness; - Buddha. Join our sound healing session to relax your mind and appreciate the present moment to achieve mental peace and tranquillity. Our healing practitioner uses different sound vibrations to help unblock the unexpressed emotion and let go of the negative energy. Available every Thursday, Saturday, and Sunday as complimentary exclusively for our in-house guests.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/wellness/sound-healing",
        inScope: true,
      },
    ],
  },
  {
    name: "Breathwork",
    images: [`${UPLOADS}/2023/05/TD004090-min.webp`],
    description:
      "How we breathe describes how we live. Breathwork exercise using various breathing techniques to relieve anxiety and reduce stress in your body. It also provides an opportunity for stored negative emotions to surface and be released as we exhale. It is also known as a more accessible alternative of meditation to achieve inner peace and better life quality. Available every Tueday & Friday as complimentary exclusively for our in-house guests.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/wellness/breathwork",
        inScope: true,
      },
    ],
  },
  {
    name: "Body Tone Flow",
    images: [`${UPLOADS}/2023/05/AW_06570-min-3.jpg.webp`],
    description:
      "Experience an energizing workout that targets your entire body using your own body weight as the primary resistance. These flowing exercises are ideal for everyone, regardless of fitness level. This practice helps enhance core strength, tone your body, and boost your confidence. Available every Monday & Wednesday",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/wellness/body-tone-flow",
        inScope: true,
      },
    ],
  },
  {
    name: "Daily Authentic Balinese Class",
    images: [`${UPLOADS}/2023/05/IS_06754-min-e1684398165817.webp`],
    description:
      "Nyuh Bali offers a rich array of activities that immerse you in Balinese culture. Discover the secrets of crafting sambal matah, a traditional Balinese seasoning. Learn the ancient art of preparing loloh, a time-honored Balinese herbal drink, or embrace Balinese traditions by creating offerings used in gratitude rituals.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/balinese-culture/balinese-class",
        inScope: true,
      },
    ],
  },
  {
    name: "Daily Guided Morning Walk",
    images: [`${UPLOADS}/2024/11/DJI_0119-Edit-min.jpg.webp`],
    description:
      "Start your awesome day by morning walking to the silungan village; it will be a good exercise and worth experience. You can inhale pure oxygen, enjoy rice field view and many of coconut (nyuh) trees. We invite you to see the other side of Bali, how locals live from your own perspective. You will learn and observe how rice is made as most of the farmer still do traditional ways in farming.",
    ctas: [
      {
        label: "Explore More",
        href: "/ubud/balinese-culture/rice-field-walk",
        inScope: true,
      },
    ],
  },
  {
    name: "Balinese Rindik Performance",
    images: [`${UPLOADS}/2025/07/Rindik-2-1.jpg`],
    description:
      "Immerse yourself in the calming sounds of Balinese Rindik and bamboo flute, performed live every Tuesday by local villagers. Rindik, a traditional Balinese bamboo xylophone, blends beautifully with the soft notes of the flute to create a soothing atmosphere that reflects the island’s harmony and grace. This experience is complimentary for guests dining at Lumbini Restaurant.",
  },
  {
    name: "Access to our Home Gym",
    images: [`${UPLOADS}/2024/12/DW_03575-min-min.jpg.webp`],
    description:
      "Here at Nyuh Bali, we understand your regular workout cannot be put on standby just because you are away from home. We have created a home gym to keep you in shape during the holiday. Enjoy complimentary unlimited access to our fitness center that features a spectrum of weight and state of the art machinery such as treadmill, multi gym station, cross trainer, exercise bike, abs training bench, pilates ball, yoga matt and also some weights.",
    ctas: [{ label: "Explore More", href: "/ubud/fitness" }],
  },
  {
    name: "Free Afternoon Tea",
    images: [`${UPLOADS}/2026/01/Afternoon-tea-1.jpg`],
    description:
      "Enjoy a complimentary afternoon tea, specially prepared for our in-house guests. Each day features a selection of freshly made, traditional Balinese snacks that change daily, offering a delightful taste of local flavors in the Lumbini Restaurant.",
  },
];

/** Complimentary Services — the Ubud menu's "Services" entry. Ten
 * complimentary experiences rendered through the shared `PackageList`. */
export default function ComplimentaryServicesPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/complimentary-services" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Complimentary services at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Complimentary Services"
        />

        <PackageList
          eyebrow="Services"
          heading="Complimentary Services"
          intro="More than a stay, we invite you to enjoy truly Ubud experience. We curate authentic Balinese activities and wellness classes to help you relax and create an unforgettable, meaningful stay. This is your retreat to slow down, unwind, and reconnect — a sanctuary away from the demands of everyday life."
          packages={SERVICES}
          tone="sand"
        />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
