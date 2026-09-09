// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/villa/honeymoon/packages/   (WP page ID 21, "Seminyak - Offers")
//
// Current Next.js Route:
// src/app/seminyak/villa/honeymoon/packages/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/villa/honeymoon/packages/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems ("Offers")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid
//   "Plan your Romantic Gateaway" — keempat kartunya menaut ke halaman ini),
//   src/components/property/PropertyFooter.tsx (menu "offers")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingWidget } from "@/components/property/BookingWidget";
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
  
  romanticPackages,
  GUEST_QUOTES,
} from "@/data/pages/seminyak-romance";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/villa/honeymoon/packages");
}

/**
 * Seminyak — Offers. Four romantic packages then the guest quotes, matching
 * the live page's order. Uses the same `PackageList` as the Ubud offers pages.
 */
export default async function SeminyakHoneymoonPackagesPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader
        site={site}
        activeHref="/seminyak/villa/honeymoon/packages"
      />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak/villa/honeymoon/packages" fallbackProperty="seminyak">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Romantic packages at Nyuh Bali Villas Seminyak"
            eyebrow="Offers"
            title="Romantic Package in Seminyak"
          />
          <BookingWidget site={site} />

          <PackageList
            eyebrow="Offers"
            heading="Romantic Package in Seminyak"
            packages={romanticPackages(site.bookingHref)}
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
