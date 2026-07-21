import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import { AboutNarrative } from "@/components/property/AboutNarrative";
import { PromoBanner } from "@/components/property/PromoBanner";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { InstagramTeaser } from "@/components/property/InstagramTeaser";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Ubud Luxury Villas - Private Villa and Suite - Book a Retreat",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// The live Ubud slider genuinely has one slide (confirmed: a single
// `[id^="slide-"]` element, reusing the homepage's Ubud photo). PropertyHero
// drops its controls and auto-advance entirely for a single image rather than
// rendering inert arrows.
const HERO_IMAGES = [`${UPLOADS}/2025/01/home-ubud-compress.webp`];

export default function UbudAboutPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud" overlay />
      <main>
        <PropertyHero images={HERO_IMAGES} alt="Nyuh Bali Villas Ubud" title="Ubud" />
        <BookingSearchBar bookingHref={site.bookingHref} />

        {/* Ubud's narrative is a single paragraph with no tagline before the
            button — unlike Seminyak's two paragraphs plus tagline. Confirmed
            directly rather than assumed symmetric. */}
        <AboutNarrative
          eyebrow="About Us"
          heading="Luxury Villas & Suite in Ubud"
          paragraphs={[
            "Inspired by the philosophy of the coconut tree, or Nyuh in the Balinese language, which is known as the versatile tree to shore up people’s lives, Ubud Nyuh Bali Resort aims to create the holistic luxury retreat experience that you look for. Presenting you with two luxury yoga shalas, five-star accommodations, two swimming pools, a spa, and a home gym, you will feel the power of positive transformation of Ubud energy. Imagine waking up while hearing the groups of birds singing, inhaling the morning breeze during guided morning walks, stretching your body with a daily yoga class, and enjoying delicious healthy foods. Calm your mind by joining daily complimentary wellness activities like breathwork & sound healing to allow yourself to relax as your well-being deserves. With an experienced team that cares for you from the heart and with the personalized touch of our luxury villas in Ubud, you will feel recharged and reborn for a new beginning.",
          ]}
          bookingHref={site.bookingHref}
          buttonLabel="Plan Now"
        />

        <PromoBanner
          promoCode="ilovenyuh"
          perks={[
            "One-way airport transfer (for booking min 3 nights at our villa)",
            "20% discount at Mahamaya SPA",
            "Upgrade to floating breakfast",
          ]}
          contactEmail={site.contact.email}
        />

        {/* All three of Ubud's grids run at three columns on the live site — it
            has no oversized "Our Villas" equivalent. They're differentiated here
            by layout and tone instead, so three consecutive grids don't read as
            one repeating texture. */}
        <LinkCardGrid
          heading="STAY"
          layout="cards"
          columns={3}
          tone="canvas"
          items={[
            {
              label: "Suites",
              href: "https://nyuhbalivillas.com/ubud/villa/",
              imgSrc: `${UPLOADS}/2023/03/Honeymoon-Suite-5.webp`,
              meta: site.label,
            },
            {
              label: "Romantic Villas",
              href: "https://nyuhbalivillas.com/ubud/villa/",
              imgSrc: `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-6.webp`,
              meta: site.label,
            },
            {
              label: "Family Villas",
              href: "https://nyuhbalivillas.com/ubud/villa/",
              imgSrc: `${UPLOADS}/2023/03/Four-Bedroom-Pool-Villa-4.webp`,
              meta: site.label,
            },
          ]}
        />

        <LinkCardGrid
          heading="DISCOVER"
          layout="rows"
          tone="surface"
          items={[
            {
              label: "Dining",
              href: "https://nyuhbalivillas.com/ubud/dining/",
              imgSrc: `${UPLOADS}/2023/03/ezgif.com-gif-maker-3.webp`,
              meta: site.label,
            },
            {
              label: "SPA",
              href: "https://nyuhbalivillas.com/ubud/spa/",
              imgSrc: `${UPLOADS}/2023/03/ubudspa.webp`,
              meta: site.label,
            },
            {
              label: "Experience",
              href: "https://nyuhbalivillas.com/ubud/balinese-culture/",
              imgSrc: `${UPLOADS}/2023/03/ubud-walk-1.webp`,
              meta: site.label,
            },
          ]}
        />

        <LinkCardGrid
          heading="OUR PACKAGES"
          layout="cards"
          columns={3}
          tone="canvas"
          items={[
            {
              label: "Honeymoon",
              href: "https://nyuhbalivillas.com/ubud/packages/",
              imgSrc: `${UPLOADS}/2023/03/ezgif.com-gif-maker-7.webp`,
            },
            {
              label: "Couple's Retreat",
              href: "https://nyuhbalivillas.com/ubud/retreat/couples/",
              imgSrc: `${UPLOADS}/2023/03/ubud-yoga-4.webp`,
            },
            {
              label: "Authentic Balinese Healing",
              href: "https://nyuhbalivillas.com/ubud/retreat/luxury/balinese-healing/",
              imgSrc: `${UPLOADS}/2023/05/TD004090-min.webp`,
            },
          ]}
        />

        <TestimonialCarousel testimonials={TESTIMONIALS.ubud} />
        <InstagramTeaser
          heading="What's happening @nyuhbaliubud"
          instagramHref="https://www.instagram.com/nyuhbaliubud/"
        />
        <AwardsRow
          variant="marquee"
          badges={[
            `${UPLOADS}/2023/02/ubud-award-3.jpg.webp`,
            `${UPLOADS}/2023/02/ubud-award-1.jpg.webp`,
            `${UPLOADS}/2023/12/tripadvisor2020.png.webp`,
            `${UPLOADS}/2023/12/tripadvisor-2021.png.webp`,
            `${UPLOADS}/2023/02/ubud-awards-chse.png`,
            `${UPLOADS}/2023/12/Best-Luxury-Boutique-Retreat-2023.png.webp`,
            `${UPLOADS}/2023/12/Best-Luxury-Wellness-Resort.png.webp`,
            `${UPLOADS}/2023/12/Best-Luxury-Yoga-Wellness-Retreat.png.webp`,
          ]}
        />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
