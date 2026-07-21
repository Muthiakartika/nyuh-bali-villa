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
      {/* Legal copy is the densest reading on the site, so the column is
          capped at ~72 characters per line rather than running the full
          1080px Container — the same reasoning as AboutNarrative, just a
          slightly wider measure because this is reference material people
          scan rather than read start to finish. */}
      <main className="px-5 py-20 md:py-24">
        <Container className="flex flex-col items-center">
          {/* 56px is the original desktop size; on a 390px screen it wrapped
              to two lines ~140px tall, which is a lot of weight for a legal
              page, so it steps down below `md`. */}
          <h1 className="font-heading text-center text-[40px] leading-tight font-normal text-primary md:text-[56px]">
            Terms &amp; Conditions
          </h1>
          <span aria-hidden className="mt-6 block h-px w-16 bg-primary/70" />

          <div className="mt-16 flex w-full max-w-[72ch] flex-col gap-12">
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
