import type { Metadata } from "next";
import Image from "next/image";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { ContactForm } from "@/components/property/ContactForm";
import { PROPERTY_SITES } from "@/data/properties";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const site = PROPERTY_SITES.ubud;

// Not copied verbatim — the live /ubud/contact/ never actually renders its
// own <title> (see the routing-bug note below), so this follows the exact
// naming pattern Seminyak's real title uses ("Seminyak - Contact Us -
// Nyuh Bali") rather than leaving it untitled.
export const metadata: Metadata = {
  title: "Ubud - Contact Us - Nyuh Bali",
};

// The live nyuhbalivillas.com/ubud/contact/ currently misroutes — every
// navigation method (direct URL, clicking the real footer link) lands on the
// Seminyak contact page's cached content instead, and no distinct document
// request for that URL ever appears in the network log. That appears to be a
// real bug/caching issue on the live site itself, not something to reproduce.
// Its contact photo still genuinely exists, though — confirmed via the
// WordPress REST API (wp-json/wp/v2/media?search=contact-us), which returned a
// real "contact-us-ubud.webp" attachment uploaded specifically for this page —
// so this uses that real asset with Ubud's own header/footer/form.
export default function UbudContactPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/contact" />
      <main>
        <Section tone="canvas" space="loose">
          <SectionHeading eyebrow={site.label} title="Contact Us" as="h1" size="h1" />

          {/* Split at `lg` — see the note on Seminyak's contact page for the
              measurement behind that. */}
          <div className="mt-10 grid gap-9 md:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="relative h-[320px] w-full overflow-hidden rounded-xl sm:h-[420px] lg:sticky lg:top-24 lg:h-[540px] lg:self-start">
              <Image
                src="https://nyuhbalivillas.com/wp-content/uploads/2023/03/contact-us-ubud.webp"
                alt="Nyuh Bali Villas Ubud"
                fill
                sizes="(min-width: 768px) 560px, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <ContactForm />
          </div>
        </Section>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
