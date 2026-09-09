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
  
} from "@/components/property/PackageList";
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  
  HERO_IMAGES,
  PROGRAMS,
  LUXURY_INTRO,
} from "@/data/pages/ubud-retreat-luxury";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/retreat/luxury");
}

/**
 * Ubud — Luxury Retreat (the Retreat dropdown's first entry).
 *
 * The live page's three selling points (Private / Personalized / Start
 * anytime) are icon-and-label pairs, which is exactly what `AmenityGrid`
 * renders — so they reuse it rather than getting a bespoke row.
 */
export default async function UbudLuxuryRetreatPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat/luxury" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/retreat/luxury" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Personalised luxury retreat at Ubud Nyuh Bali Resort"
            eyebrow="Retreat"
            title="Personalised Luxury Retreat in Ubud"
          />

          <PackageList
            eyebrow="Luxury Retreat"
            heading="Personalised Luxury Retreat in Ubud"
            intro={LUXURY_INTRO}
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
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
