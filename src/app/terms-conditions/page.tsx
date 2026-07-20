import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { LegalSection } from "@/components/legal/LegalSection";
import { PROPERTY_SITES } from "@/data/properties";
import { TERMS_CONDITIONS_SECTIONS } from "@/data/legal";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions - Nyuh Bali Villas",
};

// Global, not per-property — the live site renders this (and Privacy
// Policy) with the Ubud site's header/footer regardless of which property
// a visitor arrived from, so it's hard-coded to PROPERTY_SITES.ubud rather
// than taking a `site` prop the way About/Contact do. No nav item matches
// this page, so PropertyHeader's active-item highlighting naturally shows
// nothing selected, which is correct here.
const site = PROPERTY_SITES.ubud;

export default function TermsConditionsPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/terms-conditions" />
      <main className="px-5 py-16">
        <Container className="flex flex-col gap-12">
          <h1 className="font-heading text-center text-[56px] font-normal text-primary">
            Terms &amp; Conditions
          </h1>
          <div className="flex flex-col gap-10">
            {TERMS_CONDITIONS_SECTIONS.map((section) => (
              <LegalSection key={section.heading} section={section} />
            ))}
          </div>
        </Container>
      </main>
      <PropertyFooter site={site} />
    </>
  );
}
