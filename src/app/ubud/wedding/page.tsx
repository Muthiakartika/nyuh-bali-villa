// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/wedding/           (WP page ID 303, "Ubud - Wedding")
//
// Current Next.js Route:
// src/app/ubud/wedding/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/wedding/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   (saat ini menu Ubud belum memuat item "Wedding" — lihat catatan di file itu)
// - internal links: src/app/ubud/packages/page.tsx -> WEDDING_HIGHLIGHT
//   (CTA "Explore More" menaut ke /ubud/wedding)
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
  
} from "@/components/property/PackageList";
import {
  InquiryForm,
  
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { Section } from "@/components/ui/Section";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  HERO_IMAGES,
  
  WEDDING_INTRO,
  WEDDING_FIELDS,
} from "@/data/pages/ubud-wedding";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/wedding");
}

/**
 * Ubud — Wedding. Two sections, in the live page's order: the intimate wedding
 * pitch with its brochure downloads, then the long "Personalize your Wedding"
 * enquiry form.
 *
 * The form sits in a `narrow` Section — the same reading measure the legal
 * pages and the contact form use. Twenty fields across the full 1240px grid
 * would put a 16px input on a 1200px line.
 *
 * No `BookingSearchBar` here: the live wedding page doesn't carry the booking
 * widget, and the page's own action is the enquiry form rather than a
 * room-night search.
 */
export default async function UbudWeddingPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/wedding" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/wedding" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Intimate wedding at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Wedding"
          />

          <PackageList
            eyebrow="Wedding"
            heading="Intimate Wedding in Ubud"
            packages={WEDDING_INTRO}
            tone="sand"
          />

          <Section tone="sand-deep" width="narrow">
            <InquiryForm
              heading="Personalize your Wedding"
              fields={WEDDING_FIELDS}
              submitLabel="Send"
            />
          </Section>

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
