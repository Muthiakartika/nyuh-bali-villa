// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/spa/           (WP page ID 142, "Seminyak - SPA")
//
// Current Next.js Route:
// src/app/seminyak/spa/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/spa/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("SPA")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Discover" ->
//   kartu "SPA")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: setiap "Book Now" menaut ke /spa-reservation-seminyak/ (WP page ID
// 144) yang BELUM dibuat di project ini, sehingga masih menunjuk ke situs live.
// Jika halaman reservasi spa dibuat, ganti SPA_RESERVATION_HREF di bawah.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  TreatmentList,
  type TreatmentCategory,
} from "@/components/property/TreatmentList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import type { Testimonial } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Romantic Spa Experience in Seminyak - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const SPA_RESERVATION_HREF = "/spa-reservation-seminyak";

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/Seminyak-Spa-2.webp`,
  `${UPLOADS}/2023/03/Seminyak-Spa-3.webp`,
  `${UPLOADS}/2023/03/Seminyak-Spa-4.webp`,
];

// The live page groups its menu under three tabs; each tab has its own
// photograph, kept here as the category image.
const TREATMENTS: TreatmentCategory[] = [
  {
    name: "MASSAGE",
    image: `${UPLOADS}/2023/02/Spa-seminyak-massage-1.jpg`,
    treatments: [
      {
        name: "Relaxing Balinese Massage",
        options: [
          {
            label: "60 minutes | IDR 390.000++",
            href: SPA_RESERVATION_HREF,
          },
          {
            label: "90 minutes | IDR 550.000++",
            href: SPA_RESERVATION_HREF,
          },
        ],
        description:
          "This traditional Balinese Massage is a combination of long strokes, palm press, thumb press, and gentle stretching. Using a high-quality mixture of coconut, soybean, and sweet almond oil, it will relieve the strained muscle as well as evoke a sense of relaxation",
      },
      {
        name: "Warm Stone Massage",
        options: [
          {
            label: "90 minutes | IDR 590.000++",
            href: SPA_RESERVATION_HREF,
          },
        ],
        description:
          "Instead of just gliding of heated stone lightly upon the surface of the skin, your trained therapist will use the stones as tools to deliver muscle and tissue massage, with the pressure based on your preference. It is effective to remove the tension and improve the blood circulation",
      },
    ],
  },
  {
    name: "SELF INDULGENCE",
    image: `${UPLOADS}/2023/02/SPA-Seminyak-Indulgence-1.jpg`,
    treatments: [
      {
        name: "Nyuh Bali Holistic Body Treatment",
        options: [
          {
            label: "100 minutes | IDR 640.000++",
            href: SPA_RESERVATION_HREF,
          },
        ],
        description:
          "Balinese Massage - Body Scrub - Shower. A ritual treatment to release your muscle aches and to remove the dead skin gently. Using the gentle salt’s scrub, they will remove the impurities while moisturizing the skin. Exfoliate your skin and let it shine",
      },
      {
        name: "Cleopatra's Rose Ritual",
        options: [
          {
            label: "120 minutes | IDR 850.000++",
            href: SPA_RESERVATION_HREF,
          },
        ],
        description:
          "Balinese Massage - Body Scrub - Cleopatra's Milk Bath with Rose Petals. After the tiring days, it's time to relax. You deserve a break. In the end, pamper your self with Cleopatra's milk bath that will moisturize your skin while spoiling your soul & mind",
      },
    ],
  },
  {
    name: "COUPLE",
    image: `${UPLOADS}/2023/02/Spa-Seminyak-Couple-1.jpg`,
    treatments: [
      {
        name: "Romantic Getaway Package",
        options: [
          {
            label: "90 minutes | IDR 950.000++",
            href: SPA_RESERVATION_HREF,
          },
        ],
        description:
          "Balinese Massage - Bubble Bath with Rose Petals. A perfect choice for the busy couples who would like to gift themselves",
      },
      {
        name: "Honeymoon Enjoyment Package",
        options: [
          {
            label: "120 minutes | IDR 1.350.000++",
            href: SPA_RESERVATION_HREF,
          },
        ],
        description:
          "Balinese Massage - Body Scrub - Exotic Flower Bath. Who does not love the flower? This luxury package will give you a true spa experience by discovering the uniqueness of relaxation in the romantic ambiance. Feel free to choose your own flower bath's design",
      },
    ],
  },
];

const GUEST_QUOTES: Testimonial[] = [
  {
    quote:
      "The spa... REJUVENATING!!! That milk bath was amazing. I can't remember much about the massage but it must have been great because I instantly went to sleep and felt great after",
    author: "Prezzie C, USA",
  },
  {
    quote: "The spa is superb! Don't leave without trying it.",
    author: "Matt T, Australia",
  },
  {
    quote:
      "The spa treatment I received was so relaxing that I would do it every day if I could!",
    author: "Michelle C, Australia",
  },
];

/**
 * Seminyak — SPA. Hero, the treatment menu grouped as on the live page, then
 * the guest quotes. No booking widget: the live page's action is a spa
 * reservation, not a room-night search.
 */
export default function SeminyakSpaPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/spa" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Spa at Nyuh Bali Villas Seminyak"
          eyebrow="Seminyak"
          title="Romantic Spa Experience"
        />

        <TreatmentList
          eyebrow="SPA"
          heading="Romantic Spa Experience in Seminyak"
          intro="Indulge yourself at Spa of Nyuh Bali Villas with a collection of delightful spa treatments that will pamper the body and nurture the senses amid your leisure on the island. With the ideal combination of traditional ingredients and modern therapy, each spa experience will leave you with inner radiance and blissful joy. Why not immerse yourself in one of our spa treatments? Simply pick one of the treatments, relax and enjoy it. Hopefully, when you're going back home you'll get refreshed and be in a prime condition. So, spending holidays never discourages your vivacity."
          notes={[
            "Opening Hours: 09.00 - 17.00",
            "Enjoy 20% Discount for early booking before arrival",
          ]}
          categories={TREATMENTS}
          cta={{ label: "Reserve Now", href: SPA_RESERVATION_HREF }}
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
