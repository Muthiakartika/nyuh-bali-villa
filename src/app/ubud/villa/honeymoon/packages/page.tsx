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
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import { PackageList } from "@/components/property/PackageList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { UBUD_OFFER_QUOTES, UBUD_ROMANCE_PACKAGES } from "@/data/packages";

export const metadata: Metadata = {
  title: "Ubud Romance - Honeymoon & Proposal Packages - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/03/honeymoon-ubud.webp`,
  `${UPLOADS}/2023/03/eat-pray-love.webp`,
];

/**
 * Ubud — Romance. The live page is the Offers page's Romance tab published on
 * its own URL: same three packages, same guest quotes, its own "Ubud Romance"
 * heading. Both routes are kept because the WordPress site has both, and both
 * read their content from data/packages.ts.
 */
export default function UbudRomancePage() {
  return (
    <>
      {/* No nav item matches this route, so nothing is marked current — the
          same situation as the Contact pages, which the Ubud menu also omits. */}
      <PropertyHeader site={site} activeHref="/ubud/villa/honeymoon/packages" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Romantic honeymoon packages at Ubud Nyuh Bali Resort"
          eyebrow="Offers"
          title="Ubud Romance"
        />
        <BookingSearchBar bookingHref={site.bookingHref} />

        <PackageList
          heading="Ubud Romance"
          packages={UBUD_ROMANCE_PACKAGES}
          tone="sand"
        />

        <TestimonialCarousel testimonials={UBUD_OFFER_QUOTES} />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
