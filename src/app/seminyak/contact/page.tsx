import type { Metadata } from "next";
import Image from "next/image";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { ContactForm } from "@/components/property/ContactForm";
import { PROPERTY_SITES } from "@/data/properties";
import { Container } from "@/components/ui/Container";

const site = PROPERTY_SITES.seminyak;

export const metadata: Metadata = {
  title: "Seminyak - Contact Us - Nyuh Bali",
};

// Unlike the About page, Contact has no hero slider or booking bar — just a
// two-column split (a static photo, then the form) directly below the
// header, confirmed by inspecting the page's actual structure rather than
// assuming it would mirror the About page's layout.
export default function SeminyakContactPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/contact" />
      {/* A grid rather than a flex row: grid items stretch by default, so the
          photo column grows to the full height of the form beside it instead
          of sitting as a short 3/2 letterbox with dead space underneath. The
          min-height covers the single-column mobile case, where there's no
          neighbouring column to take height from. */}
      <main className="px-5 py-20 md:py-24">
        <Container className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative min-h-[360px] w-full overflow-hidden">
            <Image
              src="https://nyuhbalivillas.com/wp-content/uploads/2023/03/Contact-us-seminyak.webp"
              alt="Nyuh Bali Villas Seminyak"
              fill
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <ContactForm />
          </div>
        </Container>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
