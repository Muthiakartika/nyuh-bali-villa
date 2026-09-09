// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/villa/honeymoon/packages/     (WP page ID 118398, "Ubud - Romance")
//
// Current Next.js Route:
// src/app/ubud/villa/honeymoon/packages/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/villa/honeymoon/packages/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   (saat ini menu Ubud belum memuat item "Romance" — lihat catatan di file itu)
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "OUR PACKAGES" ->
//   kartu "Honeymoon")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan dependency: isi paket halaman ini IDENTIK dengan tab "Romance" pada
// /ubud/packages. Keduanya membaca UBUD_ROMANCE_PACKAGES dari
// src/data/packages.ts — ubah copy di sana, bukan di salah satu page.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { BookingWidget } from "@/components/property/BookingWidget";
import { PackageList } from "@/components/property/PackageList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import ManagedPage from "@/components/sanity/ManagedPage";
import { UBUD_OFFER_QUOTES, UBUD_ROMANCE_PACKAGES } from "@/data/packages";
import { getPackageSet } from "@/sanity/lib/content";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  
  HERO_IMAGES,
} from "@/data/pages/ubud-romance";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/villa/honeymoon/packages");
}

/**
 * Ubud — Romance. The live page is the Offers page's Romance tab published on
 * its own URL: same three packages, same guest quotes, its own "Ubud Romance"
 * heading. Both routes are kept because the WordPress site has both, and both
 * read their content from data/packages.ts.
 */
export default async function UbudRomancePage() {
  const site = await getPropertySite("ubud");
  // One published set feeds both romance routes, exactly as
  // UBUD_ROMANCE_PACKAGES does today — see src/data/packages.ts.
  const romancePackages =
    (await getPackageSet("ubud-romance")) ?? UBUD_ROMANCE_PACKAGES;
  return (
    <>
      {/* No nav item matches this route, so nothing is marked current — the
          same situation as the Contact pages, which the Ubud menu also omits. */}
      <PropertyHeader site={site} activeHref="/ubud/villa/honeymoon/packages" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/villa/honeymoon/packages" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Romantic honeymoon packages at Ubud Nyuh Bali Resort"
            eyebrow="Offers"
            title="Ubud Romance"
          />
          <BookingWidget site={site} />

          <PackageList
            heading="Ubud Romance"
            packages={romancePackages}
            tone="sand"
          />

          <TestimonialCarousel testimonials={UBUD_OFFER_QUOTES} />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
