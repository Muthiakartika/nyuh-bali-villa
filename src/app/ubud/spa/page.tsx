// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/spa/               (WP page ID 319, "Ubud - SPA")
//
// Current Next.js Route:
// src/app/ubud/spa/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/spa/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   ("SPA" dan submenu-nya "Balinese Spa" — keduanya menunjuk URL yang sama)
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "DISCOVER" -> "SPA"),
//   src/app/ubud/retreat/host-your-own/page.tsx (kartu "Mahamaya Spa")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: reservasi spa ditangani Fresha (pihak ketiga), bukan booking engine
// properti — lihat RESERVE_HREF.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  TreatmentList,
  
} from "@/components/property/TreatmentList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { InstagramTeaser } from "@/components/property/InstagramTeaser";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import type { } from "@/data/testimonials";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  RESERVE_HREF,
  HERO_IMAGES,
  SPA_INTRO,
  
  TREATMENTS,
  GUEST_QUOTES,
} from "@/data/pages/ubud-spa";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/spa");
}

/**
 * Ubud — SPA (Mahamaya Spa). The live page's six menu tabs become seven headed
 * categories here: "SPA PACKAGE" holds two clearly separated groups on the live
 * page (Self Indulgence and Romantic Spa for Couple), so each gets its own
 * heading rather than being flattened into one long list.
 *
 * This is the one content page that carries an `InstagramTeaser` — the live
 * page has its own @mahamayaspa.ubud feed, separate from the resort's, and it
 * is wired to a third feed endpoint here for that reason.
 */
export default async function UbudSpaPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/spa" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/spa" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Mahamaya Spa at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Luxury Spa & Flower Bath"
          />

          <TreatmentList
            eyebrow="SPA"
            heading="Luxury Spa & Flower Bath in Ubud"
            intro={SPA_INTRO}
            notes={[
              "For spa inquiries, please email us through spa@ubudnyuhbali.com",
              "Opening Hours: 09.00 - 21.00",
            ]}
            categories={TREATMENTS}
            cta={{ label: "Reserve Now", href: RESERVE_HREF }}
            tone="sand"
          />

          <TestimonialCarousel testimonials={GUEST_QUOTES} />

          <InstagramTeaser
            heading="What's happening @mahamayaspa.ubud"
            instagramHref="https://www.instagram.com/mahamayaspa.ubud/"
            // The spa's own account, not either resort's — its endpoint is a
            // separate field on Ubud's property document (see
            // getInstagramApiUrl). No stills behind it: this band has never
            // carried any, so an unreachable feed leaves it as heading + button,
            // exactly as before.
            feedEndpoint="/api/instagram/spa"
            feedLimit={9}
            feedColumns={3}
          />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
