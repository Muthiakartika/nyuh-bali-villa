import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { LegalSection } from "@/components/legal/LegalSection";
import { PROPERTY_SITES } from "@/data/properties";
import { PRIVACY_POLICY_SECTIONS } from "@/data/legal";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy - Nyuh Bali Villas – Your Data Protection & Privacy",
};

// See terms-conditions/page.tsx for why this hard-codes the Ubud site
// rather than taking a `site` prop — same reasoning applies here.
const site = PROPERTY_SITES.ubud;

export default function PrivacyPolicyPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/privacy-policy" />
      {/* Same treatment as Terms & Conditions — see the note there on why the
          text column is capped rather than running the full Container. */}
      <main className="px-5 py-20 md:py-24">
        <Container className="flex flex-col items-center">
          {/* Steps down below `md` for the same reason as Terms & Conditions. */}
          <h1 className="font-heading text-center text-[40px] leading-tight font-normal text-primary md:text-[56px]">
            Privacy Policy
          </h1>
          <span aria-hidden className="mt-6 block h-px w-16 bg-primary/70" />

          <div className="mt-16 flex w-full max-w-[72ch] flex-col gap-12">
            {PRIVACY_POLICY_SECTIONS.map((section) => (
              <LegalSection key={section.heading} section={section} />
            ))}
          </div>
        </Container>
      </main>
      <PropertyFooter site={site} />
    </>
  );
}
