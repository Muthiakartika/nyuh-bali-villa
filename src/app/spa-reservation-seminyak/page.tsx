// ======================================================
// Route Information
// Original WordPress URL:
// /spa-reservation-seminyak/   (WP page ID 144, "Seminyak - SPA booking form")
//
// Current Next.js Route:
// src/app/spa-reservation-seminyak/page.tsx
//
// Catatan slug: top-level di WordPress (bukan di bawah /seminyak/), sama
// seperti /complimentary-services dan kedua halaman legal. Chrome memakai
// PROPERTY_SITES.seminyak karena hanya halaman SPA Seminyak yang menautkannya.
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/spa-reservation-seminyak/
// - internal links: src/app/seminyak/spa/page.tsx -> SPA_RESERVATION_HREF
//   (dipakai oleh setiap "Book Now" dan tombol "Reserve Now")
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
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
  return resolvePageMetadata("/spa-reservation-seminyak");
}



// Field names and options taken from the live WPForms/CF7 form: package[],
// preferred-date, preferred-time, nop, special-request, your-name,
// your-email, your-phone.
//
// What is NOT reproduced: the live page's running "Reservation Review" panel,
// which totals price, tax and the 20% discount live as treatments are ticked.
// That is a pricing calculator wired to the booking backend; this build has no
// backend to price against, and inventing the arithmetic would risk quoting a
// guest a number the business never agreed to. The treatment prices themselves
// are shown verbatim in each option label, and on /seminyak/spa.
const FIELDS = SPA_RESERVATION_FIELDS["spa-reservation-seminyak"];

/** Seminyak — Spa Reservation. The form the SPA page's every "Book Now" and
 * its closing "Reserve Now" lead to. */
export default async function SeminyakSpaReservationPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/spa" />
      <main>

        <Section tone="sand" width="narrow">
          <InquiryForm
            // The only heading on this page, so it is the page title.
            headingAs="h1"
            heading="Spa Reservation"
            fields={FIELDS}
            submitLabel="Send"
            confirmation="Thank you — we have received your spa reservation request and will confirm it by email shortly."
          />
        </Section>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
