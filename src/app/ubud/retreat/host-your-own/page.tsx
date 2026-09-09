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
  
} from "@/components/property/PackageList";
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  UPLOADS,
  HERO_IMAGES,
  
  INTRO,
  MEALS,
} from "@/data/pages/ubud-host-retreat";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/retreat/host-your-own");
}

/**
 * Ubud — Host Your Retreat (the Retreat dropdown's second entry).
 *
 * Three existing components carry the whole page: the six selling points are
 * icon+label pairs (`AmenityGrid`), the accommodation and facility line-ups
 * are photo tiles (`LinkCardGrid`, whose cards are already inert by default
 * since the detail pages aren't built), and the prose blocks are
 * `PackageList` items.
 */
export default async function UbudHostYourRetreatPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat/host-your-own" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/retreat/host-your-own" fallbackProperty="ubud">
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
                href: "/ubud/villa/1-bedroom-pool-deluxe",
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
                imgSrc: `${UPLOADS}/2023/03/ubud-gym-1.webp`,
              },
              {
                label: "Indoor Yoga Shala",
                href: "/ubud/villa/1-bedroom-pool-deluxe",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ubud-yoga-2.webp`,
              },
              {
                label: "Rooftop Yoga Shala",
                href: "/ubud/villa/1-bedroom-pool-royal",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/05/AW_06570-min.webp`,
              },
              {
                label: "Meditation Garden",
                href: "/ubud/villa/honeymoon/pool",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/03/ubud-yoga-1.webp`,
              },
              {
                label: "Wellness Library",
                href: "/ubud/villa/2-bedroom-pool",
                inScope: true,
                imgSrc: `${UPLOADS}/2023/04/0D7555AC-09E4-4332-9619-08A9AA329530.webp`,
              },
            ]}
          />

          <PackageList heading="Healthy Meals" packages={MEALS} tone="sand" />

          {/* The live page's closing note: after all the detail above, a
              visitor who is ready acts through the same form the intro section
              already links to — this is a second, more prominent doorway to it
              rather than a different destination. */}
          <Section tone="sand-deep">
            <SectionHeading title="Get a Quote for your Event" align="center" />
            <Reveal delay={100} className="mt-8 flex justify-center">
              <Button href="/ubud-personalize-your-retreat">
                Personalize your Retreat
              </Button>
            </Reveal>
          </Section>

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
