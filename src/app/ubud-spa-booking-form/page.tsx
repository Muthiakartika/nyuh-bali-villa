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
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";
import { SPA_RESERVATION_FIELDS } from "@/data/spa-reservations";

export const metadata: Metadata = seo("/ubud-spa-booking-form");

const site = PROPERTY_SITES.ubud;


// Full treatment choices, rates, booking times, and agreement from this form.
const FIELDS = SPA_RESERVATION_FIELDS["ubud-spa-booking-form"];

export default function UbudSpaBookingFormPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/spa" />
      <main>

        <Section tone="sand" width="narrow">
          <InquiryForm
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
