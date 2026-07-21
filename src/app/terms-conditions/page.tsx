import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { LegalSection } from "@/components/legal/LegalSection";
import { PROPERTY_SITES } from "@/data/properties";
import { TERMS_CONDITIONS_SECTIONS } from "@/data/legal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Terms & Conditions - Nyuh Bali Villas",
};

// Global, not per-property — the live site renders this (and Privacy Policy)
// with the Ubud site's header/footer regardless of which property a visitor
// arrived from, so it's hard-coded to PROPERTY_SITES.ubud rather than taking a
// `site` prop the way About/Contact do. No nav item matches this page, so
// PropertyHeader's active-item marker naturally shows nothing selected, which
// is correct here.
const site = PROPERTY_SITES.ubud;

/**
 * Legal copy is the densest reading on the site, so it runs at the `narrow`
 * Container width rather than the full grid. The heading is left-aligned like
 * every other page on the site — centring a title above a left-aligned wall of
 * text was one of the small mismatches that made the old pages feel assembled
 * rather than designed.
 */
export default function TermsConditionsPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/terms-conditions" />
      <main>
        <Section tone="sand" space="loose" width="narrow">
          <SectionHeading title="Terms & Conditions" as="h1" size="display" />

          <div className="mt-11 flex flex-col gap-10 md:mt-14">
            {TERMS_CONDITIONS_SECTIONS.map((section) => (
              <LegalSection key={section.heading} section={section} />
            ))}
          </div>
        </Section>
      </main>
      <PropertyFooter site={site} />
    </>
  );
}
