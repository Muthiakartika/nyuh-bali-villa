import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingWidget } from "@/components/property/BookingWidget";
import { AboutNarrative } from "@/components/property/AboutNarrative";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { InstagramTeaser } from "@/components/property/InstagramTeaser";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite, getTestimonials, getInstagramWidget } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud");
}

const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04.
const HERO_IMAGES = [`${UPLOADS}/2025/01/home-ubud-compress.webp`];

export default async function UbudAboutPage() {
  const site = await getPropertySite("ubud");
  const instagramWidget = await getInstagramWidget("ubud");
  const testimonials = await getTestimonials("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud" />
      <main>
        {/* Every band below is the fallback: publish a `page`
            document at this path in the Studio and its sections
            render instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Nyuh Bali Villas Ubud"
            eyebrow="Nyuh Bali Villas"
            title="Ubud"
          />
          <BookingWidget site={site} />

          {/* Ubud's narrative is a single paragraph with no tagline sentence
              before the button — unlike Seminyak's two paragraphs plus tagline.
              Confirmed directly rather than assumed to be symmetric. */}
          <AboutNarrative
            eyebrow="About Us"
            heading="Luxury Villas & Suite in Ubud"
            paragraphs={[
              "Inspired by the philosophy of the coconut tree, or Nyuh in the Balinese language, which is known as the versatile tree to shore up people’s lives, Ubud Nyuh Bali Resort aims to create the holistic luxury retreat experience that you look for. Presenting you with two luxury yoga shalas, five-star accommodations, two swimming pools, a spa, and a home gym, you will feel the power of positive transformation of Ubud energy. Imagine waking up while hearing the groups of birds singing, inhaling the morning breeze during guided morning walks, stretching your body with a daily yoga class, and enjoying delicious healthy foods. Calm your mind by joining daily complimentary wellness activities like breathwork & sound healing to allow yourself to relax as your well-being deserves. With an experienced team that cares for you from the heart and with the personalized touch of our luxury villas in Ubud, you will feel recharged and reborn for a new beginning.",
            ]}
            bookingHref={site.bookingHref}
            buttonLabel="Plan Now"
            promoCode="ilovenyuh"
            perks={[
              "One-way airport transfer (for booking min 3 nights at our villa)",
              "20% discount at Mahamaya SPA",
              "Upgrade to floating breakfast",
            ]}
            contactEmail={site.contact.email}
            imageSrc={`${UPLOADS}/2026/08/Nyuh-Bali-Ubud-26-1.jpg`}
          />

          {/* All three of Ubud's grids genuinely run at three columns on the live
              site — it has no oversized "Our Villas" equivalent. They're
              differentiated by tone (sand / sand-deep / sand), so three
              consecutive 3-up grids don't read as one repeating texture. */}
          <LinkCardGrid
            heading="STAY"
            columns={3}
            tone="sand"
            items={[
              {
                label: "Suites",
                href: "/ubud/villa",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/Honeymoon-Suite-5.webp`,
              },
              {
                label: "Romantic Villas",
                href: "/ubud/villa",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-6.webp`,
              },
              {
                label: "Family Villas",
                href: "/ubud/villa",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/Four-Bedroom-Pool-Villa-4.webp`,
              },
            ]}
          />

          <LinkCardGrid
            heading="DISCOVER"
            columns={3}
            tone="sand-deep"
            items={[
              {
                label: "Dining",
                href: "/ubud/dining",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ezgif.com-gif-maker-3.webp`,
              },
              {
                label: "SPA",
                href: "/ubud/spa",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ubudspa.webp`,
              },
              {
                label: "Experience",
                href: "/ubud/balinese-culture",
                inScope: true,
                imgSrc: `${UPLOADS}/2026/08/Nyuh-Bali-Ubud-31-1.jpg`,
              },
            ]}
          />

          <LinkCardGrid
            heading="OUR PACKAGES"
            columns={3}
            tone="sand"
            items={[
              {
                // Points at the dedicated Romance page rather than the Offers
                // page's Romance tab. Both render the identical three packages
                // (they share UBUD_ROMANCE_PACKAGES), so a visitor sees the same
                // thing either way — but this is the only entry point Romance
                // has. The live Ubud menu carries a "Romance" item; this build's
                // menu doesn't, because a 9th item doesn't fit beside the logo
                // and Book Now at `lg` (see the note in data/properties.ts), and
                // an unreachable route is the worse of the two problems.
                label: "Honeymoon",
                href: "/ubud/villa/honeymoon/packages",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ezgif.com-gif-maker-7.webp`,
              },
              {
                label: "Couple's Retreat",
                href: "/ubud/retreat/couples",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ubud-yoga-4.webp`,
              },
              {
                label: "Authentic Balinese Healing",
                href: "/ubud/retreat/luxury/balinese-healing",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/05/TD004090-min.webp`,
              },
            ]}
          />

          <TestimonialCarousel testimonials={testimonials} />
          <InstagramTeaser
            heading="What's happening @nyuhbaliubud"
            instagramHref="https://www.instagram.com/nyuhbaliubud/"
            // The workspace id, resolved from the same Studio field the JSON
            // endpoint came from — so a workspace swapped in Sanity swaps the
            // embed too, with no redeploy.
            widget={instagramWidget}
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
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
