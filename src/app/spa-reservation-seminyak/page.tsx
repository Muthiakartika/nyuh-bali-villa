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
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  InquiryForm,
  type InquiryField,
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { PROPERTY_SITES } from "@/data/properties";

export const metadata: Metadata = {
  title: "Spa Reservation - Nyuh Bali Villas Seminyak",
};

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2023/03/Seminyak-Spa-2.webp`];

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
const FIELDS: InquiryField[] = [
  {
    kind: "checkbox",
    name: "package",
    label: "Treatment",
    options: [
      "Relaxing Balinese Massage — 60 mins | IDR 390.000++",
      "Relaxing Balinese Massage — 90 mins | IDR 550.000++",
      "Warm Stone Massage — 90 mins | IDR 590.000++",
      "Nyuh Bali Holistic Body Treatment — 100 mins | IDR 640.000++",
      "Cleopatra's Rose Ritual — 120 mins | IDR 850.000++",
      "Romantic Getaway Package — 90 mins | IDR 950.000++",
      "Honeymoon Enjoyment Package — 120 mins | IDR 1.350.000++",
    ],
  },
  { kind: "date", name: "preferred-date", label: "Date", required: true },
  {
    kind: "radio",
    name: "preferred-time",
    label: "Preferred Time",
    options: [
      "10.00",
      "10.30",
      "11.00",
      "11.30",
      "12.00",
      "12.30",
      "13.00",
      "13.30",
      "14.00",
      "14.30",
      "15.00",
      "15.30",
      "16.00",
      "16.30",
      "17.00",
      "17.30",
      "18.00",
    ],
  },
  {
    kind: "radio",
    name: "nop",
    label: "Number of persons",
    options: ["1", "2", "3", "4", "5", "6"],
  },
  { kind: "textarea", name: "special-request", label: "Special Request" },
  { kind: "text", name: "your-name", label: "Name", required: true },
  { kind: "email", name: "your-email", label: "Email", required: true },
  { kind: "tel", name: "your-phone", label: "Phone", required: true },
];

/** Seminyak — Spa Reservation. The form the SPA page's every "Book Now" and
 * its closing "Reserve Now" lead to. */
export default function SeminyakSpaReservationPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/spa" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Spa reservation at Nyuh Bali Villas Seminyak"
          eyebrow="SPA"
          title="Spa Reservation"
        />

        <Section tone="sand" width="narrow">
          <InquiryForm
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
