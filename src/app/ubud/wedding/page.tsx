// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/wedding/           (WP page ID 303, "Ubud - Wedding")
//
// Current Next.js Route:
// src/app/ubud/wedding/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/wedding/ -> src/app/ubud/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.ubud.navItems
//   (saat ini menu Ubud belum memuat item "Wedding" — lihat catatan di file itu)
// - internal links: src/app/ubud/packages/page.tsx -> WEDDING_HIGHLIGHT
//   (CTA "Explore More" menaut ke /ubud/wedding)
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  PackageList,
  type PackageItem,
} from "@/components/property/PackageList";
import {
  InquiryForm,
  type InquiryField,
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { PROPERTY_SITES } from "@/data/properties";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud/wedding");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

const HERO_IMAGES = [
  `${UPLOADS}/2023/02/Ubud-intimate-wedding-4.jpg`,
  `${UPLOADS}/2023/03/ubud-wedding-1.webp`,
];

// The live page's brochure download is one PDF linked from two buttons; both
// are kept because both appear on the source page.
const BROCHURE_HREF = `${UPLOADS}/2024/06/Intimate-Wedding-Package.pdf`;

const WEDDING_INTRO: PackageItem[] = [
  {
    name: "Intimate Wedding in Ubud",
    images: [
      `${UPLOADS}/2023/03/ubud-wedding-3.webp`,
      `${UPLOADS}/2023/03/ubud-wedding-2.webp`,
      `${UPLOADS}/2023/03/ubud-wedding-1.webp`,
      `${UPLOADS}/2023/03/ezgif.com-gif-maker-15-1.webp`,
    ],
    description:
      "Exchange the vows in Ubud Bali, the unforgettable moment you will be cherished for many years to come. Whether you dream of balinese wedding or classic international wedding, our experienced team are available to handcraft your big day and to prepare every single detail. From the blessing ceremony to find the right decoration and arranging musical performance on your big day, your wedding day will be effortlessly planned to fulfill your dream. Because at Ubud Nyuh Bali Resort, we believe every couple deserves the very best wedding moment, stress and worry free. Let us help you to prepare your once in a life moment.",
    ctas: [
      {
        label: "Download our Wedding Brochure",
        href: BROCHURE_HREF,
        external: true,
      },
      {
        label: "Personalize your Wedding",
        href: BROCHURE_HREF,
        external: true,
        variant: "outline",
      },
    ],
  },
];

// Field-for-field from the live "Personalize your Wedding" form, in the same
// order. Rendered by the shared InquiryForm.
const WEDDING_FIELDS: InquiryField[] = [
  { kind: "text", name: "name", label: "Name", required: true },
  { kind: "email", name: "email", label: "Email", required: true },
  { kind: "date", name: "weddingDate", label: "Your planned wedding date" },
  {
    kind: "date",
    name: "stayDate",
    label: "Your preferred date to stay at Ubud Nyuh Bali",
  },
  {
    kind: "number",
    name: "guests",
    label: "Total invited guests : (Maximum 20 people)",
  },
  {
    kind: "radio",
    name: "accommodation",
    label: "Accomodation for the guests",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "weddingGift",
    label: "Wedding Gift for the guests",
    options: ["Yes", "No"],
  },
  {
    kind: "checkbox",
    name: "entertainment",
    label: "Wedding entertainment",
    options: [
      "Balinese music (rindik)",
      "Balinese dance",
      "Acoustic band",
      "Solo Violin",
      "MC",
      "Balinese Flower Girl",
      "Bird released",
    ],
  },
  {
    kind: "radio",
    name: "legalWedding",
    label: "Legal wedding",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "cuisine",
    label: "Chosen food cuisine",
    options: ["Balinese", "Indonesian", "International", "Vegan"],
  },
  { kind: "text", name: "decorations", label: "Decorations theme" },
  {
    kind: "radio",
    name: "photography",
    label: "Photography Service",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "videography",
    label: "Videography Service",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "hairMakeup",
    label: "Hair Do & Make Up for the Bride",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "costume",
    label: "Wedding costume for bride and groom",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "cake",
    label: "Wedding Cake",
    options: ["Yes", "No"],
  },
  {
    kind: "radio",
    name: "receptionDinner",
    label: "Reception Dinner",
    options: ["Yes", "No"],
  },
  {
    kind: "textarea",
    name: "dream",
    label: "Please tell us your wedding dream",
  },
  { kind: "text", name: "budget", label: "May we know your wedding budget?" },
];

/**
 * Ubud — Wedding. Two sections, in the live page's order: the intimate wedding
 * pitch with its brochure downloads, then the long "Personalize your Wedding"
 * enquiry form.
 *
 * The form sits in a `narrow` Section — the same reading measure the legal
 * pages and the contact form use. Twenty fields across the full 1240px grid
 * would put a 16px input on a 1200px line.
 *
 * No `BookingSearchBar` here: the live wedding page doesn't carry the booking
 * widget, and the page's own action is the enquiry form rather than a
 * room-night search.
 */
export default function UbudWeddingPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/wedding" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Intimate wedding at Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Wedding"
        />

        <PackageList
          eyebrow="Wedding"
          heading="Intimate Wedding in Ubud"
          packages={WEDDING_INTRO}
          tone="sand"
        />

        <Section tone="sand-deep" width="narrow">
          <InquiryForm
            heading="Personalize your Wedding"
            fields={WEDDING_FIELDS}
            submitLabel="Send"
          />
        </Section>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
