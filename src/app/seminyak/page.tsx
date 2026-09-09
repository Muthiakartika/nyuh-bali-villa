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
import {
  fetchInstagramPosts,
  type InstagramPost,
} from "@/components/property/instagramFeed";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite, getTestimonials } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";


// Overrides the root layout's Home-page title/description — every route
// needs its own, or every browser tab and search result would read
// "Nyuh Bali Villas & Resort - 5 Star Luxury Bali Villa" regardless of
// which page it actually is. Title copied verbatim from the live page.
export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak");
}

const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/Seminyak-slider-3.webp`,
  `${UPLOADS}/2023/03/seminyak-slider.webp`,
  `${UPLOADS}/2023/03/home-seminyak.webp`,
];

/**
 * The Instagram grid until a Behold feed exists.
 *
 * Same relationship `BookingSearchBar` has to `BookingWidget`: a real,
 * self-sufficient version of the thing, shown when the third party isn't
 * there, rather than an empty strip where a section should be. It is replaced
 * automatically the moment `instagramFeedUrl` is filled in — none of this
 * needs deleting then, and it stays as the fallback if Behold is ever
 * unreachable at build time.
 *
 * Every photograph is one the rest of this page doesn't use, per the
 * no-image-twice rule — the hero, the "Best Price Guaranteed" plate and both
 * card grids are drawn from different files entirely. The mix is deliberate:
 * two villas, the spa, the in-villa BBQ and two of the island tours, so the
 * row reads like the account it stands in for rather than six views of the
 * same pool.
 *
 * No `permalink` on any of them — these are resort photographs, not posts we
 * can point at, so each tile opens the profile instead.
 */
const INSTAGRAM_STILLS: InstagramPost[] = [
  {
    id: "still-honeymoon-suite-pool-villa",
    imageUrl: `${UPLOADS}/2023/03/Honeymoon-Suite-Pool-Villa-1.webp`,
    alt: "Private pool at the Honeymoon Suite Pool Villa, Nyuh Bali Villas Seminyak",
  },
  {
    id: "still-one-bedroom-pool-villa",
    imageUrl: `${UPLOADS}/2023/03/One-Bedroom-Pool-Villa-2.webp`,
    alt: "One Bedroom Pool Villa at Nyuh Bali Villas Seminyak",
  },
  {
    id: "still-seminyak-spa",
    imageUrl: `${UPLOADS}/2023/03/Seminyak-Spa-2.webp`,
    alt: "Treatment room at the Nyuh Bali Villas Seminyak spa",
  },
  {
    id: "still-seminyak-bbq",
    imageUrl: `${UPLOADS}/2023/03/seminyak-bbq.webp`,
    alt: "BBQ dinner cooked by a private chef in the villa",
  },
  {
    id: "still-tanah-lot",
    imageUrl: `${UPLOADS}/2023/03/tanahlot.webp`,
    alt: "Tanah Lot sea temple, a stop on the Exotic Sunset Tour",
  },
  {
    id: "still-uluwatu",
    imageUrl: `${UPLOADS}/2023/03/tour-uluwatu.webp`,
    alt: "Uluwatu Temple above the Indian Ocean, a stop on the Romancing Uluwatu tour",
  },
];

/*
 * Section order is unchanged from the original site, deliberately. The
 * redesign brief's whole premise is evolution rather than replacement: a
 * returning visitor should find every piece of information exactly where they
 * left it. Everything that changed — composition, scale, colour placement,
 * motion — happens inside these sections, not by rearranging them.
 *
 * What the `tone` props encode is the page's new rhythm. The old page ran seven
 * full-width dark slabs; the body now runs entirely on warm light surfaces —
 * `sand` and `sand-deep` alternating, then white for the Instagram note — and
 * dark is left to the chrome (the awards base and the footer) plus the small
 * offer plate inside the About section.
 */
/** One row of six, which is also the whole feed: Behold's free tier caps a
 * feed at six posts, so this is not a slice of a longer one. */
const INSTAGRAM_POST_COUNT = 6;

export default async function SeminyakAboutPage() {
  const site = await getPropertySite("seminyak");
  const testimonials = await getTestimonials("seminyak");
  // Server-side and cached (see `fetchInstagramPosts`), so the photographs
  // ship in this route's HTML and no Instagram request happens in the
  // visitor's browser. Empty until `instagramFeedUrl` is filled in, or if
  // Behold is unreachable at build time — `INSTAGRAM_STILLS` covers both.
  const instagramPosts = await fetchInstagramPosts(
    site.instagramFeedUrl,
    INSTAGRAM_POST_COUNT,
  );

  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak" />
      <main>
        {/* Every band below is the fallback: publish a `page`
            document at this path in the Studio and its sections
            render instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak" fallbackProperty="seminyak">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Nyuh Bali Villas Seminyak"
            eyebrow="Nyuh Bali Villas"
            title="Seminyak"
          />
          <BookingWidget site={site} />

          <AboutNarrative
            eyebrow="About Us"
            heading="Nyuh Bali's Honeymoon Villa in Seminyak"
            paragraphs={[
              "Nestled in the heart of Seminyak, Nyuh Bali Villa is designed as a romantic oasis to unwind while having easy access to enjoy the Seminyak vibes. World-class restaurants, minimarket, and money changers are just a few steps from your door. Each villa represents the authentic Balinese style featuring a private pool, tropical greenery, and our signature Nyuh Bali touches for the romantic experience in Bali.",
              "Imagine the comfort of your private villa in Bali while enjoying the convenience of a fully serviced hotel such as onsite restaurant, spa, and shuttle around Seminyak. Butler service is ready around the clock as our commitment to deliver the highest level of personalized service. In every romantic journey, from the proposal, a honeymoon to the anniversary, we would love to make it memorable for you to treasure. All people at Nyuh Bali believe that your holiday should be less stressful. Let us take care your holiday in Seminyak Bali",
            ]}
            tagline="We serve with smile and sincerity"
            bookingHref={site.bookingHref}
            buttonLabel="Book Your Stay"
            promoCode="ilovenyuh"
            perks={[
              "One-way airport transfer*",
              "IDR 200.000 credit for candlelight dinner & BBQ",
              "Upgrade to floating breakfast",
            ]}
            contactEmail={site.contact.email}
            imageSrc={`${UPLOADS}/2023/03/seminyak-best-price.webp`}
          />

          {/* The property's actual inventory, so it gets the widest cards — two
              columns at the shared card height. */}
          <LinkCardGrid
            heading="Our Villas"
            columns={2}
            tone="sand"
            items={[
              {
                label: "One-bedroom Pool Villa",
                href: "/seminyak/villa/honeymoon/pool",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/Seminyak-One-bedroom-pool-villa.webp`,
              },
              {
                label: "Honeymoon Suite Pool Villa",
                href: "/seminyak/villa/honeymoon",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/Seminyak-slider-2.webp`,
              },
            ]}
          />

          <LinkCardGrid
            heading="Discover"
            columns={3}
            tone="sand-deep"
            items={[
              {
                label: "Dining",
                href: "/seminyak/dining",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/01/BBQ-seminyak-min-min-slider-1-_1__1.webp`,
              },
              {
                label: "SPA",
                href: "/seminyak/spa",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/discover-spa.webp`,
              },
              {
                label: "Explore Bali",
                href: "/seminyak/tour",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/discover-explore-bali.webp`,
              },
            ]}
          />

          {/* Four columns — the narrowest cards on the page (same height as the
              rest), so the packages read as a compact set of options rather than
              as four more full-size features competing with the villas above. */}
          <LinkCardGrid
            heading="Plan your Romantic Gateaway"
            columns={4}
            tone="sand"
            items={[
              {
                label: "Stress-Free Proposal",
                href: "/seminyak/villa/honeymoon/packages",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/01/stress-free-proposal-package.webp`,
              },
              {
                label: "Sweet Celebration",
                href: "/seminyak/villa/honeymoon/packages",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/sweet-celebration.webp`,
              },
              {
                label: "Dreamy Honeymoon",
                href: "/seminyak/villa/honeymoon/packages",
                inScope: true,
                // The hero already opens on `seminyak-slider`, so this card takes
                // the honeymoon package's own photograph instead of repeating it.
                imgSrc: `${UPLOADS}/2022/12/Dreamy-Honeymoon-Package.jpeg`,
              },
              {
                label: "Culture Hideaway",
                href: "/seminyak/villa/honeymoon/packages",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/01/balinese-culture-hideaway.webp`,
              },
            ]}
          />

          <TestimonialCarousel testimonials={testimonials} />
          <InstagramTeaser
            heading="What's happening @nyuhbalivillas"
            instagramHref="https://www.instagram.com/nyuhbalivillas/"
            posts={
              instagramPosts.length > 0 ? instagramPosts : INSTAGRAM_STILLS
            }
            // Always the proxy path: whether a feed exists is the route's
            // call, because the URL lives in Sanity and can be published
            // without touching this file.
            feedEndpoint="/api/instagram/seminyak"
            feedLimit={9}
            feedColumns={3}
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
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
