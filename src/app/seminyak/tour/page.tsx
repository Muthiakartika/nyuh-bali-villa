// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/tour/          (WP page ID 158, "Seminyak - Explore Bali")
//
// Current Next.js Route:
// src/app/seminyak/tour/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/tour/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems
//   ("Explore Bali")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Discover" ->
//   kartu "Explore Bali")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: tombol "Book Now" pada setiap tour menaut ke anchor #tour-booking
// di halaman yang sama (form di bawah). Jika id section form diubah, perbarui
// juga BOOKING_ANCHOR di bawah.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { ProseBand } from "@/components/property/ProseBand";
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
  DAY_TRAVELLING,
  TOURS,
  TOUR_PROSE,
  TOUR_FIELDS,
} from "@/data/pages/seminyak-tour";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/tour");
}

/**
 * Seminyak — Explore Bali. Order follows the live page: the "travel with us"
 * pitch, the two open charters, the five fixed itineraries, then the booking
 * form.
 *
 * The tours reuse `PackageList` rather than getting their own component — a
 * tour and a package are the same shape here (photographs, a pitch, what's
 * included, one action); `meta` is what carries a tour's price and itinerary.
 */
export default async function SeminyakTourPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/tour" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak/tour" fallbackProperty="seminyak">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Private Bali tours from Nyuh Bali Villas Seminyak"
            eyebrow="Seminyak"
            title="Travel as You Wish"
          />

          {/* Page-opening prose. Composed from the shared primitives rather than
              given its own component — it is one page's introduction, not a
              pattern that repeats. */}
          <ProseBand
            eyebrow="Explore Bali"
            heading="You are in the Right Hands . . ."
            paragraphs={TOUR_PROSE}
            email={site.contact.email}
            tone="sand"
          />

          <PackageList
            heading="Day Travelling"
            packages={DAY_TRAVELLING}
            tone="sand-deep"
          />

          <PackageList heading="Tour Packages" packages={TOURS} tone="sand" />

          {/* `scroll-mt` clears the 68/72px sticky header, so an anchored jump
              doesn't land the heading underneath it. */}
          <Section
            tone="sand-deep"
            width="narrow"
            className="scroll-mt-[68px] lg:scroll-mt-[72px]"
            id="tour-booking"
          >
            <InquiryForm
              heading="Book your Tour"
              fields={TOUR_FIELDS}
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
