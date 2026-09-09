// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/packages/          (WP page ID 44, "Ubud - Offers")
//
// Current Next.js Route:
// src/app/ubud/packages/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/packages/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems ("Offers")
// - internal links: src/app/ubud/page.tsx (LinkCardGrid "OUR PACKAGES"),
//   src/components/property/PropertyFooter.tsx (menu "offers")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Dependency antar halaman: kartu "Intimate Wedding in Ubud" di bawah menaut ke
// /ubud/wedding (src/app/ubud/wedding/page.tsx). Jika slug wedding berubah,
// href pada WEDDING_HIGHLIGHT juga harus diperbarui.
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
import { UBUD_OFFER_QUOTES, UBUD_ROMANCE_PACKAGES } from "@/data/packages";
import { getPackageSet } from "@/sanity/lib/content";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import {
  UPLOADS,
  HERO_IMAGES,
  RETREAT_PACKAGES,
  WEDDING_HIGHLIGHT,
} from "@/data/pages/ubud-packages";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/packages");
}

/**
 * Ubud — Offers. The live page filters one long list with All / Romance /
 * Retreat / Wedding tabs. Those tabs are reproduced here as three headed
 * sections in the same order instead of as a JavaScript filter: the content
 * is identical either way, every package stays reachable without interaction,
 * and it keeps the whole page a Server Component.
 */
export default async function UbudPackagesPage() {
  const site = await getPropertySite("ubud");
  // One published set feeds both romance routes, exactly as
  // UBUD_ROMANCE_PACKAGES does today — see src/data/packages.ts.
  const romancePackages =
    (await getPackageSet("ubud-romance")) ?? UBUD_ROMANCE_PACKAGES;
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/packages" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/packages" fallbackProperty="ubud">
          <PropertyHero
            images={HERO_IMAGES}
            alt="Romance and retreat packages at Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
            title="Offers"
          />
          <BookingWidget site={site} />

          <PackageList
            eyebrow="Offers"
            heading="Romance"
            intro="Luxury Suite & Villa in Ubud"
            packages={romancePackages.map((item, index) => ({
              ...item,
              images: index === 1
                ? [`${UPLOADS}/2024/11/011A0124-Edit-min-min-min-1.jpg`, ...item.images]
                : index === 2
                  ? [`${UPLOADS}/2024/11/IMG_8918-Edit-min-1.jpg`, ...item.images]
                  : item.images,
            }))}
            tone="sand"
          />

          <PackageList
            heading="Retreat"
            packages={RETREAT_PACKAGES}
            tone="sand-deep"
          />

          <PackageList
            heading="Wedding"
            packages={WEDDING_HIGHLIGHT}
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
