import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { HeroSlider } from "@/components/property/HeroSlider";
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import { AboutNarrative } from "@/components/property/AboutNarrative";
import { PromoBanner } from "@/components/property/PromoBanner";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { InstagramTeaser } from "@/components/property/InstagramTeaser";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { TESTIMONIALS } from "@/data/testimonials";

const site = PROPERTY_SITES.seminyak;

// Overrides the root layout's Home-page title/description — every route
// needs its own, or every browser tab and search result would read
// "Nyuh Bali Villas & Resort - 5 Star Luxury Bali Villa" regardless of
// which page it actually is. Title copied verbatim from the live page.
export const metadata: Metadata = {
  title: "Nyuh Bali - Luxury Villas Seminyak - Romantic Honeymoons",
};
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/Seminyak-slider-3.webp`,
  `${UPLOADS}/2023/03/seminyak-slider.webp`,
  `${UPLOADS}/2023/03/home-seminyak.webp`,
];

export default function SeminyakAboutPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak" />
      <main>
        <HeroSlider images={HERO_IMAGES} alt="Nyuh Bali Villas Seminyak" />
        <BookingSearchBar bookingHref={site.bookingHref} />

        <AboutNarrative
          heading="Nyuh Bali's Honeymoon Villa in Seminyak"
          paragraphs={[
            "Nestled in the heart of Seminyak, Nyuh Bali Villa is designed as a romantic oasis to unwind while having easy access to enjoy the Seminyak vibes. World-class restaurants, minimarket, and money changers are just a few steps from your door. Each villa represents the authentic Balinese style featuring a private pool, tropical greenery, and our signature Nyuh Bali touches for the romantic experience in Bali.",
            "Imagine the comfort of your private villa in Bali while enjoying the convenience of a fully serviced hotel such as onsite restaurant, spa, and shuttle around Seminyak. Butler service is ready around the clock as our commitment to deliver the highest level of personalized service. In every romantic journey, from the proposal, a honeymoon to the anniversary, we would love to make it memorable for you to treasure. All people at Nyuh Bali believe that your holiday should be less stressful. Let us take care your holiday in Seminyak Bali",
          ]}
          tagline="We serve with smile and sincerity"
          bookingHref={site.bookingHref}
          buttonLabel="Book Your Stay"
        />

        <PromoBanner
          promoCode="ilovenyuh"
          perks={[
            "One-way airport transfer*",
            "IDR 200.000 credit for candlelight dinner & BBQ",
            "Upgrade to floating breakfast",
          ]}
          contactEmail={site.contact.email}
        />

        <LinkCardGrid
          heading="Our Villas"
          labelSize={28}
          columns={2}
          items={[
            {
              label: "One-bedroom Pool Villa",
              href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/pool/",
              imgSrc: `${UPLOADS}/2023/03/Seminyak-One-bedroom-pool-villa.webp`,
            },
            {
              label: "Honeymoon Suite Pool Villa",
              href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/",
              imgSrc: `${UPLOADS}/2023/03/Seminyak-slider-2.webp`,
            },
          ]}
        />

        <LinkCardGrid
          heading="Discover"
          labelSize={18}
          imageAspect="347/250"
          columns={3}
          items={[
            {
              label: "Dining",
              href: "https://nyuhbalivillas.com/seminyak/dining/",
              imgSrc: `${UPLOADS}/2023/01/BBQ-seminyak-min-min-slider-1-_1__1.webp`,
            },
            {
              label: "SPA",
              href: "https://nyuhbalivillas.com/seminyak/spa/",
              imgSrc: `${UPLOADS}/2023/03/discover-spa.webp`,
            },
            {
              label: "Explore Bali",
              href: "https://nyuhbalivillas.com/seminyak/tour/",
              imgSrc: `${UPLOADS}/2023/03/discover-explore-bali.webp`,
            },
          ]}
        />

        <LinkCardGrid
          heading="Plan your Romantic Gateaway"
          labelSize={18}
          columns={4}
          items={[
            {
              label: "Stress-Free Proposal",
              href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/packages/",
              imgSrc: `${UPLOADS}/2023/01/stress-free-proposal-package.webp`,
            },
            {
              label: "Sweet Celebration",
              href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/packages",
              imgSrc: `${UPLOADS}/2023/03/sweet-celebration.webp`,
            },
            {
              label: "Dreamy Honeymoon",
              href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/packages",
              imgSrc: `${UPLOADS}/2023/03/seminyak-slider.webp`,
            },
            {
              label: "Culture Hideaway",
              href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/packages",
              imgSrc: `${UPLOADS}/2023/01/balinese-culture-hideaway.webp`,
            },
          ]}
        />

        <TestimonialCarousel testimonials={TESTIMONIALS.seminyak} />
        <InstagramTeaser
          heading="What's happening @nyuhbalivillas"
          instagramHref="https://www.instagram.com/nyuhbalivillas/"
        />
        <AwardsRow
          badges={[
            `${UPLOADS}/2023/01/awards-hotelcom-2020.png`,
            `${UPLOADS}/2023/01/awards-hotelcom.png`,
            `${UPLOADS}/2023/01/awards-tripadvisor.png`,
            `${UPLOADS}/2023/01/awards-hotelscombined.png`,
            `${UPLOADS}/2023/02/ubud-awards-chse.png`,
          ]}
        />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
