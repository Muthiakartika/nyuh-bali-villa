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
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  InquiryForm,
  type InquiryField,
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { PROPERTY_SITES } from "@/data/properties";

export const metadata: Metadata = {
  title: "Spa Booking - Mahamaya Spa - Ubud Nyuh Bali Resort",
};

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2023/03/ezgif.com-gif-maker-19.webp`];

// Same CF7 field set as the Seminyak form. The treatment list here is the
// category level rather than all ~40 individual treatments — the live form
// groups them under seven tabs, and the full menu with every price lives on
// /ubud/spa. As with Seminyak, the live "Reservation Review" running total is
// deliberately not reproduced: it is a pricing calculator with no backend here.
const FIELDS: InquiryField[] = [
  {
    kind: "checkbox",
    name: "package",
    label: "Treatment category",
    options: [
      "Massage",
      "Body Treatment",
      "Hair",
      "Bath",
      "Self Indulgence",
      "Couple Package",
      "Facial",
    ],
  },
  { kind: "date", name: "preferred-date", label: "Date", required: true },
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

export default function UbudSpaBookingFormPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/spa" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Spa booking at Mahamaya Spa, Ubud Nyuh Bali Resort"
          eyebrow="SPA"
          title="Spa Booking"
        />

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
