// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/wellness/          (WP page ID 46, "Ubud - Wellness")
//
// Current Next.js Route:
// src/app/ubud/wellness/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/wellness/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   (submenu "Retreat" -> "Wellness Facilities")
// - internal links: src/app/ubud/retreat/page.tsx (kartu "Wellness Facilities")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Halaman detail tiap kelas (belum dibuat, CTA "Explore More" karenanya inert):
// /ubud/wellness/yoga, /ubud/fitness, /ubud/wellness/sound-healing,
// /ubud/wellness/breathwork, /ubud/wellness/body-tone-flow,
// /ubud/wellness/life-coach, /ubud/wellness/reiki-healing,
// /ubud/wellness/chakra-healing
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  PackageList,
  
} from "@/components/property/PackageList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import type { } from "@/data/testimonials";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  
  HERO_IMAGES,
  FACILITIES,
  GUEST_QUOTES,
} from "@/data/pages/ubud-wellness";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/wellness");
}

/** Ubud — Wellness Facilities (the Retreat dropdown's third entry). Eight
 * classes/facilities then the guest quotes. */
export default async function UbudWellnessPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/wellness" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/wellness" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Wellness facilities at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Wellness"
          />

          <PackageList
            eyebrow="Wellness"
            heading="Luxury Retreat in Ubud"
            packages={FACILITIES}
            tone="sand"
          />

          <TestimonialCarousel testimonials={GUEST_QUOTES} />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
