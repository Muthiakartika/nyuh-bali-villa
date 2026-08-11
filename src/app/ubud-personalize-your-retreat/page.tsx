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
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  InquiryForm,
  type InquiryField,
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud-personalize-your-retreat");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [`${UPLOADS}/2023/05/AW_06640-min.webp`];

// The live form's seven numbered sections, field for field and in order. The
// section numbers are kept in the labels because they are part of the live
// copy, and they are what makes a form this long navigable.
const FIELDS: InquiryField[] = [
  { kind: "text", name: "name", label: "Name", required: true },
  { kind: "text", name: "event", label: "Event" },
  { kind: "text", name: "website", label: "Website" },
  { kind: "email", name: "email", label: "Email", required: true },

  { kind: "date", name: "check-in", label: "1. Your Desired Date — Check-in" },
  { kind: "date", name: "check-out", label: "Check-out" },
  { kind: "text", name: "flexibility", label: "Flexibility +/- days" },
  {
    kind: "number",
    name: "people",
    label: "How many people are you expecting?",
    required: true,
  },
  {
    kind: "number",
    name: "rooms",
    label: "How many rooms do you require?",
    required: true,
  },

  {
    kind: "radio",
    name: "board",
    label: "2. Dining Plan — Choices",
    required: true,
    options: ["Full board", "Half board", "Breakfast only"],
  },
  {
    kind: "checkbox",
    name: "dietary",
    label: "Dietary requirements",
    options: [
      "Vegetarian",
      "Vegan",
      "Mediterranean",
      "Pescatarian",
      "High protein",
      "Gluten free",
      "Balinese style",
      "Regular food",
    ],
  },
  {
    kind: "radio",
    name: "detox-juice",
    label: "Daily Detox Juice",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "jamu",
    label: "Daily Balinese Jamu",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "snack-bar",
    label: "Dedicated Snack Bar",
    options: ["Yes, please", "No, thank you"],
  },

  {
    kind: "radio",
    name: "massage",
    label: "3. Adds ON — Balinese Massage",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "movie-night",
    label: "Movie Night",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "cooking-class",
    label: "Balinese Cooking Class",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "photography",
    label: "Photography service",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "airport-transfer",
    label: "Airport Transfer",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "island-trips",
    label: "Island Trips",
    options: ["Full day (10 hours)", "Half day (5 hours)", "No, thank you"],
  },
  {
    kind: "radio",
    name: "batur-trekking",
    label: "Mt Batur Sunrise Trekking",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "rafting",
    label: "Rafting",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "floating-breakfast",
    label: "Floating Breakfast",
    options: ["Yes, please", "No, thank you"],
  },

  {
    kind: "textarea",
    name: "decoration",
    label:
      "4. Do you require unique decoration during your retreat? (eg : flower decoration on the teak wood)",
  },
  {
    kind: "checkbox",
    name: "equipment",
    label: "5. Equipment",
    options: [
      "Yoga matt",
      "Yoga blocks",
      "Yoga strap",
      "Meditation cushion",
      "Microphone",
      "Projector & screen",
      "Speakers for Music",
      "Whiteboard",
    ],
  },
  {
    kind: "textarea",
    name: "printing",
    label:
      "6. Please specify if you need to print retreat manuals or order customized merchandise for your students",
  },
  {
    kind: "textarea",
    name: "additional",
    label: "7. Is there any additional information you would like requests?",
  },
];

export default function PersonalizeYourRetreatPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat/host-your-own" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Personalize your retreat at Ubud Nyuh Bali Resort"
          eyebrow="Retreat"
          title="Personalize Your Retreat"
        />

        <Section tone="sand" width="narrow">
          <InquiryForm
            heading="Personalize Your Retreat"
            fields={FIELDS}
            submitLabel="Send"
            confirmation="Thank you — our retreat specialist will be in touch with a proposal shortly."
          />
        </Section>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
