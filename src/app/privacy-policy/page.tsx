import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { LegalSection } from "@/components/legal/LegalSection";
import { PROPERTY_SITES } from "@/data/properties";
import { PRIVACY_POLICY_SECTIONS } from "@/data/legal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy Policy - Nyuh Bali Villas – Your Data Protection & Privacy",
};

// See terms-conditions/page.tsx for why this hard-codes the Ubud site rather
// than taking a `site` prop — same reasoning applies here.
const site = PROPERTY_SITES.ubud;

export default function PrivacyPolicyPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/privacy-policy" />
      <main>
        {/* Same treatment as Terms & Conditions — see the note there. */}
        <Section tone="canvas" space="loose" width="narrow">
          <SectionHeading title="Privacy Policy" as="h1" size="h1" />

          <div className="mt-11 flex flex-col gap-10 md:mt-14">
            {PRIVACY_POLICY_SECTIONS.map((section) => (
              <LegalSection key={section.heading} section={section} />
            ))}
          </div>
        </Section>
      </main>
      <PropertyFooter site={site} />
    </>
  );
}
