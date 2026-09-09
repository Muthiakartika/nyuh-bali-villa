// ======================================================
// Route Information
// Original WordPress URL:
// /ubud-spa-booking-form/   (WP page ID 321, "Ubud - SPA booking form")
//
// Current Next.js Route:
// src/app/ubud-spa-booking-form/page.tsx
//
// Catatan slug: top-level di WordPress (bukan di bawah /ubud/).
//
// Catatan tautan: halaman SPA Ubud (/ubud/spa) memakai Fresha sebagai mesin
// reservasi, BUKAN form ini — jadi form ini tidak ditaut dari mana pun di
// situs live maupun di build ini. Halaman tetap dibuat agar URL WordPress-nya
// tidak mati setelah migrasi.
//
// Jika slug berubah, perbarui nama folder src/app/ubud-spa-booking-form/.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import {
  InquiryForm,
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { SPA_RESERVATION_FIELDS } from "@/data/spa-reservations";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud-spa-booking-form");
}



// Full treatment choices, rates, booking times, and agreement from this form.
const FIELDS = SPA_RESERVATION_FIELDS["ubud-spa-booking-form"];

export default async function UbudSpaBookingFormPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/spa" />
      <main>

        <Section tone="sand" width="narrow">
          <InquiryForm
            // The only heading on this page, so it is the page title.
            headingAs="h1"
            heading="Spa Booking"
            fields={FIELDS}
            submitLabel="Send"
            confirmation="Thank you — we have received your spa booking request and will confirm it by email shortly."
          />
        </Section>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
