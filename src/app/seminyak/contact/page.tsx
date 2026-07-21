import type { Metadata } from "next";
import Image from "next/image";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { ContactForm } from "@/components/property/ContactForm";
import { PROPERTY_SITES } from "@/data/properties";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const site = PROPERTY_SITES.seminyak;

export const metadata: Metadata = {
  title: "Seminyak - Contact Us - Nyuh Bali",
};

/**
 * Contact has no hero slider or booking bar — confirmed by inspecting the
 * live page's structure rather than assuming it mirrors the About page.
 *
 * Because there's no hero, the header renders solid from the first pixel
 * (`overlay` omitted) — a transparent header over a plain sand surface would
 * simply be invisible. The page instead opens on a proper title block, which
 * the old version lacked entirely: it dropped the visitor straight into a
 * photo and a form with nothing naming the page they'd landed on.
 */
export default function SeminyakContactPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/contact" />
      <main>
        <Section tone="canvas" space="loose">
          <SectionHeading eyebrow={site.label} title="Contact Us" as="h1" size="h1" />

          {/* Split at `lg`, not `md`. At 768px the md split gave the photo a
              288×540 column — a 0.53 aspect sliver that cropped the image to a
              vertical strip — while leaving the form only 353px. Below `lg` the
              photo runs full width as a banner and the form gets the full
              column. */}
          <div className="mt-10 grid gap-9 md:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            {/* The photo holds position while the form scrolls beside it —
                the same sticky treatment AboutNarrative gives its heading, so
                both pages read as one design. Stacked, it simply sits above. */}
            <div className="relative h-[320px] w-full overflow-hidden rounded-xl sm:h-[420px] lg:sticky lg:top-24 lg:h-[540px] lg:self-start">
              <Image
                src="https://nyuhbalivillas.com/wp-content/uploads/2023/03/Contact-us-seminyak.webp"
                alt="Nyuh Bali Villas Seminyak"
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
