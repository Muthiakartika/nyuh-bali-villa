// ======================================================
// Route Information
// Original WordPress URL:
// /ubud-personalize-your-retreat/  (WP page ID 118370,
//                                   "Ubud - Personalize Your Retreat Form")
//
// Current Next.js Route:
// src/app/ubud-personalize-your-retreat/page.tsx
//
// Catatan slug: top-level di WordPress (bukan di bawah /ubud/).
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud-personalize-your-retreat/
// - internal links: src/app/ubud/retreat/host-your-own/page.tsx
//   (CTA "Personalize your Retreat")
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { InquiryForm } from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import ManagedPage from "@/components/sanity/ManagedPage";
import {
  PERSONALIZE_RETREAT_CONFIRMATION,
  PERSONALIZE_RETREAT_FIELDS,
  PERSONALIZE_RETREAT_HEADING,
  PERSONALIZE_RETREAT_SUBMIT_LABEL,
} from "@/data/pages/ubud-personalize-retreat";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud-personalize-your-retreat");
}

export default async function PersonalizeYourRetreatPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat/host-your-own" />
      <main>
        <ManagedPage
          path="/ubud-personalize-your-retreat"
          fallbackProperty="ubud"
        >
          <Section tone="sand" width="narrow">
            <InquiryForm
              property="ubud"
              // The only heading on this page, so it is the page title.
              headingAs="h1"
              heading={PERSONALIZE_RETREAT_HEADING}
              fields={PERSONALIZE_RETREAT_FIELDS}
              submitLabel={PERSONALIZE_RETREAT_SUBMIT_LABEL}
              confirmation={PERSONALIZE_RETREAT_CONFIRMATION}
            />
          </Section>

          <AwardsRow
            variant={site.awards.variant}
            badges={site.awards.badges}
          />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
