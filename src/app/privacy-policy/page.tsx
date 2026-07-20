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
      <main className="px-5 py-16">
        <Container className="flex flex-col gap-12">
          <h1 className="font-heading text-center text-[56px] font-normal text-primary">
            Privacy Policy
          </h1>
          <div className="flex flex-col gap-10">
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
